import { CrossBuild, LogLevel, ReceivedInteraction, Component, ComponentType, OptionsHandler } from "../index.js"
import { generateEmbed, getFiles } from "@crossbuild/functions"
import { Collection } from "@discordjs/collection"
import path from "path"

export class ComponentHandler {
    public crossbuild: CrossBuild

    constructor(crossbuild: CrossBuild) {
        this.crossbuild = crossbuild
    }

    public async loadFiles() {
        Promise.all(
            this.crossbuild.config.componentPaths.map(async (dirPath) => {
                try {
                    const typePath = path.join(this.crossbuild.__dirname, dirPath)
                    const files = getFiles(typePath, "js", true)

                    for (const fileName of files) {
                        const filePath = path.join(typePath, fileName)
                        const fileUrl = `file://${filePath.replace(/\\/g, "/")}`
                        const file = await import(fileUrl)
                        const component = new file.default(this.crossbuild) as Component
                        this.crossbuild.components.set(`${component.type}-${component.key}`, component)
                    }
                } catch (error) {
                    this.crossbuild.log(`${error}`, LogLevel.DEBUG)
                    this.crossbuild.log(
                        `Failed to load files under ${dirPath}. Make sure you are only giving a subdirectory from ${this.crossbuild.__dirname}`,
                        LogLevel.WARN
                    )
                }
            })
        )
    }

    public reloadFiles() {
        this.crossbuild.components.clear()
        this.loadFiles()
    }

    public fetchComponent(key: string, type: ComponentType) {
        return this.crossbuild.components.get(`${type}-${key}`) || undefined
    }

    public checkCooldown(interaction: ReceivedInteraction, component: Component) {
        if (!component.cooldown) return false
        const componentCooldowns = this.crossbuild.cooldowns.get(`${component.type}-${component.key}`) || new Collection()
        const cooldown = componentCooldowns.get(interaction.user!.id)
        if (cooldown) {
            const timeLeft = cooldown - Date.now()
            if (timeLeft > 0) {
                const seconds = Math.ceil(timeLeft / 1000)
                return interaction.reply(
                    generateEmbed("error", {
                        title: "You are on a cooldown!",
                        description: `You are on cooldown for ${seconds} more second${seconds === 1 ? "" : "s"}.`
                    })
                )
            }
        }
    }

    public setCooldown(interaction: ReceivedInteraction, component: Component) {
        if (!component.cooldown) return
        const componentCooldowns = this.crossbuild.cooldowns.get(`${component.type}-${component.key}`) || new Collection()
        componentCooldowns.set(interaction.user!.id, Date.now() + component.cooldown)
        this.crossbuild.cooldowns.set(`${component.type}-${component.key}`, componentCooldowns)
    }

    public async handleComponent(interaction: ReceivedInteraction) {
        const key = interaction.key
        const type = interaction.type
        if (interaction.isDiscordComponent() && key.startsWith("x-"))
            return this.crossbuild.log(`Ignoring ${type} with key ${key}, it should be handled with a collector on a message.`, LogLevel.DEBUG)
        const component = this.fetchComponent(key, type)
        if (!component) return this.crossbuild.log(`Unable to find ${type} with key ${key}, but it was triggered by a user.`, LogLevel.WARN)

        this.checkCooldown(interaction, component)

        const options = new OptionsHandler(interaction.rawOptions || {}, component.options || [])

        const missingPermissions = await component.validate(interaction, options)
        if (missingPermissions) return interaction.reply(generateEmbed("error", missingPermissions))

        if (component.customChecks) {
            for await (const check of component.customChecks) {
                const checkResult = await check(interaction, component)
                if (checkResult) return interaction.reply(checkResult)
            }
        }

        return this.runComponent(component, interaction, options)
    }

    private async runComponent(component: Component, interaction: ReceivedInteraction, options: OptionsHandler) {
        await component.run(interaction, options).catch(async (error: unknown): Promise<unknown> => {
            this.crossbuild.log(`${error}`, LogLevel.ERROR)
            const toSend = generateEmbed(
                "error",
                {
                    title: "An Error Has Occurred",
                    description: `An unexpected error was encountered while running this ${component.type}, my developers have already been notified! Feel free to join my support server in the mean time!`
                },
                [],
                true,
                this.crossbuild.config.supportLink
            )
            // if (interaction.replied) return interaction.followUp(toSend)
            // if (interaction.deferred) return interaction.editReply(toSend)
            return interaction.reply(toSend)
        })

        this.setCooldown(interaction, component)
    }
}
