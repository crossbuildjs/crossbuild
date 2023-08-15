import { GeneratedMessageObject } from "@crossbuild/types"
import { CrossBuild, ReceivedInteraction } from ".."

export type PaginatorSettings = {
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

export type PrevNext = {
	previous: number
	current: number
	total: number
	next: number
}

export type PaginatorMessage = Pick<GeneratedMessageObject, "embeds" | "content" | "components">

export type PageTrigger = {
	/** The ID of the paginator that this trigger is for. */
	id: string
}

export class Paginator {
    public id: string
    public settings: PaginatorSettings
    public pages: PaginatorMessage[]
    /** The ID of the message that was sent from this paginator */
    public messageId?: string
    /** The page that was last sent */
    public activePage: number = 1

    constructor(settings: PaginatorSettings, pages?: PaginatorMessage[]) {
        this.settings = {
            id: settings.id,
            userId: settings.userId,
            crossbuild: settings.crossbuild,
            timeout: settings.timeout ?? 30000,
            discordJumpToPage: settings.discordJumpToPage ?? true
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

        const msgData = this.createMessage(page, interaction.source)
        await this.moduleSend(msgData, interaction)
    }

    private getModule(source: string) {
        const module = this.settings.crossbuild.modules.get(source)
        if (!module) throw new Error(`Module ${source} does not exist.`)
        return module
    }

    private async moduleSend(data: GeneratedMessageObject, interaction: ReceivedInteraction) {
        const module = this.getModule(interaction.source)
        await module.modulePaginator.sendPaginatorMessage(data, interaction, this)
        module.modulePaginator.watchPaginator(this)
    }

    private createMessage(page: number, source: string): GeneratedMessageObject {
        const data = this.pages[page - 1]
        if (!data) throw new Error("Page does not exist.")
        const module = this.getModule(source)
        const message = module.modulePaginator.createPaginatorMessage(data, this.getPrevNext(page), this.id)
        return message
    }

    public getPrevNext(page: number): PrevNext {
        const previous = page - 1 < 1 ? 1 : page - 1
        const next = page + 1 > this.pages.length ? this.pages.length : page + 1
        return { previous, current: page, total: this.pages.length, next }
    }
}
