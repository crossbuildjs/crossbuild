import { ComponentType, CrossBuild, InteractionRawOptions, LogLevel } from "../index.js"
import { GeneratedMessage } from "@crossbuild/types"

export interface ReceivedInteractionData {
	id: string
	key: string
	source: "discordInteraction" | "discordMessage" | "guilded" | "http"
	type: ComponentType
	original: unknown
	server: {
		id: string
		ownerId?: string
		name?: string
		iconURL?: string
		description?: string
	} | null
	channel:
		| ({
				id: string
				name?: string
				parentId?: string
		  } & { send: (message: GeneratedMessage) => Promise<void> })
		| null
	user: {
		id: string
		displayName?: string
		username?: string
		avatarURL?: string
		// permissions?: PermissionsString[] | GuildedPermissionString[]
	}
	rawOptions?: InteractionRawOptions
	selectMenuValues?: Array<string>
}

export abstract class ReceivedInteraction {
    private readonly crossbuild: CrossBuild
    /** The ID of this interaction */
    readonly id: string
    /** The key of this interaction */
    public readonly key: string
    /** The source of this interaction */
    public readonly source: ReceivedInteractionData["source"]
    /** The type of this interaction */
    public readonly type: ReceivedInteractionData["type"]
    /** The original message/interaction that this was created fom */
    public readonly original: unknown
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

        this.original = data.original
    }

    public isDiscordComponent() {
        return this.source === "discordInteraction" && this.type !== "command"
    }

	/**
	 * Reply to an interaction with a message
	 * @param message The message you want to send
	 * @returns The ID of the resulting message
	 */
	abstract reply(message: GeneratedMessage): Promise<string>
}
