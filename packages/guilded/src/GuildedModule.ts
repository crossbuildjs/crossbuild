import { LogLevel, Module, ModuleConfig, Paginator } from "@crossbuild/core"
import { Client, ClientOptions, Message } from "guilded.js"
import { GuildedReceivedMessage } from "./classes/GuildedReceivedMessage"
import { GuildedChannel, GuildedServer, GuildedUser } from "."

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
        this.client.on("messageCreated", (message) => this.message(message))
        // this.client?.on("messageReactionCreated", (reaction) => {
        //     console.log(reaction)
        //     const paginator = this.paginators.get(reaction.messageId)
        //     if (paginator) return paginator.handleGuildedReaction(reaction)
        // })
    }

    public async stopListening() {
        this.client.off("messageCreated", (message) => this.message(message))
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

        const channel: GuildedChannel | null = guildedMessage.channel
            ? new GuildedChannel(guildedMessage.channel)
            : guildedMessage.channelId
                ? new GuildedChannel(await this.client.channels.fetch(guildedMessage.channelId))
                : null

        const server: GuildedServer | null = guildedMessage.server
            ? new GuildedServer(guildedMessage.server)
            : guildedMessage.serverId
                ? new GuildedServer(await this.client.servers.fetch(guildedMessage.serverId))
                : null

        const user: GuildedUser | null = guildedMessage.author ? new GuildedUser(guildedMessage.author) : null

        const interaction = new GuildedReceivedMessage(this.crossbuild!, {
            id: guildedMessage.id,
            key: command,
            type: "command",
            original: guildedMessage,
            rawOptions: flags,
            server,
            channel,
            user
        })
		this.crossbuild!.componentHandler.handleComponent(interaction)
    }
}
