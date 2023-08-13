import { Message } from "@crossbuild/core"
import { Message as GJSMessage } from "guilded.js"

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

    get url(): string {
        return this.gjsMessage.url
    }

    async reply(message: string): Promise<string> {
        return (await this.gjsMessage.reply(message)).id
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
}
