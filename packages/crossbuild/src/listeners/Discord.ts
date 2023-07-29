import { Crossbuild, LogLevel, ReceivedInteraction } from "../index.js"
import { CacheType, Interaction, Message } from "discord.js"

export default class DiscordListeners {
    client: Crossbuild
    constructor(client: Crossbuild) {
        this.client = client
    }

    public async startListening() {
        this.client.discordClient?.on("interactionCreate", (interaction) => {
            this.interaction(interaction)
        })
        this.client.discordClient?.on("messageCreate", (message) => {
            this.message(message)
        })
    }

    public async stopListening() {
        this.client.discordClient?.off("interactionCreate", (interaction) => {
            this.interaction(interaction)
        })
        this.client.discordClient?.off("messageCreate", (message) => {
            this.message(message)
        })
    }

    private async interaction(discordInteraction: Interaction<CacheType>) {
        if (discordInteraction.isChatInputCommand()) {
            const interaction = new ReceivedInteraction(this.client, {
                key: discordInteraction.commandName,
                source: "discordInteraction",
                type: "command",
                originalDiscordInteraction: discordInteraction
            })
            this.client.componentHandler.handleComponent(interaction)
        }
        // else if (discordInteraction.isButton()) {
        //     const interaction = new ReceivedInteraction(this.client, {
        //         key: discordInteraction.customId,
        //         source: "discord",
        //         type: "button"
        //     })
        //     this.client.componentHandler.handleComponent(interaction)
        // } else if (discordInteraction.isAnySelectMenu()) {
        //     const interaction = new ReceivedInteraction(this.client, {
        //         key: discordInteraction.customId,
        //         source: "discord",
        //         type: "dropdown"
        //     })
        //     this.client.componentHandler.handleComponent(interaction)
        // }
    }

    private async message(discordMessage: Message) {
        if (!this.client.config.prefix) return this.client.log("No prefix provided, not listening for commands.", LogLevel.DEBUG)

        if (!discordMessage.content.startsWith(this.client.config.prefix)) return

        const args = discordMessage.content.slice(this.client.config.prefix.length).trim().split(/ +/g)
        const command = args.shift()?.toLowerCase()
        if (!command) return

        const interaction = new ReceivedInteraction(this.client, {
            key: command,
            source: "discordMessage",
            type: "command",
            originalDiscordMessage: discordMessage
        })
        this.client.componentHandler.handleComponent(interaction)
    }
}
