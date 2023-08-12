import { GeneratedMessage } from "@crossbuild/types"
import { Module, ModuleConfig, Paginator } from "@crossbuild/core"
import { Client, ClientOptions, Interaction, Message } from "discord.js"
import { DiscordReceivedMessage } from ".."

export interface DiscordMessageModuleConfig extends ModuleConfig {
	/** The options to pass to the Discord client */
	options: ClientOptions
	/** The token of your bot */
	token: string
	/** The prefix of your bot's commands */
	prefix: string
}

export class DiscordMessageModule extends Module {
    config: DiscordMessageModuleConfig
    client: Client

    constructor(config: DiscordMessageModuleConfig) {
        super(config)
        this.client = new Client(config.options)
        this.config = config
    }

    public async load() {
        await this.client.login(this.config.token)
        return true
    }

    public async startListening() {
        this.client?.on("interactionCreate", (interaction) => this.interactionHandle(interaction))

        this.client?.on("messageCreate", (message) => this.message(message))
    }

    public async stopListening() {
        this.client?.off("interactionCreate", (interaction) => this.interactionHandle(interaction))
        this.client?.off("messageCreate", (message) => this.message(message))
    }

    private async interactionHandle(interaction: Interaction) {
        if (interaction.isButton() && interaction.customId.startsWith("cb")) {
            const paginator = this.paginators.get(interaction.customId.split(":")[1].split(",")[0])
            if (paginator) return paginator.handlePage(interaction)
        }
    }

    public watchPaginator(paginator: Paginator) {
        this.paginators.set(paginator.id, paginator)
    }

    public unwatchPaginator(paginator: Paginator) {
        this.paginators.delete(paginator.id)
    }

    private async message(discordMessage: Message) {
        if (!discordMessage.content.startsWith(this.config.prefix)) return

        const args = discordMessage.content.slice(this.config.prefix.length).trim().split(/ +/g)
        const command = args.shift()?.toLowerCase()
        if (!command) return

        const flags: { [key: string]: string } = {}
        const regex = /--(\S+)\s+([\s\S]+?)(?=\s+--|$)/g

        let match
        while ((match = regex.exec(discordMessage.content))) {
            flags[match[1]] = match[2]
        }

        const interaction = new DiscordReceivedMessage(this.crossbuild!, {
            id: discordMessage.id,
            key: command,
            type: "command",
            original: discordMessage,
            rawOptions: flags,
            server: discordMessage.guildId
                ? {
                    id: discordMessage.guildId,
                    name: discordMessage.guild?.name,
                    ownerId: discordMessage.guild?.ownerId || undefined,
                    iconURL: discordMessage.guild?.iconURL() || undefined,
                    description: discordMessage.guild?.description || undefined
				  }
                : null,
            user: {
                id: discordMessage.author.id,
                displayName: discordMessage.author.displayName,
                username: discordMessage.author.username,
                avatarURL: discordMessage.author.avatarURL() || undefined
                // permissions: discordMessage.member?.permissions?.toArray() || []
            },
            channel: discordMessage.channel
                ? discordMessage.channel.isDMBased()
                    ? {
                        id: discordMessage.channelId,
                        send: async (message: GeneratedMessage) => {
                            await discordMessage.channel?.send(message)
                        }
					  }
                    : {
                        id: discordMessage.channelId,
                        name: discordMessage.channel.name,
                        parentId: discordMessage.channel.parentId || undefined,
                        send: async (message: GeneratedMessage) => {
                            await discordMessage?.channel?.send(message)
                        }
					  }
                : null
        })
		this.crossbuild!.componentHandler.handleComponent(interaction)
    }
}
