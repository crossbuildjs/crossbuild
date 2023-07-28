import { GuildedPermissionString } from "@crossbuild/types"
import { Message, Client } from "guilded.js"

export const getGuildedPermissions = async (message: Message, client: Client): Promise<GuildedPermissionString[]> => {
    if (!message.member || !message.serverId) return []

    const roles = await message.member.getRoles()
    const permissions: GuildedPermissionString[] = []
    for (const role of roles) {
        const guildedRole = await client.roles.fetch(message.serverId, role)
        if (guildedRole) {
            permissions.push(...(guildedRole.permissions as GuildedPermissionString[]))
        }
    }
    return permissions
}
