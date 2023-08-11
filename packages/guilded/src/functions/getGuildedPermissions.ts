import { GuildedPermissionString } from "@crossbuild/types"
import { Client, Member, Server } from "guilded.js"

export const getGuildedPermissions = async (member: Member, serverId: Server["id"], client: Client): Promise<GuildedPermissionString[]> => {
    const roles = await member.getRoles()
    const permissions: GuildedPermissionString[] = []
    for (const role of roles) {
        const guildedRole = await client.roles.fetch(serverId, role)
        if (guildedRole) {
            permissions.push(...(guildedRole.permissions as GuildedPermissionString[]))
        }
    }
    return permissions
}
