import { APIActionRowComponent, APIEmbed, APIMessageActionRowComponent } from "discord-api-types/v10"

export type SimpleEmbed = {
	title?: string
	description?: string
}

export type GeneratedMessage =
	| string
	| {
			/** Any embeds that you want to send */
			embeds?: APIEmbed[]
			/** Any components to include when sending to Discord. */
			components?: APIActionRowComponent<APIMessageActionRowComponent>[]
			/** The basic text of the message */
			content?: string
			/** Should this message not ping any mentioned users or roles */
			silent?: boolean;
			/** Send this response privately so no others can view it */
			private?: boolean;
	  }

export type GeneratedMessageObject = Extract<GeneratedMessage, { content?: string }>
