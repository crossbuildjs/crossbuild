import { PermissionsString, Message as DiscordMessage, BaseInteraction } from "discord.js"
import { ComponentType, CrossBuild, InteractionRawOptions, LogLevel } from "../index.js"
import { GeneratedMessage, GuildedPermissionString } from "@crossbuild/types"
import { Message as GuildedMessage } from "guilded.js"

export interface ReceivedInteractionData {
    id: string
    key: string
    source: "discordInteraction" | "discordMessage" | "guilded" | "http"
    type: ComponentType
    originalDiscordInteraction?: BaseInteraction
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
    rawOptions?: InteractionRawOptions,
    selectMenuValues?: Array<string>
}

export default class ReceivedInteraction {
    private readonly crossbuild: CrossBuild
    /** The ID of this interaction */
    readonly id: string
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
    /** The values of the select menu that triggered this interaction */
    public selectMenuValues?: ReceivedInteractionData["selectMenuValues"]


    constructor(crossbuild: CrossBuild, data: ReceivedInteractionData) {
        this.crossbuild = crossbuild

        this.crossbuild.log(`${crossbuild}`, LogLevel.NULL)
        this.id = data.id
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

        this.selectMenuValues = data.selectMenuValues

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

    /**
     * Reply to an interaction with a message
     * @param message The message you want to send
     * @returns The ID of the resulting message
     */
    public async reply(message: GeneratedMessage): Promise<string> {
        switch (this.source) {
            case "discordInteraction":
                if (!this.originalDiscordInteraction) throw new Error("Cannot reply to a Discord interaction without the original interaction.")
                // this line is needed to narrow the type of BaseInteraction to provide the reply() function
                if (this.originalDiscordInteraction.isChatInputCommand() || this.originalDiscordInteraction.isButton() || this.originalDiscordInteraction.isAnySelectMenu()) {
                    return (await this.originalDiscordInteraction.reply(message)).id
                } else {
                    throw new Error("A interaction that could not be replied to was found.")
                }
            case "discordMessage":
                if (!this.originalDiscordMessage) throw new Error("Cannot reply to a Discord message without the original message.")
                return (await this.originalDiscordMessage.reply(message)).id
            case "guilded":
                if (!this.originalGuildedMessage) throw new Error("Cannot reply to a Guilded message without the original message.")
                return (await this.originalGuildedMessage.reply(message)).id
            case "http":
            default:
                throw new Error("Cannot reply to a non-Discord interaction.")
        }
    }
}
