import {
    ComponentOption,
    Module,
    ModuleConfig,
    ModulePaginator
} from "@crossbuild/core"
import {
    ApplicationCommandData,
    ApplicationCommandOptionData,
    ApplicationCommandOptionType,
    CacheType,
    Client,
    ClientOptions,
    Interaction
} from "discord.js"
import {
    DiscordChannel,
    DiscordInteractionModulePaginator,
    DiscordInteractionOptionsHandler,
    DiscordMessage,
    DiscordMessageModule,
    DiscordReceivedInteraction,
    DiscordReceivedInteractionData,
    DiscordServer,
    DiscordUser
} from ".."

export interface DiscordInteractionModuleConfig extends ModuleConfig {
    /** The options to pass to the Discord client */
    options: ClientOptions
    /** The token of your bot */
    token: string
}

export class DiscordInteractionModule extends Module {
    key = "discordInteraction"
    config: DiscordInteractionModuleConfig
    client: Client
    modulePaginator: ModulePaginator

    constructor(config: DiscordInteractionModuleConfig) {
        super(config)
        this.client = new Client(config.options)
        this.config = config
        this.modulePaginator = new DiscordInteractionModulePaginator()
    }

    public optionsHandler(
        interaction: DiscordReceivedInteraction,
        componentOptions: ComponentOption[]
    ): DiscordInteractionOptionsHandler {
        return new DiscordInteractionOptionsHandler(
            interaction,
            componentOptions
        )
    }

    public async load() {
        await this.client.login(this.config.token)

        try {
            this.client.application?.commands.set(
                this.crossbuild!.components.filter(
                    (x) => x.type === "command"
                ).map((command) => {
                    const data: ApplicationCommandData = {
                        name: command.key,
                        description:
                            command.description || "No description provided",
                        options: command.options?.map((option) => {
                            return {
                                type: mapType(option.type),
                                name: option.name,
                                description:
                                    option.description ||
                                    "No description provided",
                                required: option.required || false,
                                choices: option.choices,
                                min_value: option.minValue,
                                max_value: option.maxValue,
                                min_length: option.minLength,
                                max_length: option.maxLength
                            } as ApplicationCommandOptionData
                        })
                    }
                    return data
                })
            )
        } catch (error) {
            this.crossbuild!.emit(
                "warn",
                `Failed to sync Discord commands: ${error}`
            )
        }
        return true
    }

    public async startListening() {
        this.client.on("interactionCreate", (interaction) =>
            this.interaction(interaction)
        )

        if (
            !this.crossbuild?.modules.find(
                (x) => x instanceof DiscordMessageModule
            )
        ) {
            this.client.on("messageCreate", (message) => {
                this.crossbuild?.emit("message", new DiscordMessage(message))
            })
        }
    }

    public async stopListening() {
        this.client.off("interactionCreate", (interaction) =>
            this.interaction(interaction)
        )
        if (
            !this.crossbuild?.modules.find(
                (x) => x instanceof DiscordMessageModule
            )
        ) {
            this.client.on("messageCreate", (message) => {
                this.crossbuild?.emit("message", new DiscordMessage(message))
            })
        }
    }

    private async interaction(discordInteraction: Interaction<CacheType>) {
        if (!this.crossbuild) throw new Error("CrossBuild client not loaded")
        const server = discordInteraction.guild
            ? new DiscordServer(discordInteraction.guild)
            : null
        const user = new DiscordUser(discordInteraction.user)
        const channel = discordInteraction.channel
            ? new DiscordChannel(discordInteraction.channel)
            : null

        const rawOptions: DiscordReceivedInteractionData["rawOptions"] = {}

        if (discordInteraction.isChatInputCommand()) {
            discordInteraction.options.data.map((option) => {
                if (option.value !== undefined)
                    rawOptions[option.name] = option.value
            })
        }

        const interaction = new DiscordReceivedInteraction(this.crossbuild, {
            id: discordInteraction.id,
            key:
                discordInteraction.isCommand() ||
                discordInteraction.isAutocomplete()
                    ? discordInteraction.commandName
                    : discordInteraction.customId,
            type: discordInteraction.isChatInputCommand()
                ? "command"
                : discordInteraction.isButton()
                ? "button"
                : discordInteraction.isAnySelectMenu()
                ? "selectMenu"
                : "command",
            original: discordInteraction,
            server,
            user,
            channel,
            rawOptions,
            selectMenuValues: discordInteraction.isAnySelectMenu()
                ? discordInteraction.values
                : undefined
        })
        if (
            discordInteraction.isButton() &&
            discordInteraction.customId.startsWith("cb")
        ) {
            const paginator = this.modulePaginator.paginators.get(
                discordInteraction.customId.split(":")[1].split(",")[0]
            )
            if (paginator)
                return this.modulePaginator.handlePage(paginator, interaction)
        } else {
            this.crossbuild.componentHandler.handleComponent(interaction)
        }
    }
}

const mapType = (
    type: ComponentOption["type"]
): ApplicationCommandOptionType => {
    switch (type) {
        case "string":
            return ApplicationCommandOptionType.String
        case "integer":
            return ApplicationCommandOptionType.Integer
        case "boolean":
            return ApplicationCommandOptionType.Boolean
        case "number":
            return ApplicationCommandOptionType.Number
        case "user":
            return ApplicationCommandOptionType.User
        case "channel":
            return ApplicationCommandOptionType.Channel
        case "role":
            return ApplicationCommandOptionType.Role
        default:
            return ApplicationCommandOptionType.String
    }
}
