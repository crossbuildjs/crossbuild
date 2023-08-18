import { GeneratedMessage, Message } from ".."

export type ChannelData = {
	id: string
	name: string | null
	parentId: string | null
	topic: string | null
}

export abstract class Channel {
    readonly id: string
    readonly name: string | null
    readonly parentId: string | null
    readonly topic: string | null

    constructor(data: ChannelData) {
        this.id = data.id
        this.name = data.name
        this.parentId = data.parentId
        this.topic = data.topic
    }

	abstract toString(): string

	/**
	 * Whether this channel is a DM
	 */
	abstract get isDm(): boolean

	/**
	 * Send a message to this channel
	 * @param message The message to send
	 * @returns The ID of the message that was sent
	 */
	abstract send(message: GeneratedMessage): Promise<string>

	/**
	 * Fetch a message from this channel
	 * @param id The ID of the message to fetch
	 * @returns The message that was fetched or null if no message could be found.
	 */
	abstract fetchMessage(id: string): Promise<Message | null>
}
