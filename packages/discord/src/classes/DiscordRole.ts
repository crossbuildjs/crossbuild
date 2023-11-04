import { Role } from "@crossbuild/core"
import { APIRole as DJSAPIRole, Role as DJSRole } from "discord.js"

export class DiscordRole extends Role {
    constructor(role: DJSRole | DJSAPIRole) {
        super({
            id: `${role.id}`,
            name: role.name
        })
    }

    toString(): string {
        return JSON.parse(
            JSON.stringify(this, (_, value) => {
                return value
            })
        )
    }
}
