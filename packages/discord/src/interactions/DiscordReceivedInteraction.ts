import { CrossBuild, GeneratedMessage, ReceivedInteraction, ReceivedInteractionData } from "@crossbuild/core"
import { BaseInteraction } from "discord.js"
import { DiscordMessage, DiscordServer } from ".."

export interface DiscordReceivedInteractionData extends Omit<ReceivedInteractionData, "server"> {
	original: BaseInteraction
	server: DiscordServer | null
}

export class DiscordReceivedInteraction extends ReceivedInteraction {
    source: "discordInteraction"
    original: BaseInteraction

    constructor(crossbuild: CrossBuild, data: DiscordReceivedInteractionData) {
        super(crossbuild, data)
        this.source = "discordInteraction"
        this.original = data.original
    }

    public async reply(message: GeneratedMessage) {
        if (this.original.isChatInputCommand() || this.original.isButton() || this.original.isAnySelectMenu()) {
            const msg = await this.original.reply(
                typeof message === "string"
                    ? {
                        content: message,
                        fetchReply: true
					  }
                    : {
                        embeds: message.embeds,
                        components: message.components,
                        content: message.content,
                        ephemeral: message.silent,
                        fetchReply: true
					  }
            )
            return new DiscordMessage(msg)
        } else {
            throw new Error("An interaction that could not be replied to was found.")
        }
    }

    public async deferReply(ephemeral = false) {
        if (this.original.isChatInputCommand() || this.original.isButton() || this.original.isAnySelectMenu()) {
            await this.original.deferReply({ ephemeral, fetchReply: true })
        } else {
            throw new Error("An interaction that could not be replied to was found.")
        }
    }

    public async editReply(message: GeneratedMessage) {
        if (this.original.isChatInputCommand() || this.original.isButton() || this.original.isAnySelectMenu()) {
            const msg = await this.original.editReply(
                typeof message === "string"
                    ? {
                        content: message
					  }
                    : {
                        embeds: message.embeds,
                        components: message.components,
                        content: message.content
					  }
            )
            return new DiscordMessage(msg)
        } else {
            throw new Error("An interaction that could not be replied to was found.")
        }
    }

    public async followUp(message: GeneratedMessage) {
        if (this.original.isChatInputCommand() || this.original.isButton() || this.original.isAnySelectMenu()) {
            const msg = await this.original.followUp(
                typeof message === "string"
                    ? {
                        content: message
					  }
                    : {
                        embeds: message.embeds,
                        components: message.components,
                        content: message.content,
                        ephemeral: message.silent
					  }
            )
            return new DiscordMessage(msg)
        } else {
            throw new Error("An interaction that could not be replied to was found.")
        }
    }

    public async update(message: GeneratedMessage) {
        if (this.original.isButton() || this.original.isAnySelectMenu()) {
            const msg = await this.original.update(
                typeof message === "string"
                    ? {
                        content: message,
                        fetchReply: true
					  }
                    : {
                        embeds: message.embeds,
                        components: message.components,
                        content: message.content,
                        fetchReply: true
					  }
            )
            return new DiscordMessage(msg)
        } else {
            throw new Error("An interaction that could not be updated was found.")
        }
    }
}
