import { CrossBuild, GeneratedMessage, ReceivedInteraction, ReceivedInteractionData } from "@crossbuild/core"
import { BaseInteraction } from "discord.js"

export type DiscordReceivedInteractionData = ReceivedInteractionData & {
	original: BaseInteraction
}

export class DiscordReceivedInteraction extends ReceivedInteraction {
    source: "discordInteraction"
    original: BaseInteraction

    constructor(crossbuild: CrossBuild, data: DiscordReceivedInteractionData) {
        super(crossbuild, data)
        this.source = "discordInteraction"
        this.original = data.original
    }

    public async reply(message: GeneratedMessage) {
        if (this.original.isChatInputCommand() || this.original.isButton() || this.original.isAnySelectMenu()) {
            return (await this.original.reply(message)).id
        } else {
            throw new Error("A interaction that could not be replied to was found.")
        }
    }
}
