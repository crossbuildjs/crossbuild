import {
    GeneratedMessageObject,
    ModulePaginator,
    Paginator,
    PaginatorMessage,
    ReceivedInteraction
} from "@crossbuild/core"

export class HttpModulePaginator extends ModulePaginator {
    createPaginatorMessage(_message: PaginatorMessage): GeneratedMessageObject {
        throw new Error("Method not implemented.")
    }

    getMessagesPaginator(_messageId: string): Paginator | undefined {
        throw new Error("Method not implemented.")
    }

    sendPaginatorMessage(
        _message: GeneratedMessageObject,
        _interaction: ReceivedInteraction,
        _paginator: Paginator
    ): Promise<void> {
        throw new Error("Method not implemented.")
    }

    handlePage(): never {
        throw new Error("Method not implemented.")
    }
}
