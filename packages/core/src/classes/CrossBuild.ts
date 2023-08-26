import { resolve } from "path"
import { Collection } from "@discordjs/collection"
import { Component, ComponentHandler, ComponentType, Config, CustomCheckFunction, LogLevel, Module, uploadHaste } from ".."
export class CrossBuild {
    public readonly componentHandler: ComponentHandler
    public components: Collection<`${ComponentType}-${string}`, Component>
    public hasteStore: Collection<string, string[]>
    public cooldowns = new Collection<`${ComponentType}-${string}`, Collection<string, number>>()
    public config: Config
    public readonly __dirname: string

    public modules = new Collection<string, Module>()

    public customChecks = new Collection<string, CustomCheckFunction>()

    /**
	 * Create our client.
	 * @param options - The options for our client.
	 */
    constructor(config: Config) {
        this.config = config

        this.__dirname = `${resolve()}/dist`

        this.components = new Collection()

        this.hasteStore = new Collection()

        this.componentHandler = new ComponentHandler(this)

        this.modules = new Collection()
        this.config.modules.map((x) => this.modules.set(x.key, x))

        this.customChecks = new Collection()
        this.config.customChecks.map((x) => {
            if (["", "anonymous"].includes(x.name)) {
                this.log(
                    "Skipping anonymous custom check. Make sure you separately define custom check functions with a name before passing them to CrossBuild",
                    LogLevel.WARN
                )
            } else {
                this.customChecks.set(x.name, x)
            }
        })

        this.start()
    }

    private async start() {
        await this.componentHandler.loadFiles()

        for await (const module of this.modules.values()) {
            await module.init(this)
            await module.startListening()
        }

        this.log("CrossBuild is ready!", LogLevel.DEBUG)
    }

    /**
	 * Log to the console. This function can be overridden to provide a custom logger.
	 * @param message - The message to log.
	 * @param level - The level of the log.
	 */
    public log = (message: object | string, level: LogLevel = LogLevel.INFO) => {
        if (typeof message === "object") message = message.toString()
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
