import { GuildedPermissionString, SimpleEmbed } from "@crossbuild/types"
import { CrossBuild, ComponentData, LogLevel, ReceivedInteraction, ComponentType, OptionsHandler } from "../index.js"
import { PermissionsString as DiscordPermissionString } from "discord.js"
import { getGuildedPermissions } from "@crossbuild/functions"

/**
 * The base component class that other components extend from.
 */
export default abstract class Component {
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
     * The permissions required to run this component.
     * This is an object with two keys: `guilded` and `discord`.
     * `guilded` is an array of Guilded permissions, and `discord` is an array of Discord permissions.
     */
    public readonly permissions?: ComponentData["permissions"]

    constructor(key: string, type: ComponentType, client: CrossBuild, options: ComponentData) {
        this.key = key
        this.type = type
        this.client = client
        this.serverOnly = options.serverOnly || false
        this.ownerOnly = options.ownerOnly || false
        this.description = options.description
        this.permissions = options.permissions
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
                    description: `This ${this.type} can only be ran by the owner of this server!`
                }
            }

            if (this.permissions) {
                if (this.permissions.discord && interaction.source.startsWith("discord")) {
                    const userPermissions = interaction.user?.permissions as DiscordPermissionString[]
                    const missingPermissions = this.permissions.discord.filter(
                        (permission: DiscordPermissionString) => !userPermissions.includes(permission)
                    )

                    if (missingPermissions.length > 0) {
                        return {
                            title: "Missing Permissions",
                            description: `This ${this.type} requires the following permissions: ${missingPermissions
                                .map((permission) => {
                                    return permission.replace(/([A-Z])/g, " $1")
                                })
                                .join(", ")}`
                        }
                    }
                } else if (this.permissions.guilded && interaction.source === "guilded") {
                    interaction.user.permissions = await getGuildedPermissions(interaction.originalGuildedMessage!, this.client.guildedClient!)
                    const userPermissions = interaction.user?.permissions as GuildedPermissionString[]
                    const missingPermissions = this.permissions.guilded.filter(
                        (permission: GuildedPermissionString) => !userPermissions.includes(permission)
                    )

                    if (missingPermissions.length > 0) {
                        return {
                            title: "Missing Permissions",
                            description: `This ${this.type} requires the following permissions: ${missingPermissions
                                .map((permission) => {
                                    return permission.replace(/([A-Z])/g, " $1")
                                })
                                .join(", ")}`
                        }
                    }
                }
            }
        }

        const specifics = await this.specificValidate(interaction)
        return specifics ?? null
    }

    public async specificValidate(_interaction: ReceivedInteraction): Promise<SimpleEmbed | null> {
        return null
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async run(interaction: ReceivedInteraction, _options: OptionsHandler): Promise<any> {
        this.client.log(`${interaction}`, LogLevel.NULL) // This line is here to prevent unused variable errors.
        throw new Error("Not implemented")
    }
}
