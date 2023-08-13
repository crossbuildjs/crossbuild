import { GeneratedMessage } from ".."

export type UserData = {
	id: string
	displayName?: string
	username?: string
	avatarURL?: string
}

export abstract class User {
    readonly id: string
    readonly displayName?: string
    readonly username?: string
    readonly avatarURL?: string

    constructor(data: UserData) {
        this.id = data.id
        this.displayName = data.displayName
        this.username = data.username
        this.avatarURL = data.avatarURL
    }

	/**
	 * Send a DM to this user
	 * @param message The message to send
	 * @returns The ID of the message that was sent
	 */
	abstract send(message: GeneratedMessage): Promise<string>
}
