import { GeneratedMessage } from ".."

export type UserData = {
	id: string
	displayName?: string | null
	username?: string | null
	avatarURL?: string | null
}

export abstract class User {
	readonly id: string
	readonly displayName: string | null
	readonly username: string | null
	readonly avatarURL: string | null

	constructor(data: UserData) {
		this.id = data.id
		this.displayName = data.displayName || null
		this.username = data.username || null
		this.avatarURL = data.avatarURL || null
	}

	abstract toString(): string
	abstract get isBot(): boolean

	/**
	 * Send a DM to this user
	 * @param message The message to send
	 * @returns The ID of the message that was sent
	 */
	abstract send(message: GeneratedMessage): Promise<string>
}
