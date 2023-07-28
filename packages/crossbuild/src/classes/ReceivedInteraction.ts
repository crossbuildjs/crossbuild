import { ChatInputCommandInteraction, PermissionsString } from "discord.js"
import { Crossbuild, LogLevel } from "../index.js"
import { GeneratedMessage } from "@crossbuild/types"

interface ReceivedInteractionData {
	key: string
	source: "discord" | "guilded" | "http"
	type: "command"
	originalDiscord?: ChatInputCommandInteraction
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	options?: { [key: string]: any }
}

export default class ReceivedInteraction {
    private readonly client: Crossbuild
    public readonly key: string
    public readonly source: ReceivedInteractionData["source"]
    public readonly type: ReceivedInteractionData["type"]
    public readonly originalDiscord?: ReceivedInteractionData["originalDiscord"]
    public readonly options?: ReceivedInteractionData["options"]
    public readonly server?: { id: string; ownerId: string }
    public readonly user?: {
		id: string
		displayName: string
		username: string
		avatarURL?: string | null
		permissions: PermissionsString[] | string[]
	}

    constructor(client: Crossbuild, data: ReceivedInteractionData) {
        this.client = client

        this.client.log(`${client}`, LogLevel.NULL)
        this.key = data.key
        this.source = data.source
        this.type = data.type

        if (data.originalDiscord) {
            this.originalDiscord = data.originalDiscord
            if (data.originalDiscord.guild) this.server = { id: data.originalDiscord.guild.id, ownerId: data.originalDiscord.guild.ownerId }
            this.user = {
                id: data.originalDiscord.user.id,
                displayName: data.originalDiscord.user.username,
                username: data.originalDiscord.user.username,
                avatarURL: data.originalDiscord.user.avatarURL(),
                permissions: data.originalDiscord.memberPermissions?.toArray() || []
            }
            const interactionOptions = data.originalDiscord.options.data
            if (interactionOptions) {
                this.options = {}
                for (const option of interactionOptions) {
                    this.options[option.name] = option.value
                }
            }
        }

        console.log(this)
    }

    public isDiscordComponent() {
        return this.source === "discord" && this.type !== "command"
    }

    public async reply(message: GeneratedMessage) {
        switch (this.source) {
            case "discord":
                if (!this.originalDiscord) throw new Error("Cannot reply to a Discord interaction without the original interaction.")
                await this.originalDiscord.reply(message)
                break
            case "guilded":
            case "http":
            default:
                throw new Error("Cannot reply to a non-Discord interaction.")
        }
        return
    }
}
