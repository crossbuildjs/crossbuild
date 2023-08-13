import { CrossBuild, GeneratedMessage, ReceivedInteraction, ReceivedInteractionData } from "@crossbuild/core"
import { Message as DJSMessage } from "discord.js"

export type DiscordReceivedMessageData = ReceivedInteractionData & {
	original: DJSMessage
}

export class DiscordReceivedMessage extends ReceivedInteraction {
    source: "discordMessage"
    original: DJSMessage

    constructor(crossbuild: CrossBuild, data: DiscordReceivedMessageData) {
        super(crossbuild, data)
        this.source = "discordMessage"
        this.original = data.original
    }

    public async reply(message: GeneratedMessage) {
        return (await this.original.reply(message)).id
    }
}
