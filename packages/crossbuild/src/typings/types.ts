import { GuildedPermissionString } from "@crossbuild/types"
import {
    ClientEvents,
    ClientOptions as DiscordClientOptions,
    PermissionsString as DiscordPermissionsString
} from "discord.js"
import { ClientOptions as GuildedClientOptions } from "guilded.js"

export interface Config {
	/** The name of the bot (to refer to itself as) */
	name: string
	/** Paths that the bot should search for components under */
	componentPaths: string[]
	/** The prefix that the bot listens for. If none is specified, the prefix will default to mentioning the bot */
	prefix?: string

	supportServer?: string

	discordOptions?: DiscordClientOptions
	discordToken?: string

	guildedOptions?: GuildedClientOptions
}

export enum LogLevel {
	DEBUG = "debug",
	INFO = "info",
	WARN = "warn",
	ERROR = "error",
	NULL = "null"
}

export interface EventOptions {
	name?: keyof ClientEvents | string
	once?: boolean
}

export interface ComponentData {
	/** The description of the component */
	description: string
	options?: Array<ComponentOption>
	permissions?: { guilded: Array<GuildedPermissionString>; discord: Array<DiscordPermissionsString> }
	serverOnly?: boolean
	ownerOnly?: boolean
	cooldown?: number
}

export interface ComponentOption {
	/** The name of the option */
	name: string
	/** The description of the option */
	description: string
	/** Whether the option is required */
	required?: boolean
	/** The type of the option */
	type: "string" | "integer" | "number" | "boolean" // | "channel" | "role" | "attachment" | "user"
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

export type ComponentType = "command"
