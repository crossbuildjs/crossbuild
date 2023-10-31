import { Server } from "@crossbuild/core"
import {
	Guild as DJSGuild,
	GuildFeature,
	GuildNSFWLevel,
	Locale
} from "discord.js"

export class DiscordServer extends Server {
	readonly available: boolean
	readonly createdAt: Date
	readonly features: Array<`${GuildFeature}`>
	readonly joinedAt: Date
	readonly memberCount: number
	readonly nsfwLevel: GuildNSFWLevel
	readonly preferredLocale: Locale

	constructor(guild: DJSGuild) {
		super({
			id: guild.id,
			name: guild.name,
			description: guild.description || undefined,
			ownerId: guild.ownerId,
			iconURL: guild.iconURL() || undefined
		})
		this.available = guild.available
		this.createdAt = guild.createdAt
		this.features = guild.features
		this.joinedAt = guild.joinedAt
		this.memberCount = guild.memberCount
		this.nsfwLevel = guild.nsfwLevel
		this.preferredLocale = guild.preferredLocale
	}

	toString(): string {
		return JSON.parse(
			JSON.stringify(this, (_, value) => {
				return value
			})
		)
	}
}
