import {
	GeneratedMessageObject,
	ModulePaginator,
	Paginator,
	PaginatorMessage
} from "@crossbuild/core"
import { GuildedEmojiID, GuildedReceivedMessage } from ".."

export class GuildedModulePaginator extends ModulePaginator {
	public createPaginatorMessage(
		message: PaginatorMessage
	): GeneratedMessageObject {
		return message
	}

	public getMessagesPaginator(messageId: string): Paginator | undefined {
		return this.paginators.find((x) => x.messageId === messageId)
	}

	public async sendPaginatorMessage(
		message: GeneratedMessageObject,
		interaction: GuildedReceivedMessage,
		paginator: Paginator
	): Promise<void> {
		const msg = await interaction.reply(message)
		paginator.messageId = msg.id
		await msg.react(GuildedEmojiID.ARROW_LEFT)
		await msg.react(GuildedEmojiID.ARROW_RIGHT)
		return
	}

	public handlePage(): never {
		throw new Error("Method not used.")
	}
}
