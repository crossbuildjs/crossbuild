import { Channel, ComponentType, CrossBuild, InteractionRawOptions, LogLevel, Server, User } from ".."
import { GeneratedMessage } from "@crossbuild/types"

export interface ReceivedInteractionData {
	id: string
	key: string
	type: ComponentType
	original: unknown
	server: Server | null
	channel: Channel | null
	user: User
	rawOptions?: InteractionRawOptions
	selectMenuValues?: Array<string>
}

export abstract class ReceivedInteraction {
    private readonly crossbuild: CrossBuild
    /** The ID of this interaction */
    public readonly id: string
    /** The key of this interaction */
    public readonly key: string
	/** The source of this interaction */
	abstract source: string
	/** The type of this interaction */
	public readonly type: ReceivedInteractionData["type"]
	/** The original message/interaction that this was created fom */
	public readonly original: unknown
	/** The raw unprocessed options of this interaction */
	public readonly rawOptions: ReceivedInteractionData["rawOptions"]
	/** The server this interaction was triggered in */
	public readonly server: ReceivedInteractionData["server"]
	/** The channel this interaction was triggered in */
	public readonly channel: ReceivedInteractionData["channel"]
	/** The user that triggered this interaction */
	public readonly user: ReceivedInteractionData["user"]
	/** The values of the select menu that triggered this interaction */
	public readonly selectMenuValues: ReceivedInteractionData["selectMenuValues"]

	constructor(crossbuild: CrossBuild, data: ReceivedInteractionData) {
	    this.crossbuild = crossbuild

	    this.crossbuild.log(`${this.crossbuild}`, LogLevel.NULL)
	    this.id = data.id
	    this.key = data.key
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
