import { AccessSettings } from "@crossbuild/functions"
import {
    ApplicationCommandOptionData,
    ApplicationCommandType,
    ClientEvents,
    ClientOptions as DiscordClientOptions,
    PermissionsBitField
} from "discord.js"
import { ClientOptions as GuildedClientOptions } from "guilded.js"

export interface Config {
	/** The name of the bot (to refer to itself as) */
	name: string
	/** Paths that the bot should search for components under */
	componentPaths: string[]
	/** The prefix that the bot should use. If none is specified, it will default to mentioning the bot */
	prefix?: string

	supportServer?: string

	discordOptions?: DiscordClientOptions
	discordToken?: string

	guildedOptions?: GuildedClientOptions

	accessSettings?: AccessSettings
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

export interface ComponentOptions {
	description: string
	options?: ApplicationCommandOptionData[]
	type?: ApplicationCommandType
	permissions?: PermissionsBitField
	clientPermissions?: PermissionsBitField
	restriction?: string
	serverOnly?: boolean
	ownerOnly?: boolean
	authorOnly?: boolean
	cooldown?: number
}

export type ComponentType = "command"
