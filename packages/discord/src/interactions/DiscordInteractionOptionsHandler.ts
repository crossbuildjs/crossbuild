import { ComponentOption, OptionsHandler } from "@crossbuild/core"
import { DiscordChannel, DiscordReceivedInteraction, DiscordUser, DiscordRole } from ".."

export class DiscordInteractionOptionsHandler extends OptionsHandler {
    private interaction: DiscordReceivedInteraction

    constructor(interaction: DiscordReceivedInteraction, componentOptions: Array<ComponentOption>) {
        super(interaction, componentOptions)
        this.interaction = interaction
    }

    async getUser(key: string): Promise<DiscordUser | undefined> {
        if (!this.interaction.original.isChatInputCommand()) return undefined
        const userData = this.interaction.original.options.getUser(key)
        if (!userData) return undefined
        return new DiscordUser(userData)
    }

    async getChannel(key: string): Promise<DiscordChannel | undefined> {
        if (!this.interaction.original.isChatInputCommand()) return undefined
        const channelData = this.interaction.original.options.getChannel(key)
        if (!channelData) return undefined
        const channel = await this.interaction.original.client.channels.fetch(channelData.id)
        if (!channel) return undefined
        return new DiscordChannel(channel)
    }

    async getRole(key: string): Promise<DiscordRole | undefined> {
        if (!this.interaction.original.isChatInputCommand()) return undefined
        const roleData = this.interaction.original.options.getRole(key)
        if (!roleData) return undefined

        return new DiscordRole(roleData)
    }
}
