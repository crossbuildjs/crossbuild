import { GeneratedMessage, Message } from "@crossbuild/core"
import { Message as DJSMessage } from "discord.js"

export class DiscordMessage extends Message {
    private readonly djsMessage: DJSMessage
    constructor(msg: DJSMessage) {
        super({
            id: msg.id,
            content: msg.content,
            authorId: msg.author.id,
            channelId: msg.channelId,
            serverId: msg.guildId,
            createdAt: msg.createdAt,
            updatedAt: msg.editedAt
        })
        this.djsMessage = msg
    }

    get url(): string {
        return this.djsMessage.url
    }

    async reply(message: GeneratedMessage): Promise<string> {
        return (await this.djsMessage.reply(message)).id
    }

    async edit(message: GeneratedMessage): Promise<void> {
        await this.djsMessage.edit(message).catch((e) => {
            throw e
        })
    }

    async delete(): Promise<void> {
        await this.djsMessage.delete().catch((e) => {
            throw e
        })
    }
}
