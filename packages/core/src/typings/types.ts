import {
	APIActionRowComponent,
	APIEmbed,
	APIMessageActionRowComponent
} from "discord-api-types/v10"
import { Component, Module, ReceivedInteraction } from ".."

export * from "./events"

export interface Config {
	/** The name of the bot (to refer to itself as) */
	name: string
	/** Paths that the bot should search for components under */
	componentPaths: string[]
	/** The prefix that the bot listens for. If none is specified, the prefix will default to mentioning the bot */
	prefix?: string
	supportLink?: string

	modules: Array<Module>
	customChecks: Array<CustomCheckFunction>
}

export interface EventOptions {
	name?: string
	once?: boolean
}

export interface ComponentData {
	/** The description of the component */
	description?: string
	options?: Array<ComponentOption>
	serverOnly?: boolean
	ownerOnly?: boolean
	cooldown?: number
	/**
	 * Any custom checks that should be run before the component is executed.
	 * These are specified in the initialization of the client, and you can use the name of the function here.
	 */
	customChecks?: Array<string>
}

export interface ComponentOption {
	/** The name of the option */
	name: string
	/** The description of the option */
	description?: string
	/** Whether the option is required */
	required?: boolean
	/** The type of the option */
	type:
		| "string"
		| "integer"
		| "number"
		| "boolean"
		| "channel"
		| "role"
		| "user" // | "attachment"
	/** If you want to restrict the user to a set of choices, you can specify them here. */
	choices?: { name: string; value: string | number | boolean }[]
	/** If the type is a number, you can specify a minimum value */
	minValue?: number
	/** If the type is a number, you can specify a maximum value */
	maxValue?: number
	/** If the type is a string, you can specify a minimum length */
	minLength?: number
	/** If the type is a string, you can specify a maximum length */
	maxLength?: number
}

export type InteractionRawOptions = { [key: string]: string | number | boolean }

export type ComponentType = "command" | "button" | "selectMenu"

/**
 * This is a function that is called to check if a Component should be run or not.
 * If the function returns a {@link GeneratedMessage}, the message will be sent to the channel that the interaction was received in.
 * Otherwise, the function returns null and the component will be run.
 */
export type CustomCheckFunction = (
	interaction: ReceivedInteraction,
	component: Component
) => Promise<GeneratedMessage | null>

export type SimpleEmbed = {
	title?: string
	description?: string
}

export type GeneratedMessage =
	| string
	| {
			/** Any embeds that you want to send */
			embeds?: APIEmbed[]
			/** If the message is a response to a slash command from Discord, you can send an ephemeral response. This will be ignored for Guilded. */
			ephemeral?: boolean
			/** Any components to include when sending to Discord. */
			components?: APIActionRowComponent<APIMessageActionRowComponent>[]
			/** The basic text of the message */
			content?: string
	  }

export type GeneratedMessageObject = Extract<
	GeneratedMessage,
	{ content?: string }
>

// Source: https://www.npmjs.com/package/typed-emitter
// tsc did not like the format of the package, so I just copied the types here.
type EventMap = {
	// biome-ignore lint/suspicious/noExplicitAny: this is a true any
	[key: string]: (...args: any[]) => void
}
export interface TypedEventEmitter<Events extends EventMap> {
	addListener<_E extends keyof Events>(event: _E, listener: Events[_E]): this
	on<_E extends keyof Events>(event: _E, listener: Events[_E]): this
	once<_E extends keyof Events>(event: _E, listener: Events[_E]): this
	prependListener<_E extends keyof Events>(
		event: _E,
		listener: Events[_E]
	): this
	prependOnceListener<_E extends keyof Events>(
		event: _E,
		listener: Events[_E]
	): this

	off<_E extends keyof Events>(event: _E, listener: Events[_E]): this
	removeAllListeners<_E extends keyof Events>(event?: _E): this
	removeListener<_E extends keyof Events>(event: _E, listener: Events[_E]): this

	emit<_E extends keyof Events>(
		event: _E,
		...args: Parameters<Events[_E]>
	): boolean
	// The sloppy `eventNames()` return type is to mitigate type incompatibilities - see #5
	eventNames(): (keyof Events | string | symbol)[]
	rawListeners<_E extends keyof Events>(event: _E): Events[_E][]
	listeners<_E extends keyof Events>(event: _E): Events[_E][]
	listenerCount<_E extends keyof Events>(event: _E): number

	getMaxListeners(): number
	setMaxListeners(maxListeners: number): this
}
