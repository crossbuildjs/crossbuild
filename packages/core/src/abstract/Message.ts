import { GeneratedMessage } from ".."

export type MessageData = {
	id: string
	content: string
	authorId: string
	channelId?: string | null
	serverId?: string | null
	createdAt: Date
	updatedAt?: Date | null
	deletedAt?: Date | null
}

export abstract class Message {
	readonly id: string
	readonly content: string
	readonly authorId: string
	readonly channelId: string | null
	readonly serverId: string | null
	readonly createdAt: Date
	readonly updatedAt: Date | null
	readonly deletedAt: Date | null

	constructor(data: MessageData) {
		this.id = data.id
		this.content = data.content
		this.authorId = data.authorId
		this.channelId = data.channelId || null
		this.serverId = data.serverId || null
		this.createdAt = data.createdAt
		this.updatedAt = data.updatedAt || null
		this.deletedAt = data.deletedAt || null
	}

	abstract toString(): string

	abstract get url(): string

	abstract reply(message: GeneratedMessage): Promise<string>
	abstract edit(message: GeneratedMessage): Promise<void>
	abstract delete(): Promise<void>
}
