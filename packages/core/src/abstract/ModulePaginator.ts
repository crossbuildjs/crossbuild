import { Collection } from "@discordjs/collection"
import { GeneratedMessageObject, Paginator, PaginatorMessage, PrevNext, ReceivedInteraction } from ".."

export abstract class ModulePaginator {
    paginators: Collection<string, Paginator> = new Collection()

    public get paginatorCount(): number {
        return this.paginators.size
    }

	public abstract watchPaginator(paginator: Paginator): void
	public abstract unwatchPaginator(paginator: Paginator): void
	public abstract createPaginatorMessage(message: PaginatorMessage, prevNext: PrevNext, id: string): GeneratedMessageObject
	public abstract sendPaginatorMessage(message: GeneratedMessageObject, interaction: ReceivedInteraction): Promise<void>
	public abstract handlePage(paginator: Paginator, interaction: ReceivedInteraction): Promise<void>
}
