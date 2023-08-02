import { ChatInputCommandInteraction, PermissionsString, Message as DiscordMessage } from "discord.js"
import { CrossBuild, InteractionRawOptions, LogLevel } from "../index.js"
import { GeneratedMessage, GuildedPermissionString } from "@crossbuild/types"
import { Message as GuildedMessage } from "guilded.js"

export interface ReceivedInteractionData {
    key: string
    source: "discordInteraction" | "discordMessage" | "guilded" | "http"
    type: "command"
    originalDiscordInteraction?: ChatInputCommandInteraction
    originalDiscordMessage?: DiscordMessage
    originalGuildedMessage?: GuildedMessage
    server: {
        id: string
        ownerId?: string
        name?: string
        iconURL?: string
        description?: string
    } | null
    channel: ({
        id: string
        name?: string
        parentId?: string
    } & { send: (message: GeneratedMessage) => Promise<void> }) | null
    user: {
        id: string
        displayName?: string
        username?: string
        avatarURL?: string
        permissions?: PermissionsString[] | GuildedPermissionString[]
    }
    rawOptions?: InteractionRawOptions
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
    public readonly originalGuildedMessage?: ReceivedInteractionData["originalGuildedMessage"]
    /** The raw unprocessed options of this interaction */
    public readonly rawOptions: ReceivedInteractionData["rawOptions"]
    /** The server this interaction was triggered in */
    public readonly server?: ReceivedInteractionData["server"]
    /** The channel this interaction was triggered in */
    public channel?: ReceivedInteractionData["channel"]
    /** The user that triggered this interaction */
    public user?: ReceivedInteractionData["user"]


    constructor(client: CrossBuild, data: ReceivedInteractionData) {
        this.client = client

        this.client.log(`${client}`, LogLevel.NULL)
        this.key = data.key
        this.source = data.source
        this.type = data.type

        this.rawOptions = {}
        for (const key in data.rawOptions) {
            let value = data.rawOptions[key]
            if (typeof value === "string") {
                if (parseInt(value)) value = parseInt(value)
                if (value === "true") value = true
                if (value === "false") value = false

            }
            this.rawOptions[key] = value
        }



        this.server = data.server
        this.channel = data.channel
        this.user = data.user

        this.originalDiscordInteraction = data.originalDiscordInteraction || undefined
        this.originalDiscordMessage = data.originalDiscordMessage || undefined
        this.originalGuildedMessage = data.originalGuildedMessage || undefined
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
                if (!this.originalGuildedMessage) throw new Error("Cannot reply to a Guilded message without the original message.")
                await this.originalGuildedMessage.reply(message).catch((err) => {
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
