import { GeneratedMessage } from "@crossbuild/types"
import { MessageContent } from "guilded.js"

export const createMessageData = (message: GeneratedMessage): MessageContent => {
    return typeof message === "string"
        ? { content: message }
        : {
            content: message.content,
            embeds: message.embeds,
            isPrivate: message.ephemeral,
            isSilent: message.silent
		  }
}
