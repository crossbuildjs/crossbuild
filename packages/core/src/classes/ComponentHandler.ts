import path from "path"
import { Collection } from "@discordjs/collection"
import {
    Component,
    ComponentType,
    CrossBuild,
    OptionsHandler,
    ReceivedInteraction,
    generateEmbed,
    getFiles
} from ".."

export class ComponentHandler {
    public crossbuild: CrossBuild

    constructor(crossbuild: CrossBuild) {
        this.crossbuild = crossbuild
    }

    public async loadFiles() {
        Promise.all(
            this.crossbuild.config.componentPaths.map(async (dirPath) => {
                try {
                    const typePath = path.join(
                        this.crossbuild.__dirname,
                        dirPath
                    )
                    const files = getFiles(typePath, "js", true)

                    for (const fileName of files) {
                        const filePath = path.join(typePath, fileName)
                        const fileUrl = `file://${filePath.replace(/\\/g, "/")}`
                        const file = await import(fileUrl)
                        const component = new file.default(
                            this.crossbuild
                        ) as Component
                        this.crossbuild.components.set(
                            `${component.type}-${component.key}`,
                            component
                        )
                    }
                } catch (error) {
                    this.crossbuild.emit("debug", `${error}`)
                    this.crossbuild.emit(
                        "error",
                        `Failed to load files under ${dirPath}. Make sure you are only giving a subdirectory from ${this.crossbuild.__dirname}`
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

    public checkCooldown(
        interaction: ReceivedInteraction,
        component: Component
    ) {
        if (!component.cooldown) return false
        const componentCooldowns =
            this.crossbuild.cooldowns.get(
                `${component.type}-${component.key}`
            ) || new Collection()
        const cooldown = componentCooldowns.get(interaction.user!.id)
        if (cooldown) {
            const timeLeft = cooldown - Date.now()
            if (timeLeft > 0) {
                const seconds = Math.ceil(timeLeft / 1000)
                return interaction.reply(
                    generateEmbed("error", {
                        title: "You are on a cooldown!",
                        description: `You are on cooldown for ${seconds} more second${
                            seconds === 1 ? "" : "s"
                        }.`
                    })
                )
            }
        }
    }

    public setCooldown(interaction: ReceivedInteraction, component: Component) {
        if (!component.cooldown) return
        const componentCooldowns =
            this.crossbuild.cooldowns.get(
                `${component.type}-${component.key}`
            ) || new Collection()
        componentCooldowns.set(
            interaction.user!.id,
            Date.now() + component.cooldown
        )
        this.crossbuild.cooldowns.set(
            `${component.type}-${component.key}`,
            componentCooldowns
        )
    }

    public async handleComponent(interaction: ReceivedInteraction) {
        const key = interaction.key
        const type = interaction.type
        if (interaction.isDiscordComponent() && key.startsWith("x-"))
            return this.crossbuild.emit(
                "debug",
                `Ignoring ${type} with key ${key}, it should be handled with a collector on a message.`
            )
        const component = this.fetchComponent(key, type)
        if (!component)
            return this.crossbuild.emit(
                "warn",
                `Unable to find ${type} with key ${key}, but it was triggered by a user.`
            )

        this.checkCooldown(interaction, component)

        const module = this.getModule(interaction.source)
        const options = module.optionsHandler(
            interaction,
            component.options || []
        )

        const missingPermissions = await component.validate(
            interaction,
            options
        )
        if (missingPermissions)
            return interaction.reply(generateEmbed("error", missingPermissions))

        if (component.customChecks) {
            for await (const check of component.customChecks) {
                const checkResult = await check(interaction, component)
                if (checkResult) return interaction.reply(checkResult)
            }
        }

        return this.runComponent(component, interaction, options)
    }

    private getModule(source: string) {
        const module = this.crossbuild.modules.get(source)
        if (!module) throw new Error(`Module ${source} does not exist.`)
        return module
    }

    private async runComponent(
        component: Component,
        interaction: ReceivedInteraction,
        options: OptionsHandler
    ) {
        await component
            .run(interaction, options)
            .catch(async (error: unknown): Promise<unknown> => {
                this.crossbuild.emit("error", `${error}`)
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
