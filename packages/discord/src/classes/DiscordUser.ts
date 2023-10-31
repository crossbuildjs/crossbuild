import { GeneratedMessage, User } from "@crossbuild/core"
import { User as DJSUser } from "discord.js"

export class DiscordUser extends User {
	private readonly djsUser: DJSUser
	constructor(user: DJSUser) {
		super({
			id: user.id,
			displayName: user.displayName,
			username: user.username,
			avatarURL: user.avatarURL() || undefined
		})
		this.djsUser = user
	}

	toString(): string {
		return JSON.parse(
			JSON.stringify(this, (key, value) => {
				if (key === "djsUser") return undefined
				return value
			})
		)
	}

	get isBot(): boolean {
		return this.djsUser.bot
	}

	async send(message: GeneratedMessage): Promise<string> {
		return (await this.djsUser.createDM())
			.send(message)
			.then((m) => m.id)
			.catch((e) => {
				throw e
			})
	}
}
