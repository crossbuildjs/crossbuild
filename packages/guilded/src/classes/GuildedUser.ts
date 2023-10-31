import { GeneratedMessage, User } from "@crossbuild/core"
import { User as GJSUser, UserType } from "guilded.js"

export class GuildedUser extends User {
    private readonly gjsUser: GJSUser
    constructor(user: GJSUser) {
        super({
            id: user.id,
            username: user.name,
            avatarURL: user.avatar || null
        })
        this.gjsUser = user
    }

    toString(): string {
        return JSON.parse(
            JSON.stringify(this, (key, value) => {
                if (key === "gjsUser") return undefined
                return value
            })
        )
    }

    get isBot(): boolean {
        return this.gjsUser.type === UserType.Bot
    }

    async send(_message: GeneratedMessage): Promise<string> {
        throw new Error("The Guilded API does not support DMs.") // stupid fucking api
    }
}
