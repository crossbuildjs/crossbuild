import { Collection } from "@discordjs/collection"
import {
	GeneratedMessageObject,
	Paginator,
	PaginatorMessage,
	PrevNext,
	ReceivedInteraction
} from ".."

export abstract class ModulePaginator {
	paginators: Collection<string, Paginator> = new Collection()

	public get paginatorCount(): number {
		return this.paginators.size
	}

	public watchPaginator(paginator: Paginator) {
		this.paginators.set(paginator.id, paginator)
	}

	public unwatchPaginator(paginator: Paginator) {
		this.paginators.delete(paginator.id)
	}

	public abstract createPaginatorMessage(
		message: PaginatorMessage,
		prevNext: PrevNext,
		id: string
	): GeneratedMessageObject
	public abstract sendPaginatorMessage(
		message: GeneratedMessageObject,
		interaction: ReceivedInteraction,
		paginator?: Paginator
	): Promise<void>
	public abstract handlePage(
		paginator: Paginator,
		interaction: ReceivedInteraction
	): Promise<void>
}
