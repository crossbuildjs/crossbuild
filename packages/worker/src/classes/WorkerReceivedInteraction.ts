import { CrossBuild, GeneratedMessage, ReceivedInteraction, ReceivedInteractionData } from "@crossbuild/core"
import { APIInteraction, Routes } from "discord-api-types/v10"
import { WorkerModule } from ".."

export type WorkerReceivedInteractionData = ReceivedInteractionData & {
	original: APIInteraction
	module: WorkerModule
	webhook: {
		id: string
		token: string
	}
}

export class WorkerReceivedInteraction extends ReceivedInteraction {
    source: "worker"
    original: APIInteraction
    private module: WorkerModule
    private webhook: WorkerReceivedInteractionData["webhook"]

    constructor(crossbuild: CrossBuild, data: WorkerReceivedInteractionData) {
        super(crossbuild, data)
        this.source = "worker"
        this.original = data.original
        this.module = data.module
        this.webhook = data.webhook
    }

    public async reply(message: GeneratedMessage) {
        const a = await this.module.client.patch(Routes.webhookMessage(this.webhook.id, this.webhook.token, "@original"), {
            body:
				typeof message === "string"
				    ? { content: message }
				    : {
				        content: message.content,
				        embeds: message.embeds,
				        components: message.components
					  }
        })
        console.log(a)
        return ""
    }
}
