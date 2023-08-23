import { Message } from "@crossbuild/core"
import { Message as GJSMessage } from "guilded.js"
import { GuildedEmojiID, createMessageData } from ".."

export class GuildedMessage extends Message {
    private readonly gjsMessage: GJSMessage
    constructor(msg: GJSMessage) {
        super({
            id: msg.id,
            content: msg.content,
            authorId: msg.authorId,
            channelId: msg.channelId,
            serverId: msg.serverId,
            createdAt: msg.createdAt,
            updatedAt: msg.updatedAt
        })
        this.gjsMessage = msg
    }

    toString(): string {
        return JSON.parse(
            JSON.stringify(this, (key, value) => {
                if (key === "gjsMessage") return undefined
                return value
            })
        )
    }

    get url(): string {
        return this.gjsMessage.url
    }

    async reply(message: string): Promise<string> {
        return (await this.gjsMessage.reply(createMessageData(message))).id
    }

    async edit(message: string): Promise<void> {
        await this.gjsMessage.edit(message).catch((e) => {
            throw e
        })
    }

    async delete(): Promise<void> {
        await this.gjsMessage.delete().catch((e) => {
            throw e
        })
    }

    async react(emoji: GuildedEmojiID | number) {
        await this.gjsMessage.client.reactions.create(this.gjsMessage.channelId, this.gjsMessage.id, emoji).catch((e) => {
            throw e
        })
    }
}
