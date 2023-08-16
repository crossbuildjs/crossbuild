import { Channel, ChannelData, GeneratedMessage } from "@crossbuild/core"
import { Channel as DJSChannel } from "discord.js"
import { DiscordMessage } from ".."

export class DiscordChannel extends Channel {
    private readonly djsChannel: DJSChannel
    constructor(channel: DJSChannel) {
        const data: ChannelData = channel.isDMBased()
            ? {
                id: channel.id,
                name: null,
                parentId: null,
                topic: null
			  }
            : {
                id: channel.id,
                name: channel.name,
                parentId: channel.parentId || null,
                topic: "topic" in channel ? channel.topic : null
			  }
        super(data)
        this.djsChannel = channel
    }

    get isDm(): boolean {
        return this.djsChannel.isDMBased()
    }

    async send(message: GeneratedMessage): Promise<string> {
        if (!("send" in this.djsChannel)) throw new Error("Cannot send message to this channel")
        return this.djsChannel
            .send(message)
            .then((m) => m.id)
            .catch((e) => {
                throw e
            })
    }

    async fetchMessage(id: string): Promise<DiscordMessage | null> {
        if (!("messages" in this.djsChannel)) throw new Error("Cannot fetch message from this channel")
        const message = await this.djsChannel.messages.fetch(id)
        if (!message) return null
        return new DiscordMessage(message)
    }
}
