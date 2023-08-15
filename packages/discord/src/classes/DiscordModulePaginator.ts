import { GeneratedMessageObject, ModulePaginator, Paginator, PaginatorMessage, PrevNext } from "@crossbuild/core"
import { DiscordReceivedInteraction } from ".."

export class DiscordInteractionModulePaginator extends ModulePaginator {
    public createPaginatorMessage(message: PaginatorMessage, prevNext: PrevNext, id: string): GeneratedMessageObject {
        const generatedButtons = this.generateDiscordComponents(prevNext, id)
        const done = { ...message }
        done.components ? done.components.push(generatedButtons[0]) : (done.components = generatedButtons)
        return done
    }

    public async handlePage(paginator: Paginator, interaction: DiscordReceivedInteraction) {
        if (interaction.user?.id !== paginator.settings.userId) {
            interaction.reply({ content: "This button is not for you!", ephemeral: true })
            return
        }
        const page = parseInt(interaction.key.split(":")[1].split(",")[1])
        const message = this.createPaginatorMessage(paginator.pages[page - 1], paginator.getPrevNext(page), paginator.id)
        await interaction.update(message)
        return
    }

    public async sendPaginatorMessage(message: GeneratedMessageObject, interaction: DiscordReceivedInteraction) {
        await interaction.reply(message)
    }

    private generateDiscordComponents(prevNext: PrevNext, id: string): NonNullable<GeneratedMessageObject["components"]> {
        const row = {
            type: 1,
            components: [
                {
                    type: 2,
                    label: "Previous",
                    style: 2,
                    custom_id: `cb:${id},${prevNext.previous},p`,
                    disabled: prevNext.current === 1
                },
                {
                    type: 2,
                    label: `Page ${prevNext.current}/${prevNext.total}`,
                    style: 2,
                    custom_id: `cb:disabledpagecount`,
                    disabled: true
                },
                {
                    type: 2,
                    label: "Next",
                    style: 2,
                    custom_id: `cb:${id},${prevNext.next},n`,
                    disabled: prevNext.current === prevNext.total
                }
            ]
        }
        return [row]
    }
}
