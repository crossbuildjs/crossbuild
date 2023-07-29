import { ChatInputCommandInteraction, PermissionsString, Message as DiscordMessage } from "discord.js"
import { Crossbuild, LogLevel } from "../index.js"
import { GeneratedMessage, GuildedPermissionString } from "@crossbuild/types"
import { Message as GuildedMessage } from "guilded.js"

interface ReceivedInteractionData {
	key: string
	source: "discordInteraction" | "discordMessage" | "guilded" | "http"
	type: "command"
	originalDiscordInteraction?: ChatInputCommandInteraction
	originalDiscordMessage?: DiscordMessage
	originalGuilded?: GuildedMessage
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	options?: { [key: string]: any }
}

export default class ReceivedInteraction {
    private readonly client: Crossbuild
    public readonly key: string
    public readonly source: ReceivedInteractionData["source"]
    public readonly type: ReceivedInteractionData["type"]
    public readonly originalDiscordInteraction?: ReceivedInteractionData["originalDiscordInteraction"]
    public readonly originalDiscordMessage?: ReceivedInteractionData["originalDiscordMessage"]
    public readonly originalGuilded?: GuildedMessage
    public readonly options?: ReceivedInteractionData["options"]
    public readonly server?: { id: string; ownerId?: string }
    public user?: {
		id: string
		displayName?: string
		username?: string
		avatarURL?: string | null
		permissions?: PermissionsString[] | GuildedPermissionString[]
	}

    constructor(client: Crossbuild, data: ReceivedInteractionData) {
        this.client = client

        this.client.log(`${client}`, LogLevel.NULL)
        this.key = data.key
        this.source = data.source
        this.type = data.type

        if (data.originalDiscordInteraction) {
            this.originalDiscordInteraction = data.originalDiscordInteraction
            if (data.originalDiscordInteraction.guild)
                this.server = { id: data.originalDiscordInteraction.guild.id, ownerId: data.originalDiscordInteraction.guild.ownerId }
            this.user = {
                id: data.originalDiscordInteraction.user.id,
                displayName: data.originalDiscordInteraction.user.username,
                username: data.originalDiscordInteraction.user.username,
                avatarURL: data.originalDiscordInteraction.user.avatarURL(),
                permissions: data.originalDiscordInteraction.memberPermissions?.toArray() || []
            }
            const interactionOptions = data.originalDiscordInteraction.options.data
            if (interactionOptions) {
                this.options = {}
                for (const option of interactionOptions) {
                    this.options[option.name] = option.value
                }
            }
        } else if (data.originalDiscordMessage) {
            this.originalDiscordMessage = data.originalDiscordMessage
            if (data.originalDiscordMessage.guild)
                this.server = { id: data.originalDiscordMessage.guild.id, ownerId: data.originalDiscordMessage.guild.ownerId }
            this.user = {
                id: data.originalDiscordMessage.author.id,
                displayName: data.originalDiscordMessage.author.username,
                username: data.originalDiscordMessage.author.username,
                avatarURL: data.originalDiscordMessage.author.avatarURL(),
                permissions: data.originalDiscordMessage.member?.permissions.toArray() || []
            }
        } else if (data.originalGuilded) {
            this.originalGuilded = data.originalGuilded
            if (this.originalGuilded.server) {
                this.server = { id: this.originalGuilded.server.id, ownerId: this.originalGuilded.server.ownerId }
            } else if (this.originalGuilded.serverId) {
                this.server = { id: this.originalGuilded.serverId }
            }
            if (this.originalGuilded.author) {
                this.user = {
                    id: this.originalGuilded.author.id,
                    displayName: this.originalGuilded.author.name,
                    username: this.originalGuilded.author.name,
                    avatarURL: this.originalGuilded.author.avatar,
                    permissions: []
                }
            } else {
                this.user = { id: this.originalGuilded.authorId }
            }
        }
    }

    public isDiscordComponent() {
        return this.source === "discordInteraction" && this.type !== "command"
    }

    public async reply(message: GeneratedMessage) {
        switch (this.source) {
            case "discordInteraction":
                if (!this.originalDiscordInteraction) throw new Error("Cannot reply to a Discord interaction without the original interaction.")
                await this.originalDiscordInteraction.reply(message)
                break
            case "discordMessage":
                if (!this.originalDiscordMessage) throw new Error("Cannot reply to a Discord message without the original message.")
                await this.originalDiscordMessage.reply(message)
                break
            case "guilded":
                if (!this.originalGuilded) throw new Error("Cannot reply to a Guilded message without the original message.")
                await this.originalGuilded.reply(message).catch((err) => {
                    this.client.log(err, LogLevel.ERROR)
                })
                break
            case "http":
            default:
                throw new Error("Cannot reply to a non-Discord interaction.")
        }
        return
    }
}
