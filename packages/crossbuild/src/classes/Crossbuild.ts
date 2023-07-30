import { resolve } from "path"
import { Client as DiscordClient, Collection, Snowflake } from "discord.js"
import { uploadHaste } from "@crossbuild/functions"
import { DiscordListener, Config, LogLevel, ComponentType, Component, ComponentHandler, GuildedListener } from "../index.js"
import { Client as GuildedClient } from "guilded.js"

export default class Crossbuild {
    public readonly discordClient?: DiscordClient
    public readonly guildedClient?: GuildedClient

    public readonly componentHandler: ComponentHandler
    public components: Collection<`${ComponentType}-${string}`, Component>
    public hasteStore: Collection<string, string[]>
    public usersUsingBot = new Set<Snowflake>()
    public config: Config
    public readonly __dirname: string
    public readonly discordListener: DiscordListener
    public readonly guildedListener: GuildedListener

    /**
	 * Create our client.
	 * @param options - The options for our client.
	 */
    constructor(config: Config) {
        if (config.discordOptions && config.discordToken && config.discordToken.length > 0) {
            this.discordClient = new DiscordClient(config.discordOptions)
        } else {
            this.log("Both discordOptions and discordToken were not provided, not using Discord client.", LogLevel.WARN)
        }
        if (config.guildedOptions && config.guildedOptions.token.length > 0) {
            this.guildedClient = new GuildedClient(config.guildedOptions)
        } else {
            this.log("guildedOptions was not provided, not using Guilded client.", LogLevel.WARN)
        }
        this.config = config

        this.__dirname = `${resolve()}/dist`

        this.components = new Collection()

        this.hasteStore = new Collection()

        this.componentHandler = new ComponentHandler(this)

        this.discordListener = new DiscordListener(this)
        this.guildedListener = new GuildedListener(this)

        this.start()
    }

    private async start() {
        if (this.discordClient) {
            this.discordClient.once("ready", () => {
                this.log("Discord client is ready!", LogLevel.DEBUG)
                this.discordListener.startListening()
            })
            this.discordClient.login(this.config.discordToken).catch((x) => {
                this.log("Failed to login to Discord client.", LogLevel.ERROR)
                this.log(x, LogLevel.ERROR)
            })
        }
        if (this.guildedClient) {
            this.guildedClient.on("ready", () => {
                this.log("Guilded client is ready!", LogLevel.DEBUG)
                this.guildedListener.startListening()
            })
            this.guildedClient.login()
        }

        await this.componentHandler.loadFiles()

        this.log("Crossbuild is ready!", LogLevel.DEBUG)
    }

    /**
	 * Log to the console. This function can be overridden to provide a custom logger.
	 * @param message - The message to log.
	 * @param level - The level of the log.
	 */
    public log = (message: string, level: LogLevel = LogLevel.INFO) => {
        switch (level) {
            case LogLevel.INFO:
                console.log(message)
                break
            case LogLevel.WARN:
                console.warn(message)
                break
            case LogLevel.ERROR:
                console.error(message)
                break
            case LogLevel.DEBUG:
                console.debug(message)
                break
            case LogLevel.NULL:
                break
            default:
                console.log(message)
                break
        }
    }

    /**
	 * This function is used when you want to slowly generate a hastebin.
	 * It provides a collection that can be accessed from the client, and will automatically append each string to a new line.
	 * You can use the {@link hasteFlush} function to upload the hastebin.
	 * @param id The ID of the store you are using.
	 * @param text The text to add to the store.
	 */
    public hasteLog(id: string, text: string) {
        const data = this.hasteStore.get(id) || []
        data.push(`${text}\n`)
        this.hasteStore.set(id, data)
    }

    /**
	 * This function is used to upload a hastebin stored using the {@link hasteLog} function.
	 * @param id - The ID of the store you are using.
	 * @param url - The URL to upload the hastebin to. If not provided, it will use the default hastebin.
	 * @returns The resulting URL
	 */
    public async hasteFlush(id: string, url?: string) {
        const raw = this.hasteStore.get(id) || []
        const final = raw.join("\n")
        if (url) {
            const data = await uploadHaste(final, "md", url)
            return data
        }
        const data = await uploadHaste(final, "md")
        return data
    }
}
