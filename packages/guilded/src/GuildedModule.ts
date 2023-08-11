import { GeneratedMessage } from "@crossbuild/types"
import { LogLevel, Module, ModuleConfig, Paginator } from "@crossbuild/core"
import { Client, ClientOptions, Message } from "guilded.js"
import { GuildedReceivedMessage } from "./GuildedReceivedMessage"

export interface GuildedModuleConfig extends ModuleConfig {
	// The options to pass to the Guilded client
	options: ClientOptions
	/** The prefix of your bot's commands */
	prefix: string
}

export class GuildedModule extends Module {
    config: GuildedModuleConfig
    client: Client

    constructor(config: GuildedModuleConfig) {
        super(config)
        this.client = new Client(config.options)
        this.config = config
    }

    public async load() {
        await this.client.login()
        return true
    }

    public async startListening() {
        this.client.on("messageCreated", (message) => {
            this.message(message)
        })
        // this.client?.on("messageReactionCreated", (reaction) => {
        //     console.log(reaction)
        //     const paginator = this.paginators.get(reaction.messageId)
        //     if (paginator) return paginator.handleGuildedReaction(reaction)
        // })
    }

    public async stopListening() {
        this.client.off("messageCreated", (message) => {
            this.message(message)
        })
    }

    public watchPaginator(paginator: Paginator) {
        this.crossbuild?.log(`${paginator}`, LogLevel.NULL)
        // if (!paginator.guildedMessageId) throw new Error("Guilded paginator must have a guildedMessageId")
        // this.paginators.set(paginator.guildedMessageId, paginator)
    }

    public unwatchPaginator(paginator: Paginator) {
        this.paginators.delete(paginator.id)
    }

    private async message(guildedMessage: Message) {
        if (!guildedMessage.content.startsWith(this.config.prefix)) return

        const args = guildedMessage.content.slice(this.config.prefix.length).trim().split(/ +/g)
        const command = args.shift()?.toLowerCase()
        if (!command) return

        const flags: { [key: string]: string } = {}
        const regex = /--([^\s]+) ([^\s]+)/g

        let match
        while ((match = regex.exec(guildedMessage.content))) {
            flags[match[1]] = match[2]
        }

        const interaction = new GuildedReceivedMessage(this.crossbuild!, {
            id: guildedMessage.id,
            key: command,
            source: "guilded",
            type: "command",
            original: guildedMessage,
            rawOptions: flags,
            server: guildedMessage.server
                ? {
                    id: guildedMessage.server.id,
                    ownerId: guildedMessage.server.ownerId,
                    name: guildedMessage.server.name,
                    iconURL: guildedMessage.server.iconURL || undefined,
                    description: guildedMessage.server.description || undefined
				  }
                : guildedMessage.serverId
                    ? { id: guildedMessage.serverId }
                    : null,
            channel: guildedMessage.channel
                ? {
                    id: guildedMessage.channel.id,
                    name: guildedMessage.channel.name,
                    parentId: guildedMessage.channel.parentId || undefined,
                    send: async (message: GeneratedMessage) => {
                        await guildedMessage.channel?.send(message)
                    }
				  }
                : guildedMessage.channelId
                    ? {
                        id: guildedMessage.channelId,
                        send: async (message: GeneratedMessage) => {
                            const channel = await this.client.channels.fetch(guildedMessage.channelId)
                            channel?.send(message)
                        }
				  }
                    : null,
            user: guildedMessage.author
                ? {
                    id: guildedMessage.author.id,
                    displayName: guildedMessage.author.name,
                    username: guildedMessage.author.name,
                    avatarURL: guildedMessage.author.avatar || undefined
                    // permissions: []
				  }
                : { id: guildedMessage.authorId }
        })
		this.crossbuild!.componentHandler.handleComponent(interaction)
    }
}
