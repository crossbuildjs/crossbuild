import { Channel, GeneratedMessage } from "@crossbuild/core"
import { Channel as GJSChannel } from "guilded.js"
import { GuildedMessage } from ".."

export class GuildedChannel extends Channel {
    private readonly gjsChannel: GJSChannel
    constructor(channel: GJSChannel) {
        super({
            id: channel.id,
            name: channel.name,
            parentId: channel.parentId || null,
            topic: channel.topic || null
        })
        this.gjsChannel = channel
    }

    get isDm(): boolean {
        return false // DMs are not supported in the Guilded API
    }

    async send(message: GeneratedMessage): Promise<string> {
        return this.gjsChannel.send(message).then((m) => m.id)
    }

    async fetchMessage(id: string): Promise<GuildedMessage | null> {
        const message = await this.gjsChannel.client.messages.fetch(this.id, id)
        if (!message) return null
        return new GuildedMessage(message)
    }
}
