import { CrossBuild, GeneratedMessage, ReceivedInteraction, ReceivedInteractionData } from "@crossbuild/core"
import { Message as GJSMessage } from "guilded.js"
import { GuildedMessage } from ".."

export type GuildedReceivedMessageData = ReceivedInteractionData & {
	original: GJSMessage
}

export class GuildedReceivedMessage extends ReceivedInteraction {
    source = "guilded"
    original: GJSMessage

    deferred?: GJSMessage

    constructor(crossbuild: CrossBuild, data: GuildedReceivedMessageData) {
        super(crossbuild, data)
        this.original = data.original
        console.log(this.original.mentions)
    }

    public async reply(message: GeneratedMessage) {
        return new GuildedMessage(await this.original.reply(message))
    }

    public async deferReply() {
        this.deferred = await this.original.reply({ content: "Loading..." })
    }

    public async editReply(message: GeneratedMessage) {
        if (this.deferred) {
            return new GuildedMessage(await this.deferred.edit(message))
        } else {
            throw new Error("Message was not deferred to be edited")
        }
    }

    public async followUp(message: GeneratedMessage) {
        if (this.deferred) {
            return new GuildedMessage(await this.deferred.reply(message))
        }
        return new GuildedMessage(await this.original.reply(message))
    }
}
