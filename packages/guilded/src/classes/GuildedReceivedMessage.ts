import { CrossBuild, ReceivedInteraction, ReceivedInteractionData } from "@crossbuild/core"
import { Message } from "guilded.js"

export type GuildedReceivedMessageData = ReceivedInteractionData & {
	original: Message
}

export class GuildedReceivedMessage extends ReceivedInteraction {
    source: "guilded"
    original: Message

    constructor(crossbuild: CrossBuild, data: GuildedReceivedMessageData) {
        super(crossbuild, data)
        this.source = "guilded"
        this.original = data.original
    }

    public async reply(message: string) {
        return (await this.original.reply(message)).id
    }
}
