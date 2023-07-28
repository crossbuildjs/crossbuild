import { Client, Snowflake, User } from "discord.js"

import { APIGuildMember } from "discord.js"

/**
 * The settings to use for access checking.
 * @example {"roles": {"staff": "393814075013750315", "admin": "135013865018708735"}, "server": "135013865018708735"}
 */
export interface AccessSettings {
	roles: AccessRoles
	server: Snowflake
}

/**
 * An object containing the roles for each restriction type
 * @example {"staff": "393814075013750315", "admin": "135013865018708735"}
 */
export interface AccessRoles {
	[key: string]: Snowflake[]
}

/**
 * Check if a user has access via Discord roles in a specific server.
 * The function will check if the user has any of the roles in the roles object in the server specified in the server property.
 * If process.env.NODE_ENV is set to "development", the function will return true if the user is the owner of the bot application.
 * @param user - The user to check access for.
 * @param restriction - The restriction type to check access for.
 * @param settings - The settings to use for access checking.
 * @param client - The discord.js Client.
 */
export const checkAccess = async (user: Snowflake, restriction: string, settings: AccessSettings, client: Client): Promise<boolean> => {
    if (process.env.NODE_ENV === "development")
        return client.application?.owner instanceof User
            ? client.application?.owner?.id === user
            : client.application?.owner?.members?.has(user) ?? false

    if (!settings.roles[restriction]) throw new Error(`No role was specified for the restriction type ${restriction}.`)

    const data = await client.shard?.broadcastEval(
        async (client, { settings, user }) => {
            const staffGuild = await client.guilds.fetch(settings.server).catch(() => {})
            if (!staffGuild) return null
            return await staffGuild.members.fetch(user)
        },
        { context: { settings, user } }
    )

    const member = data?.find((d) => d !== null) as APIGuildMember | undefined

    if (!member) return false

    return member.roles.some((role) => settings.roles[restriction].includes(role))
}
