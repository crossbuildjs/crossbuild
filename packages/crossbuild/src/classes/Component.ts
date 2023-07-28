import { SimpleEmbed } from "@crossbuild/types"
import { Crossbuild, ComponentOptions, LogLevel, ReceivedInteraction, ComponentType } from "../index.js"

/**
 * The base component class that other components extend from.
 */
export default class Component {
    /**
	 * The client that instantiated this component.
	 */
    public readonly client: Crossbuild
    /**
	 * The key of this component.
	 * This is used to identify the component, and is usually used as the custom ID or the command name.
	 */
    public readonly key: string
    /**
	 * The type of the component.
	 */
    public readonly type: ComponentType
    /**
	 * The access role required to run this component.
	 */
    private readonly restriction?: string
    /**
	 * Whether this component can only be used in servers.
	 */
    private readonly serverOnly: boolean
    /**
	 * Whether this component can only be used by the owner of the server.
	 */
    private readonly ownerOnly: boolean
    /**
	 * The cooldown of this component.
	 * This is in milliseconds.
	 */
    public readonly cooldown: number
    /**
	 * Whether this component can only be used by the author of the interaction.
	 */
    public readonly authorOnly: boolean
    /**
     * The description of this component.
     * This is used in Discord for the command description.
     */
    public readonly description?: string

    constructor(key: string, type: ComponentType, client: Crossbuild, options: ComponentOptions) {
        this.key = key
        this.type = type
        this.client = client
        if (options.restriction) this.restriction = options.restriction
        this.serverOnly = options.serverOnly || false
        this.ownerOnly = options.ownerOnly || false
        this.cooldown = options.cooldown || 0
        this.authorOnly = options.authorOnly || false
        this.description = options.description
    }

    public async validate(interaction: ReceivedInteraction): Promise<SimpleEmbed | null> {
        if (this.serverOnly && !interaction.server) {
            return {
                title: "Missing Permissions",
                description: "This action can only be used in servers!"
            }
        }

        if (interaction.server) {
            if (this.ownerOnly && interaction.server?.ownerId !== interaction.user?.id) {
                return {
                    title: "Missing Permissions",
                    description: "This action can only be ran by the owner of this server!"
                }
            }
        }

        if (this.client.config.accessSettings && this.restriction) {
            return {
                title: "Missing Permissions",
                description: `This action can only be used by ${this.client.config.name || "the bot"} ${this.restriction}s!`
            }
        }

        const specifics = await this.specificValidate(interaction)
        return specifics ?? null
    }

    public async specificValidate(_interaction: ReceivedInteraction): Promise<SimpleEmbed | null> {
        return null
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async run(interaction: ReceivedInteraction): Promise<any> {
        this.client.log(`${interaction}`, LogLevel.NULL) // This line is here to prevent unused variable errors.
        throw new Error("Not implemented")
    }
}
