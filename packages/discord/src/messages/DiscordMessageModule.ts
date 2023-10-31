import { ComponentOption, Module, ModuleConfig } from "@crossbuild/core"
import { Client, ClientOptions, Interaction, Message } from "discord.js"
import {
	DiscordChannel,
	DiscordInteractionModulePaginator,
	DiscordMessage,
	DiscordMessageOptionsHandler,
	DiscordReceivedInteraction,
	DiscordReceivedMessage,
	DiscordServer,
	DiscordUser
} from ".."

export interface DiscordMessageModuleConfig extends ModuleConfig {
	/** The options to pass to the Discord client */
	options: ClientOptions
	/** The token of your bot */
	token: string
	/** The prefix of your bot's commands */
	prefix: string
}

export class DiscordMessageModule extends Module {
	key = "discordMessage"
	config: DiscordMessageModuleConfig
	client: Client
	modulePaginator = new DiscordInteractionModulePaginator()

	constructor(config: DiscordMessageModuleConfig) {
		super(config)
		this.client = new Client(config.options)
		this.config = config
	}

	public async load() {
		await this.client.login(this.config.token)
		return true
	}

	public optionsHandler(
		interaction: DiscordReceivedMessage,
		componentOptions: ComponentOption[]
	): DiscordMessageOptionsHandler {
		return new DiscordMessageOptionsHandler(interaction, componentOptions)
	}

	public async startListening() {
		this.client?.on("interactionCreate", (interaction) =>
			this.interactionHandle(interaction)
		)

		this.client?.on("messageCreate", (message) => this.message(message))
	}

	public async stopListening() {
		this.client?.off("interactionCreate", (interaction) =>
			this.interactionHandle(interaction)
		)
		this.client?.off("messageCreate", (message) => this.message(message))
	}

	private async interactionHandle(discordInteraction: Interaction) {
		if (
			discordInteraction.isButton() &&
			discordInteraction.customId.startsWith("cb")
		) {
			const paginator = this.modulePaginator.paginators.get(
				discordInteraction.customId.split(":")[1].split(",")[0]
			)
			const interaction = new DiscordReceivedInteraction(this.crossbuild!, {
				id: discordInteraction.id,
				key: discordInteraction.customId,
				type: "button",
				original: discordInteraction,
				server: discordInteraction.guild
					? new DiscordServer(discordInteraction.guild)
					: null,
				user: new DiscordUser(discordInteraction.user),
				channel: discordInteraction.channel
					? new DiscordChannel(discordInteraction.channel)
					: null
			})
			if (paginator)
				return this.modulePaginator.handlePage(paginator, interaction)
		}
	}

	private async message(discordMessage: Message) {
		this.crossbuild?.emit("message", new DiscordMessage(discordMessage))
		if (!discordMessage.content.startsWith(this.config.prefix)) return

		const args = discordMessage.content
			.slice(this.config.prefix.length)
			.trim()
			.split(/ +/g)
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
			server: discordMessage.guild
				? new DiscordServer(discordMessage.guild)
				: null,
			user: new DiscordUser(discordMessage.author),
			channel: new DiscordChannel(discordMessage.channel)
		})
		this.crossbuild!.componentHandler.handleComponent(interaction)
	}
}
