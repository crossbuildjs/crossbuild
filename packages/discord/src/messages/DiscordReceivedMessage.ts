import { CrossBuild, GeneratedMessage, ReceivedInteraction, ReceivedInteractionData } from "@crossbuild/core"
import { Message } from "discord.js"

export type DiscordReceivedMessageData = ReceivedInteractionData & {
	original: Message
}

export class DiscordReceivedMessage extends ReceivedInteraction {
    source: "discordMessage"
    original: Message

    constructor(crossbuild: CrossBuild, data: DiscordReceivedMessageData) {
        super(crossbuild, data)
        this.source = "discordMessage"
        this.original = data.original
    }

    public async reply(message: GeneratedMessage) {
        return (await this.original.reply(message)).id
    }
}
