import { Crossbuild, LogLevel, ReceivedInteraction } from "../index.js"
import { Message } from "guilded.js"

export default class GuildedListener {
    client: Crossbuild
    constructor(client: Crossbuild) {
        this.client = client
    }

    public async startListening() {
        this.client.guildedClient?.on("messageCreated", (message) => {
            this.message(message)
        })
    }

    public async stopListening() {
        this.client.guildedClient?.off("messageCreated", (message) => {
            this.message(message)
        })
    }

    private async message(guildedMessage: Message) {
        if (!this.client.config.prefix) return this.client.log("No prefix provided, not listening for commands.", LogLevel.DEBUG)

        if (!guildedMessage.content.startsWith(this.client.config.prefix)) return

        const args = guildedMessage.content.slice(this.client.config.prefix.length).trim().split(/ +/g)
        const command = args.shift()?.toLowerCase()
        if (!command) return

        const flags: { [key: string]: string } = {}
        const regex = /--([^\s]+) ([^\s]+)/g

        let match
        while ((match = regex.exec(guildedMessage.content))) {
            flags[match[1]] = match[2]
        }

        const interaction = new ReceivedInteraction(this.client, {
            key: command,
            source: "guilded",
            type: "command",
            originalGuilded: guildedMessage,
            options: flags
        })
        this.client.componentHandler.handleComponent(interaction)
    }
}
