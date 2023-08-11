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

        this.client?.on("messageCreate", (message) => {
            this.message(message)
        })
    }

    public async stopListening() {
        this.client?.off("interactionCreate", (interaction) => this.interactionHandle(interaction))
        this.client?.off("messageCreate", (message) => {
            this.message(message)
        })
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
            source: "discordMessage",
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

/*

export class DiscordInteractionsModule extends Module {
    config: DiscordInteractionsModuleConfig
    client: Client

    constructor(config: DiscordInteractionsModuleConfig) {
        super(config)
        this.client = new Client(config.options)
        this.config = config
    }

    public async load() {
        await this.client.login(this.config.token)

        try {
            this.client.application?.commands.set(
				this.crossbuild!.components.filter((x) => x.type === "command").map((command) => {
				    const data: ApplicationCommandData = {
				        name: command.key,
				        description: command.description || "No description provided",
				        options: command.options?.map((option) => {
				            return {
				                type:
									option.type === "string"
									    ? ApplicationCommandOptionType.String
									    : option.type === "integer"
									        ? ApplicationCommandOptionType.Integer
									        : option.type === "boolean"
									            ? ApplicationCommandOptionType.Boolean
									            : ApplicationCommandOptionType.String,
				                name: option.name,
				                description: option.description || "No description provided",
				                required: option.required || false,
				                choices: option.choices,
				                min_value: option.minValue,
				                max_value: option.maxValue,
				                min_length: option.minLength,
				                max_length: option.maxLength
				            } as ApplicationCommandOptionData
				        })
				    }
				    return data
				})
            )
        } catch (error) {
			this.crossbuild!.log(`Failed to sync Discord commands: ${error}`, LogLevel.WARN)
        }
        return true
    }

    public async startListening() {
        this.client.on("interactionCreate", (interaction) => {
            if (interaction.isButton() && interaction.customId.startsWith("cb")) {
                const paginator = this.paginators.get(interaction.customId.split(":")[1].split(",")[0])
                if (paginator) return paginator.handlePage(interaction)
            }
            this.interaction(interaction)
        })
    }

    public async stopListening() {
        this.client.off("interactionCreate", (interaction) => {
            this.interaction(interaction)
        })
    }

    public watchPaginator(paginator: Paginator) {
        this.paginators.set(paginator.id, paginator)
    }

    public unwatchPaginator(paginator: Paginator) {
        this.paginators.delete(paginator.id)
    }

    private async interaction(discordInteraction: Interaction<CacheType>) {
        console.log(discordInteraction)
        if (!this.crossbuild) throw new Error("CrossBuild client not loaded")
        const server = discordInteraction.guildId
            ? {
                id: discordInteraction.guildId,
                name: discordInteraction.guild?.name,
                ownerId: discordInteraction.guild?.ownerId || undefined,
                iconURL: discordInteraction.guild?.iconURL() || undefined,
                description: discordInteraction.guild?.description || undefined
			  }
            : null
        const user = {
            id: discordInteraction.user.id,
            displayName: discordInteraction.user.displayName,
            username: discordInteraction.user.username,
            avatarURL: discordInteraction.user.avatarURL() || undefined,
            permissions: discordInteraction.memberPermissions?.toArray() || []
        }

        if (discordInteraction.isChatInputCommand()) {
            const channel = discordInteraction.channel
                ? discordInteraction.channel.isDMBased()
                    ? {
                        id: discordInteraction.channelId,
                        send: async (message: GeneratedMessage) => {
                            await discordInteraction.channel?.send(message)
                        }
					  }
                    : {
                        id: discordInteraction.channelId,
                        name: discordInteraction.channel.name,
                        parentId: discordInteraction.channel.parentId || undefined,
                        send: async (message: GeneratedMessage) => {
                            await discordInteraction?.channel?.send(message)
                        }
					  }
                : null
            const interaction = new DiscordReceivedInteraction(this.crossbuild, {
                id: discordInteraction.id,
                key: discordInteraction.commandName,
                source: "discordInteraction",
                type: "command",
                original: discordInteraction,
                server,
                user,
                channel
            })
            this.crossbuild.componentHandler.handleComponent(interaction)
        } else if (discordInteraction.isButton()) {
            const channel = discordInteraction.channel
                ? discordInteraction.channel.isDMBased()
                    ? {
                        id: discordInteraction.channelId,
                        send: async (message: GeneratedMessage) => {
                            await discordInteraction.channel?.send(message)
                        }
					  }
                    : {
                        id: discordInteraction.channelId,
                        name: discordInteraction.channel.name,
                        parentId: discordInteraction.channel.parentId || undefined,
                        send: async (message: GeneratedMessage) => {
                            await discordInteraction?.channel?.send(message)
                        }
					  }
                : null
            const interaction = new DiscordReceivedInteraction(this.crossbuild, {
                id: discordInteraction.id,
                key: discordInteraction.customId,
                source: "discordInteraction",
                type: "button",
                original: discordInteraction,
                server,
                user,
                channel
            })
            this.crossbuild.componentHandler.handleComponent(interaction)
        } else if (discordInteraction.isAnySelectMenu()) {
            const channel = discordInteraction.channel
                ? discordInteraction.channel.isDMBased()
                    ? {
                        id: discordInteraction.channelId,
                        send: async (message: GeneratedMessage) => {
                            await discordInteraction.channel?.send(message)
                        }
					  }
                    : {
                        id: discordInteraction.channelId,
                        name: discordInteraction.channel.name,
                        parentId: discordInteraction.channel.parentId || undefined,
                        send: async (message: GeneratedMessage) => {
                            await discordInteraction?.channel?.send(message)
                        }
					  }
                : null
            const interaction = new DiscordReceivedInteraction(this.crossbuild, {
                id: discordInteraction.id,
                key: discordInteraction.customId,
                source: "discordInteraction",
                type: "selectMenu",
                original: discordInteraction,
                server,
                user,
                channel,
                selectMenuValues: discordInteraction.values
            })
            this.crossbuild.componentHandler.handleComponent(interaction)
        }
    }
}

*/
