import { CrossBuild, GeneratedMessage, ReceivedInteraction, ReceivedInteractionData } from "@crossbuild/core"
import { Message as DJSMessage } from "discord.js"
import { DiscordMessage } from ".."

export type DiscordReceivedMessageData = ReceivedInteractionData & {
	original: DJSMessage
}

export class DiscordReceivedMessage extends ReceivedInteraction {
    source: "discordMessage"
    original: DJSMessage

    deferred?: DJSMessage

    constructor(crossbuild: CrossBuild, data: DiscordReceivedMessageData) {
        super(crossbuild, data)
        this.source = "discordMessage"
        this.original = data.original
    }

    public async reply(message: GeneratedMessage) {
        return new DiscordMessage(await this.original.reply(message))
    }

    public async deferReply() {
        this.deferred = await this.original.reply({ content: "Loading..." })
    }

    public async editReply(message: GeneratedMessage) {
        if (this.deferred) {
            return new DiscordMessage(await this.deferred.edit(message))
        } else {
            throw new Error("Message was not deferred to be edited")
        }
    }

    public async followUp(message: GeneratedMessage) {
        if (this.deferred) {
            return new DiscordMessage(await this.deferred.reply(message))
        }
        return new DiscordMessage(await this.original.reply(message))
    }
}
