import { GeneratedMessage } from "@crossbuild/types"
import { LogLevel, Module, ModuleConfig, Paginator } from "@crossbuild/core"
import { Router } from "itty-router"
import {
	APIApplicationCommandInteraction,
	APIInteraction,
	APIMessageComponentInteraction,
	ChannelType,
	ComponentType,
	InteractionResponseType,
	InteractionType,
	Routes
} from "discord-api-types/v10"
import { isValidRequest, PlatformAlgorithm } from "discord-verify"
import { WorkerReceivedInteraction, WorkerReceivedInteractionData } from ".."
import { REST } from "@discordjs/rest"

export interface WorkerModuleConfig extends ModuleConfig {
	/** The public key that is checked for interactions from Discord */
	publicKey: string
	/** Your Discord bot token */
	token: string
}

export class WorkerModule extends Module {
	client: REST
	config: WorkerModuleConfig
	router = Router()

	constructor(config: WorkerModuleConfig) {
		super(config)
		this.config = config

		this.client = new REST({ version: "10" }).setToken(config.token)

		this.router.post("/interaction", async (request: Request) => {
			const reqData = (await request.json()) as APIInteraction

			// Ping
			if (reqData.type === InteractionType.Ping) {
				return new Response(JSON.stringify({ type: InteractionResponseType.Pong }), {
					headers: {
						"content-type": "application/json;charset=UTF-8"
					}
				})
			}

			if (reqData.type === InteractionType.ModalSubmit || reqData.type === InteractionType.ApplicationCommandAutocomplete) {
				throw new Error("Not implemented")
			}

			this.interaction(reqData)
			return new Response(JSON.stringify({ type: InteractionResponseType.DeferredChannelMessageWithSource }), {
				headers: {
					"content-type": "application/json;charset=UTF-8"
				}
			})
		})

		this.router.all("*", () => {
			return new Response("Not found", {
				status: 404
			})
		})
	}

	/**
	 * The handler that is exposed to the worker.
	 * @example
	 * ```js
	 * const workerModule = new WorkerModule()
	 *
	 * addEventListener("fetch", (event) => {
	 *     event.respondWith(workerModule.handle(event.request))
	 * })
	 * ```
	 */
	public async handle(request: Request) {
		if (request.method === "POST" && request.url.includes("/interaction")) {
			const isValid = await isValidRequest(request, this.config.publicKey, PlatformAlgorithm.Cloudflare)
			if (!isValid) {
				return new Response("Invalid request signature", { status: 401 })
			}
		}
		return this.router.handle(request)
	}

	public async load() {
		return true
	}

	public async startListening() {}

	public async stopListening() {
		this.crossbuild?.log("Cannot stop listening for the @crossbuild/worker module", LogLevel.WARN)
	}

	public watchPaginator(paginator: Paginator) {
		this.crossbuild?.log(`${paginator}`, LogLevel.NULL)
		// if (!paginator.guildedMessageId) throw new Error("Guilded paginator must have a guildedMessageId")
		// this.paginators.set(paginator.guildedMessageId, paginator)
	}

	public unwatchPaginator(paginator: Paginator) {
		this.paginators.delete(paginator.id)
	}

	private async interaction(discordInteraction: Extract<APIInteraction, APIApplicationCommandInteraction | APIMessageComponentInteraction>) {
		if (!this.crossbuild) throw new Error("CrossBuild client not loaded")
		const server: WorkerReceivedInteractionData["server"] = discordInteraction.guild_id
			? {
					id: discordInteraction.guild_id
			  }
			: null
		const user: WorkerReceivedInteractionData["user"] = discordInteraction.user
			? {
					id: discordInteraction.user.id,
					username: discordInteraction.user.username,
					avatarURL: `https://cdn.discordapp.com/avatars/${discordInteraction.user?.id}/${discordInteraction.user?.avatar}.png`
			  }
			: discordInteraction.member
			? {
					id: discordInteraction.member.user.id,
					username: discordInteraction.member.user.username,
					avatarURL: `https://cdn.discordapp.com/avatars/${discordInteraction.member.user?.id}/${discordInteraction.member.user?.avatar}.png`
			  }
			: { id: "" }
		const channel: WorkerReceivedInteractionData["channel"] = discordInteraction.channel
			? discordInteraction.channel.type === ChannelType.DM || discordInteraction.channel.type === ChannelType.GroupDM
				? {
						id: discordInteraction.channel.id,
						send: async (message: GeneratedMessage) => {
							this.client.post(Routes.channelMessages(discordInteraction.channel.id), {
								body:
									typeof message === "string"
										? { content: message }
										: { content: message.content, embeds: message.embeds, components: message.components }
							})
						}
				  }
				: {
						id: discordInteraction.channel.id,
						name: discordInteraction.channel.name,
						parentId: discordInteraction.channel.parent_id || undefined,
						send: async (message: GeneratedMessage) => {
							this.client.post(Routes.channelMessages(discordInteraction.channel.id), {
								body:
									typeof message === "string"
										? { content: message }
										: { content: message.content, embeds: message.embeds, components: message.components }
							})
						}
				  }
			: null

		const data: WorkerReceivedInteractionData = {
			id: discordInteraction.id,
			key: discordInteraction.type === InteractionType.ApplicationCommand ? discordInteraction.data.name : discordInteraction.data.custom_id,
			type:
				discordInteraction.type === InteractionType.ApplicationCommand
					? "command"
					: discordInteraction.data.component_type === ComponentType.Button
					? "button"
					: "selectMenu",
			original: discordInteraction,
			server,
			user,
			channel,
			module: this,
			webhook: {
				id: discordInteraction.id,
				token: discordInteraction.token
			}
		}

		if (
			discordInteraction.type === InteractionType.MessageComponent &&
			(discordInteraction.data.component_type === ComponentType.StringSelect ||
				discordInteraction.data.component_type === ComponentType.RoleSelect ||
				discordInteraction.data.component_type === ComponentType.UserSelect ||
				discordInteraction.data.component_type === ComponentType.ChannelSelect ||
				discordInteraction.data.component_type === ComponentType.MentionableSelect)
		) {
			data.selectMenuValues = discordInteraction.data.values
		}
		const interaction = new WorkerReceivedInteraction(this.crossbuild, data)
		this.crossbuild.componentHandler.handleComponent(interaction)
	}
}
