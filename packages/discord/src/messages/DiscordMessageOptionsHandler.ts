import {
	Channel,
	ComponentOption,
	OptionsHandler,
	Role,
	User
} from "@crossbuild/core"
import {
	DiscordChannel,
	DiscordReceivedMessage,
	DiscordRole,
	DiscordUser
} from ".."

export class DiscordMessageOptionsHandler extends OptionsHandler {
	private interaction: DiscordReceivedMessage

	constructor(
		interaction: DiscordReceivedMessage,
		componentOptions: Array<ComponentOption>
	) {
		super(interaction, componentOptions)
		this.interaction = interaction

		// No unused variable errors
		this.getUser
		this.getChannel
		this.getRole
	}

	public async getUser(key: string): Promise<User | undefined> {
		const value = this.getString(key)
		if (!value) return undefined
		const id = value.replace(/<@>/g, "").trim()
		const mentionedUsers = this.interaction.original.mentions?.users
		if (!mentionedUsers) return undefined
		const user = mentionedUsers.get(id)
		if (!user) return undefined
		return new DiscordUser(user)
	}

	public async getChannel(key: string): Promise<Channel | undefined> {
		const value = this.getString(key)
		if (!value) return undefined
		const id = value.replace(/<#>/g, "").trim()
		const mentionedChannels = this.interaction.original.mentions?.channels
		if (!mentionedChannels) return undefined
		const channel = mentionedChannels.get(id)
		if (!channel) return undefined
		return new DiscordChannel(channel)
	}

	public async getRole(key: string): Promise<Role | undefined> {
		const value = this.getString(key)
		if (!value) return undefined
		const id = value.replace("<@&>", "").trim()
		const mentionedRoles = this.interaction.original.mentions?.roles
		if (!mentionedRoles) return undefined
		const role = mentionedRoles.get(id)
		if (!role) return undefined
		return new DiscordRole(role)
	}
}
