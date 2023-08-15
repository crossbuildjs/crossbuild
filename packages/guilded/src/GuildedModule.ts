import { Module, ModuleConfig } from "@crossbuild/core"
import { Client, ClientOptions, Message } from "guilded.js"
import { GuildedReceivedMessage } from "./classes/GuildedReceivedMessage"
import { GuildedChannel, GuildedEmojiID, GuildedModulePaginator, GuildedServer, GuildedUser } from "."

export interface GuildedModuleConfig extends ModuleConfig {
	// The options to pass to the Guilded client
	options: ClientOptions
	/** The prefix of your bot's commands */
	prefix: string
}

export class GuildedModule extends Module {
    key = "guilded"
    config: GuildedModuleConfig
    client: Client
    modulePaginator = new GuildedModulePaginator()

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

        // Paginator
        this.client.on("messageReactionCreated", async (reaction) => {
            if (reaction.createdBy === this.client.user!.id) return
            const message = await this.client.messages.fetch(reaction.channelId, reaction.messageId)
            if (!message) throw new Error("Unable to find Guilded message for paginator.")
            const paginator = this.modulePaginator.getMessagesPaginator(message.id)
            if (!paginator) return
            await message.deleteReaction(reaction.emote.id, reaction.createdBy)
            if (reaction.createdBy !== paginator.settings.userId) return
            const { previous, next } = paginator.getPrevNext(paginator.activePage)
            const toSend = this.modulePaginator.createPaginatorMessage(
                paginator.pages[
                    (reaction.emote.id === GuildedEmojiID.ARROW_LEFT
                        ? previous
                        : reaction.emote.id === GuildedEmojiID.ARROW_RIGHT
                            ? next
                            : paginator.activePage) - 1
                ]
            )
            await message.edit(toSend)
            paginator.activePage = reaction.emote.id === GuildedEmojiID.ARROW_LEFT ? previous : next
        })
    }

    public async stopListening() {
        this.client.off("messageCreated", (message) => this.message(message))
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
