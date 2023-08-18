import { Role } from "@crossbuild/core"
import { Role as GJSRole } from "guilded.js"

export class GuildedRole extends Role {
    constructor(role: GJSRole) {
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
