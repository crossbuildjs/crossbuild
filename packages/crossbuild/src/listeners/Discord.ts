import { Crossbuild, ReceivedInteraction } from "../index.js"
import { CacheType, Interaction } from "discord.js"

export default class DiscordListeners {
    client: Crossbuild
    constructor(client: Crossbuild) {
        this.client = client
    }

    public async startListening() {
        this.client.discordClient?.on("interactionCreate", (interaction) => {
            this.interaction(interaction)
        })
    }

    public async stopListening() {
        this.client.discordClient?.off("interactionCreate", (interaction) => {
            this.interaction(interaction)
        })
    }

    private async interaction(discordInteraction: Interaction<CacheType>) {
        if (discordInteraction.isChatInputCommand()) {
            const interaction = new ReceivedInteraction(this.client, {
                key: discordInteraction.commandName,
                source: "discord",
                type: "command",
                originalDiscord: discordInteraction
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
}
