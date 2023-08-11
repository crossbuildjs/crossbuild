import { SimpleEmbed } from "@crossbuild/types"
import { CrossBuild, ComponentData, LogLevel, ReceivedInteraction, ComponentType, OptionsHandler, CustomCheckFunction } from "../index.js"

/**
 * The base component class that other components extend from.
 */
export class Component {
    /**
	 * The client that instantiated this component.
	 */
    public readonly client: CrossBuild
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
	 * The cooldown for this component, given in milliseconds.
	 */
    public readonly cooldown?: number
    /**
	 * Whether this component can only be used in servers.
	 */
    private readonly serverOnly: boolean
    /**
	 * Whether this component can only be used by the owner of the server.
	 */
    private readonly ownerOnly: boolean
    /**
	 * The description of this component.
	 * This is used in Discord for the command description.
	 */
    public readonly description?: string
    /**
	 * The options of this component.
	 * This is used in Discord for the command options within the slash commands, as well as what is parsed from the message in text commands.
	 */
    public readonly options?: ComponentData["options"]
    /**
	 * Any custom checks that should be run before the component is executed.
	 */
    public readonly customChecks?: Array<CustomCheckFunction>

    constructor(key: string, type: ComponentType, client: CrossBuild, options: ComponentData) {
        this.key = key
        this.type = type
        this.client = client
        this.cooldown = options.cooldown || 0
        this.serverOnly = options.serverOnly || false
        this.ownerOnly = options.ownerOnly || false
        this.description = options.description
        this.customChecks = options.customChecks || []
        this.options = options.options
    }

    public async validate(interaction: ReceivedInteraction, options: OptionsHandler): Promise<SimpleEmbed | null> {
        if (options.errors.length > 0) {
            return {
                title: "Invalid Options",
                description: `The following options are invalid:\n${options.errors.join("\n")}`
            }
        }
        if (this.serverOnly && !interaction.server) {
            return {
                title: "Missing Permissions",
                description: `This ${this.type} can only be used in servers!`
            }
        }

        if (interaction.server && interaction.user) {
            if (this.ownerOnly && interaction.server?.ownerId !== interaction.user?.id) {
                return {
                    title: "Missing Permissions",
                    description: `This ${this.type} can only be run by the owner of this server!`
                }
            }

            // if (this.permissions) {
            //     if (this.permissions.discord && interaction.source.startsWith("discord")) {
            //         const userPermissions = interaction.user?.permissions as DiscordPermissionString[]
            //         const missingPermissions = this.permissions.discord.filter(
            //             (permission: DiscordPermissionString) => !userPermissions.includes(permission)
            //         )

            //         if (missingPermissions.length > 0) {
            //             return {
            //                 title: "Missing Permissions",
            //                 description: `This ${this.type} requires the following permissions: ${missingPermissions
            //                     .map((permission) => {
            //                         return permission.replace(/([A-Z])/g, " $1")
            //                     })
            //                     .join(", ")}`
            //             }
            //         }
            //     } else if (this.permissions.guilded && interaction.source === "guilded") {
            //         const member = await this.client.guildedClient!.members.fetch(interaction.server.id, interaction.user.id)
            //         interaction.user.permissions = await getGuildedPermissions(member, interaction.server.id, this.client.guildedClient!)
            //         const userPermissions = interaction.user?.permissions as GuildedPermissionString[]
            //         const missingPermissions = this.permissions.guilded.filter(
            //             (permission: GuildedPermissionString) => !userPermissions.includes(permission)
            //         )

            //         if (missingPermissions.length > 0) {
            //             return {
            //                 title: "Missing Permissions",
            //                 description: `This ${this.type} requires the following permissions: ${missingPermissions
            //                     .map((permission) => {
            //                         return permission.replace(/([A-Z])/g, " $1")
            //                     })
            //                     .join(", ")}`
            //             }
            //         }
            //     }
            // }
            // if (this.clientPermissions) {
            //     if (this.clientPermissions.discord && interaction.source.startsWith("discord")) {
            //         const me = await (await this.client.discordClient?.guilds.fetch(interaction.server.id))?.members.fetchMe()
            //         if (!me) throw new Error("Unable to find fetchMe() in guild")
            //         const permissions = me.permissions.toArray()
            //         const missingPermissions = this.clientPermissions.discord.filter(
            //             (permission: DiscordPermissionString) => !permissions.includes(permission)
            //         )

            //         if (missingPermissions.length > 0) {
            //             return {
            //                 title: "Missing Permissions",
            //                 description: `This action requires me to have the following permissions: ${missingPermissions
            //                     .map((permission) => {
            //                         return permission.replace(/([A-Z])/g, " $1")
            //                     })
            //                     .join(", ")}`
            //             }
            //         }
            //     } else if (this.clientPermissions.guilded && interaction.source === "guilded") {
            //         const member = await this.client.guildedClient!.members.fetch(interaction.server.id, this.client.guildedClient!.user!.id!)
            //         interaction.user.permissions = await getGuildedPermissions(member, interaction.server.id, this.client.guildedClient!)
            //         const userPermissions = interaction.user?.permissions as GuildedPermissionString[]
            //         const missingPermissions = this.clientPermissions.guilded.filter(
            //             (permission: GuildedPermissionString) => !userPermissions.includes(permission)
            //         )

            //         if (missingPermissions.length > 0) {
            //             return {
            //                 title: "Missing Permissions",
            //                 description: `This action requires me to have the following permissions: ${missingPermissions
            //                     .map((permission) => {
            //                         return permission.replace(/([A-Z])/g, " $1")
            //                     })
            //                     .join(", ")}`
            //             }
            //         }
            //     }
            // }
        }

        return null
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async run(interaction: ReceivedInteraction, _options: OptionsHandler): Promise<any> {
        this.client.log(`${interaction}`, LogLevel.NULL) // This line is here to prevent unused variable errors.
        throw new Error("Not implemented")
    }
}