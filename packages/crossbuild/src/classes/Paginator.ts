import { GeneratedMessageObject, GuildedEmojiID } from "@crossbuild/types"
import { CrossBuild, ReceivedInteraction } from ".."
import { ButtonInteraction } from "discord.js"
import { MessageReaction as GuildedMessageReaction } from "guilded.js"

type PaginatorSettings = {
	/** A unique ID for this paginator, typically the ID of the interaction. Max 75 characters */
	id: string
	/** The user ID of the user who triggered this paginator */
	userId: string
	/** The CrossBuild client */
	crossbuild: CrossBuild
	/** The amount of time in milliseconds to wait before the paginator times out. */
	timeout?: number
	/** Whether a dropdown should be shown to jump to the next page on Discord */
	discordJumpToPage?: boolean
}

type PaginatorMessage = Pick<GeneratedMessageObject, "embeds" | "content">

export default class Paginator {
    public id: string
    public settings: PaginatorSettings
    public pages: PaginatorMessage[]
    private activePage: number = 1

    constructor(settings: PaginatorSettings, pages?: PaginatorMessage[]) {
        this.settings = {
            id: settings.id,
            userId: settings.userId,
            crossbuild: settings.crossbuild,
            timeout: settings.timeout ?? 30000,
            discordJumpToPage: settings.discordJumpToPage ?? true,
        }
        if (this.settings.id.length > 75) throw new Error("Paginator ID must be less than 75 characters.")
        this.id = this.settings.id
        this.pages = pages || []
    }

    public addPages(page: PaginatorMessage[]) {
        this.pages.push(...page)
    }

    public async send(interaction: ReceivedInteraction, page: number = 1) {
        const channel = interaction.channel
        if (!channel) return console.error("No channel provided to send paginator to.")


        switch (interaction.source) {
            case "guilded":
                const guildedMsg = this.getGuildedMessage(page)
                const messageId = await interaction.reply(guildedMsg)
                const message = await this.settings.crossbuild.guildedClient?.messages.fetch(channel.id, messageId)
                await message?.addReaction(GuildedEmojiID.ARROW_LEFT)
                await message?.addReaction(GuildedEmojiID.ARROW_RIGHT)
                this.settings.crossbuild.guildedListener.watchPaginator(this, messageId)
                this.activePage = page
                break
            default:
                const discordMsg = this.getDiscordMessage(page)
                await interaction.reply(discordMsg)
                this.settings.crossbuild.discordListener.watchPaginator(this)
                this.activePage = page
                break
        }
    }

    public async handleDiscordInteraction(interaction: ButtonInteraction) {
        if (interaction.user.id !== this.settings.userId) {
            interaction.reply({ content: "This button is not for you!", ephemeral: true })
            return
        }
        const page = parseInt(interaction.customId.split(":")[1].split(",")[1])
        const message = this.getDiscordMessage(page)
        await interaction.update(message)
    }

    public async handleGuildedReaction(reaction: GuildedMessageReaction) {
        if (reaction.createdBy === this.settings.crossbuild.guildedClient?.user?.id) return
        const message = await this.settings.crossbuild.guildedClient?.messages.fetch(reaction.channelId, reaction.messageId)
        if (!message) throw new Error("Unable to find Guilded message for paginator.")
        await message.deleteReaction(reaction.emote.id, reaction.createdBy)
        if (reaction.createdBy !== this.settings.userId) return
        const { previous, next } = this.getPrevNext(this.activePage)
        if (reaction.emote.id === GuildedEmojiID.ARROW_LEFT) {
            const toSend = this.getGuildedMessage(previous)
            await message.edit(toSend)
        } else if (reaction.emote.id === GuildedEmojiID.ARROW_RIGHT) {
            const toSend = this.getGuildedMessage(next)
            await message.edit(toSend)
        }
    }

    private getGuildedMessage(page: number = 1): GeneratedMessageObject {
        const data = this.pages[page - 1]
        if (!data) throw new Error("No page data found for paginator.")
        return { ...data }
    }

    private getDiscordMessage(page: number = 1): GeneratedMessageObject {
        const data = this.pages[page - 1]
        if (!data) throw new Error("No page data found for paginator.")
        return { components: this.generateDiscordComponents(page), ...data }
    }

    private generateDiscordComponents(thisPage: number = 1): GeneratedMessageObject["components"] {
        if (this.pages.length === 1) return []
        const { previous, next } = this.getPrevNext(thisPage)
        const row = {
            type: 1,
            components: [
                {
                    type: 2,
                    label: "Previous",
                    style: 2,
                    custom_id: `cb:${this.settings.id},${previous}`,
                    disabled: thisPage === 1
                },
                {
                    type: 2,
                    label: "Next",
                    style: 2,
                    custom_id: `cb:${this.settings.id},${next}`,
                    disabled: thisPage === this.pages.length
                },
            ]
        }
        console.log(row)
        return [row]
    }

    private getPrevNext(page: number): { previous: number, next: number } {
        const previous = page - 1 < 1 ? 1 : page - 1
        const next = page + 1 > this.pages.length ? this.pages.length : page + 1
        return { previous, next }
    }
}