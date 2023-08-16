import { GeneratedMessage } from "@crossbuild/types"
import { ReceivedInteraction, Component, Module } from ".."

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

export enum LogLevel {
	DEBUG = "debug",
	INFO = "info",
	WARN = "warn",
	ERROR = "error",
	NULL = "null"
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
	type: "string" | "integer" | "number" | "boolean" | "channel" | "role" | "user" // | "attachment"
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
export type CustomCheckFunction = (interaction: ReceivedInteraction, component: Component) => Promise<GeneratedMessage | null>
