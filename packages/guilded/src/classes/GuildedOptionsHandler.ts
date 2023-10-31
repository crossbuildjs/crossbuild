import { ComponentOption, OptionsHandler } from "@crossbuild/core"
import {
	GuildedChannel,
	GuildedReceivedMessage,
	GuildedRole,
	GuildedUser
} from ".."

export class GuildedOptionsHandler extends OptionsHandler {
	private interaction: GuildedReceivedMessage

	constructor(
		interaction: GuildedReceivedMessage,
		componentOptions: Array<ComponentOption>
	) {
		super(interaction, componentOptions)
		this.interaction = interaction

		// No unused variable errors
		this.getUser
		this.getChannel
		this.getRole
	}

	public async getUser(key: string): Promise<GuildedUser | undefined> {
		const value = this.getString(key)
		if (!value) return undefined
		const name = value.replace("@", "").trim()
		const mentionedUserIds = this.interaction.original.mentions?.users
		if (!mentionedUserIds) return undefined
		if (!this.interaction.server) return undefined
		for await (const userId of mentionedUserIds) {
			const member = await this.interaction.original.client.members.fetch(
				this.interaction.server.id,
				userId.id
			)
			if (member?.user?.name.toLowerCase() === name.toLowerCase())
				return new GuildedUser(member.user)
		}
		return undefined
	}

	public async getChannel(key: string): Promise<GuildedChannel | undefined> {
		const value = this.getString(key)
		if (!value) return undefined
		const name = value.replace("#", "").trim()
		const mentionedChannelIds = this.interaction.original.mentions?.channels
		if (!mentionedChannelIds) return undefined
		if (!this.interaction.server) return undefined
		for await (const channelId of mentionedChannelIds) {
			const channel = await this.interaction.original.client.channels.fetch(
				channelId.id
			)
			if (channel?.name.toLowerCase() === name.toLowerCase())
				return new GuildedChannel(channel)
		}
		return undefined
	}

	public async getRole(key: string): Promise<GuildedRole | undefined> {
		const value = this.getString(key)
		if (!value) return undefined
		const name = value.replace("@", "").trim()
		const mentionedRoleIds = this.interaction.original.mentions?.roles
		if (!mentionedRoleIds) return undefined
		if (!this.interaction.server) return undefined
		for await (const roleId of mentionedRoleIds) {
			const role = await this.interaction.original.client.roles.fetch(
				this.interaction.server.id,
				roleId.id
			)
			if (role?.name.toLowerCase() === name.toLowerCase())
				return new GuildedRole(role)
		}
		return undefined
	}
}
