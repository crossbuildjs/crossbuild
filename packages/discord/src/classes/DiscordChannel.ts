import { Channel, ChannelData, GeneratedMessage } from "@crossbuild/core"
import { TextBasedChannel as DJSTextBasedChannel } from "discord.js"
import { DiscordMessage } from ".."

export class DiscordChannel extends Channel {
    private readonly djsChannel: DJSTextBasedChannel
    constructor(channel: DJSTextBasedChannel) {
        const data: ChannelData = channel.isDMBased()
            ? {
                id: channel.id,
                name: null,
                parentId: null,
                description: null
			  }
            : {
                id: channel.id,
                name: channel.name,
                parentId: channel.parentId,
                description: "topic" in channel ? channel.topic : null
			  }
        super(data)
        this.djsChannel = channel
    }

    get isDm(): boolean {
        return this.djsChannel.isDMBased()
    }

    async send(message: GeneratedMessage): Promise<string> {
        return this.djsChannel
            .send(message)
            .then((m) => m.id)
            .catch((e) => {
                throw e
            })
    }

    async fetchMessage(id: string): Promise<DiscordMessage> {
        const message = await this.djsChannel.messages.fetch(id)
        if (!message) throw new Error("Message not found")
        return new DiscordMessage(message)
    }
}
