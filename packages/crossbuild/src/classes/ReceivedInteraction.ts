import { ChatInputCommandInteraction, PermissionsString, Message as DiscordMessage } from "discord.js"
import { CrossBuild, LogLevel } from "../index.js"
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
    private readonly client: CrossBuild
    /** The key of this interaction */
    public readonly key: string
    /** The source of this interaction */
    public readonly source: ReceivedInteractionData["source"]
    /** The type of this interaction */
    public readonly type: ReceivedInteractionData["type"]
    /** The original data of the Interaction from Discord, if this was triggered from there */
    public readonly originalDiscordInteraction?: ReceivedInteractionData["originalDiscordInteraction"]
    /** The original data of the Message from Discord, if this was triggered from there */
    public readonly originalDiscordMessage?: ReceivedInteractionData["originalDiscordMessage"]
    /** The original data of the Message from Guilded, if this was triggered from there */
    public readonly originalGuilded?: GuildedMessage
    /** The options of this interaction */
    public readonly options?: ReceivedInteractionData["options"]
    /** The server this interaction was triggered in */
    public readonly server?: {
		id: string
		ownerId?: string
		name?: string
		iconURL?: string
		description?: string
	}

    public channel?: {
		id: string
		name?: string
		parentId?: string
	} & { send: (message: GeneratedMessage) => Promise<void> }

    /** The user that triggered this interaction */
    public user?: {
		id: string
		displayName?: string
		username?: string
		avatarURL?: string
		permissions?: PermissionsString[] | GuildedPermissionString[]
	}

    constructor(client: CrossBuild, data: ReceivedInteractionData) {
        this.client = client

        this.client.log(`${client}`, LogLevel.NULL)
        this.key = data.key
        this.source = data.source
        this.type = data.type

        for (const key in data.options) {
            if (data.options[key] === "true") data.options[key] = true
            if (data.options[key] === "false") data.options[key] = false
            if (parseInt(data.options[key])) data.options[key] = parseInt(data.options[key])
        }

        this.options = data.options

        if (data.originalDiscordInteraction) {
            this.originalDiscordInteraction = data.originalDiscordInteraction
            if (data.originalDiscordInteraction.guild) {
                this.server = {
                    id: data.originalDiscordInteraction.guild.id,
                    ownerId: data.originalDiscordInteraction.guild.ownerId,
                    name: data.originalDiscordInteraction.guild.name,
                    iconURL: data.originalDiscordInteraction.guild.iconURL() || undefined,
                    description: data.originalDiscordInteraction.guild.description || undefined
                }
            } else if (data.originalDiscordInteraction.guildId) {
                this.server = { id: data.originalDiscordInteraction.guildId }
            }
            if (data.originalDiscordInteraction.channel) {
                if (data.originalDiscordInteraction.channel.isDMBased()) {
                    this.channel = {
                        id: data.originalDiscordInteraction.channelId,
                        send: async (message: GeneratedMessage) => {
                            await data.originalDiscordInteraction?.channel?.send(message)
                        }
                    }
                } else {
                    this.channel = {
                        id: data.originalDiscordInteraction.channelId,
                        name: data.originalDiscordInteraction.channel.name,
                        parentId: data.originalDiscordInteraction.channel.parentId || undefined,
                        send: async (message: GeneratedMessage) => {
                            await data.originalDiscordInteraction?.channel?.send(message)
                        }
                    }
                }
            } else {
                this.channel = {
                    id: data.originalDiscordInteraction.channelId,
                    send: async (message: GeneratedMessage) => {
                        const channel = await this.client.discordClient?.channels.fetch(this.channel!.id!)
                        if (channel?.isTextBased()) await channel.send(message)
                    }
                }
            }
            this.user = {
                id: data.originalDiscordInteraction.user.id,
                displayName: data.originalDiscordInteraction.user.username,
                username: data.originalDiscordInteraction.user.username,
                avatarURL: data.originalDiscordInteraction.user.avatarURL() || undefined,
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
            if (data.originalDiscordMessage.guild) {
                this.server = {
                    id: data.originalDiscordMessage.guild.id,
                    ownerId: data.originalDiscordMessage.guild.ownerId,
                    name: data.originalDiscordMessage.guild.name,
                    iconURL: data.originalDiscordMessage.guild.iconURL() || undefined,
                    description: data.originalDiscordMessage.guild.description || undefined
                }
            } else if (data.originalDiscordMessage.guildId) {
                this.server = { id: data.originalDiscordMessage.guildId }
            }
            if (data.originalDiscordMessage.channel) {
                if (data.originalDiscordMessage.channel.isDMBased()) {
                    this.channel = {
                        id: data.originalDiscordMessage.channelId,
                        send: async (message: GeneratedMessage) => {
                            await data.originalDiscordMessage?.channel?.send(message)
                        }
                    }
                } else {
                    this.channel = {
                        id: data.originalDiscordMessage.channelId,
                        name: data.originalDiscordMessage.channel.name,
                        parentId: data.originalDiscordMessage.channel.parentId || undefined,
                        send: async (message: GeneratedMessage) => {
                            await data.originalDiscordMessage?.channel?.send(message)
                        }
                    }
                }
            } else {
                this.channel = {
                    id: data.originalDiscordMessage.channelId,
                    send: async (message: GeneratedMessage) => {
                        const channel = await this.client.discordClient?.channels.fetch(this.channel!.id!)
                        if (channel?.isTextBased()) await channel.send(message)
                    }
                }
            }
            this.user = {
                id: data.originalDiscordMessage.author.id,
                displayName: data.originalDiscordMessage.author.username,
                username: data.originalDiscordMessage.author.username,
                avatarURL: data.originalDiscordMessage.author.avatarURL() || undefined,
                permissions: data.originalDiscordMessage.member?.permissions.toArray() || []
            }
        } else if (data.originalGuilded) {
            this.originalGuilded = data.originalGuilded
            if (this.originalGuilded.server) {
                this.server = {
                    id: this.originalGuilded.server.id,
                    ownerId: this.originalGuilded.server.ownerId,
                    name: this.originalGuilded.server.name,
                    iconURL: this.originalGuilded.server.iconURL || undefined,
                    description: this.originalGuilded.server.description || undefined
                }
            } else if (this.originalGuilded.serverId) {
                this.server = { id: this.originalGuilded.serverId }
            }
            if (this.originalGuilded.channel) {
                this.channel = {
                    id: this.originalGuilded.channel.id,
                    name: this.originalGuilded.channel.name,
                    parentId: this.originalGuilded.channel.parentId || undefined,
                    send: async (message: GeneratedMessage) => {
                        await this.originalGuilded?.channel?.send(message)
                    }
                }
            } else if (this.originalGuilded.channelId) {
                this.channel = {
                    id: this.originalGuilded.channelId,
                    send: async (message: GeneratedMessage) => {
                        const channel = await this.client.guildedClient?.channels.fetch(this.channel!.id!)
                        channel?.send(message)
                    }
                }
            }
            if (this.originalGuilded.author) {
                this.user = {
                    id: this.originalGuilded.author.id,
                    displayName: this.originalGuilded.author.name,
                    username: this.originalGuilded.author.name,
                    avatarURL: this.originalGuilded.author.avatar || undefined,
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
