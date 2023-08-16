import { Channel, OptionsHandler, Role, User } from "@crossbuild/core"

export class GuildedOptionsHandler extends OptionsHandler {
    getUserData(value: string): User {
        throw new Error("Method not implemented.")
    }

    getChannelData(value: string): Channel {
        throw new Error("Method not implemented.")
    }

    getRoleData(value: string): Role {
        throw new Error("Method not implemented.")
    }
}
