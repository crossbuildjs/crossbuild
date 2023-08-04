import { GeneratedMessage } from "@crossbuild/types"
import { CrossBuild, LogLevel, Paginator, ReceivedInteraction } from "../index.js"
import { CacheType, Collection, Interaction, Message } from "discord.js"

export default class DiscordListeners {
    client: CrossBuild
    paginators: Collection<string, Paginator> = new Collection()

    constructor(client: CrossBuild) {
        this.client = client
    }

    public async startListening() {
        this.client.discordClient?.on("interactionCreate", (interaction) => {
            if (interaction.isButton() && interaction.customId.startsWith("cb")) {
                const paginator = this.paginators.get(interaction.customId.split(":")[1].split(",")[0])
                if (paginator) return paginator.handleDiscordInteraction(interaction)
            }
            this.interaction(interaction)
        })

        this.client.discordClient?.on("messageCreate", (message) => {
            this.message(message)
        })
    }

    public async stopListening() {
        this.client.discordClient?.off("interactionCreate", (interaction) => {
            this.interaction(interaction)
        })
        this.client.discordClient?.off("messageCreate", (message) => {
            this.message(message)
        })
    }

    public watchPaginator(paginator: Paginator) {
        this.paginators.set(paginator.id, paginator)
    }

    public unwatchPaginator(paginator: Paginator) {
        this.paginators.delete(paginator.id)
    }

    private async interaction(discordInteraction: Interaction<CacheType>) {
        const server = discordInteraction.guildId ? {
            id: discordInteraction.guildId,
            name: discordInteraction.guild?.name,
            ownerId: discordInteraction.guild?.ownerId || undefined,
            iconURL: discordInteraction.guild?.iconURL() || undefined,
            description: discordInteraction.guild?.description || undefined
        } : null
        const user = {
            id: discordInteraction.user.id,
            displayName: discordInteraction.user.displayName,
            username: discordInteraction.user.username,
            avatarURL: discordInteraction.user.avatarURL() || undefined,
            permissions: discordInteraction.memberPermissions?.toArray() || [],
        }

        if (discordInteraction.isChatInputCommand()) {
            const channel = discordInteraction.channel ? discordInteraction.channel.isDMBased() ? {
                id: discordInteraction.channelId,
                send: async (message: GeneratedMessage) => {
                    await discordInteraction.channel?.send(message)
                }
            } : {
                id: discordInteraction.channelId,
                name: discordInteraction.channel.name,
                parentId: discordInteraction.channel.parentId || undefined,
                send: async (message: GeneratedMessage) => {
                    await discordInteraction?.channel?.send(message)
                }
            } : null
            const interaction = new ReceivedInteraction(this.client, {
                id: discordInteraction.id,
                key: discordInteraction.commandName,
                source: "discordInteraction",
                type: "command",
                originalDiscordInteraction: discordInteraction,
                server, user, channel
            })
            this.client.componentHandler.handleComponent(interaction)
        }
        else if (discordInteraction.isButton()) {
            const channel = discordInteraction.channel ? discordInteraction.channel.isDMBased() ? {
                id: discordInteraction.channelId,
                send: async (message: GeneratedMessage) => {
                    await discordInteraction.channel?.send(message)
                }
            } : {
                id: discordInteraction.channelId,
                name: discordInteraction.channel.name,
                parentId: discordInteraction.channel.parentId || undefined,
                send: async (message: GeneratedMessage) => {
                    await discordInteraction?.channel?.send(message)
                }
            } : null
            const interaction = new ReceivedInteraction(this.client, {
                id: discordInteraction.id,
                key: discordInteraction.customId,
                source: "discordInteraction",
                type: "button",
                originalDiscordInteraction: discordInteraction,
                server, user, channel
            })
            this.client.componentHandler.handleComponent(interaction)
        } else if (discordInteraction.isAnySelectMenu()) {
            const channel = discordInteraction.channel ? discordInteraction.channel.isDMBased() ? {
                id: discordInteraction.channelId,
                send: async (message: GeneratedMessage) => {
                    await discordInteraction.channel?.send(message)
                }
            } : {
                id: discordInteraction.channelId,
                name: discordInteraction.channel.name,
                parentId: discordInteraction.channel.parentId || undefined,
                send: async (message: GeneratedMessage) => {
                    await discordInteraction?.channel?.send(message)
                }
            } : null
            const interaction = new ReceivedInteraction(this.client, {
                id: discordInteraction.id,
                key: discordInteraction.customId,
                source: "discordInteraction",
                type: "selectMenu",
                originalDiscordInteraction: discordInteraction,
                server, user, channel,
                selectMenuValues: discordInteraction.values
            })
            this.client.componentHandler.handleComponent(interaction)
        }
    }

    private async message(discordMessage: Message) {
        if (!this.client.config.prefix) return this.client.log("No prefix provided, not listening for commands.", LogLevel.DEBUG)

        if (!discordMessage.content.startsWith(this.client.config.prefix)) return

        const args = discordMessage.content.slice(this.client.config.prefix.length).trim().split(/ +/g)
        const command = args.shift()?.toLowerCase()
        if (!command) return

        const flags: { [key: string]: string } = {}
        const regex = /--(\S+)\s+([\s\S]+?)(?=\s+--|$)/g

        let match
        while ((match = regex.exec(discordMessage.content))) {
            flags[match[1]] = match[2]
        }

        const interaction = new ReceivedInteraction(this.client, {
            id: discordMessage.id,
            key: command,
            source: "discordMessage",
            type: "command",
            originalDiscordMessage: discordMessage,
            rawOptions: flags,
            server: discordMessage.guildId ? {
                id: discordMessage.guildId,
                name: discordMessage.guild?.name,
                ownerId: discordMessage.guild?.ownerId || undefined,
                iconURL: discordMessage.guild?.iconURL() || undefined,
                description: discordMessage.guild?.description || undefined
            } : null,
            user: {
                id: discordMessage.author.id,
                displayName: discordMessage.author.displayName,
                username: discordMessage.author.username,
                avatarURL: discordMessage.author.avatarURL() || undefined,
                permissions: discordMessage.member?.permissions?.toArray() || [],
            },
            channel: discordMessage.channel ? discordMessage.channel.isDMBased() ? {
                id: discordMessage.channelId,
                send: async (message: GeneratedMessage) => {
                    await discordMessage.channel?.send(message)
                }
            } : {
                id: discordMessage.channelId,
                name: discordMessage.channel.name,
                parentId: discordMessage.channel.parentId || undefined,
                send: async (message: GeneratedMessage) => {
                    await discordMessage?.channel?.send(message)
                }
            } : null
        })
        this.client.componentHandler.handleComponent(interaction)
    }
}
