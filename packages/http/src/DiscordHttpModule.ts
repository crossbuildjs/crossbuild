import {
    ComponentOption,
    Module,
    ModuleConfig,
    OptionsHandler,
    ReceivedInteraction
} from "@crossbuild/core"
import { serve } from "@hono/node-server"
import { Context, Hono } from "hono"
import { HttpModulePaginator } from "."
import { verify } from "discord-verify/."
import {
	APIApplicationCommand,
    APIInteraction,
    ApplicationCommandOptionType,
    InteractionResponseType,
    InteractionType,
	RESTPostAPIApplicationCommandsJSONBody,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
	Routes
} from "discord-api-types/v10"

export interface DiscordHttpModuleConfig extends ModuleConfig {
    redirectUrl: string
	clientId: string
    publicKey: string
    port?: number
}

export class DiscordHttpModule extends Module {
    key = "discordHttp"
    config: DiscordHttpModuleConfig
    client: Hono
    modulePaginator = new HttpModulePaginator()

    constructor(config: DiscordHttpModuleConfig) {
        super(config)
        this.client = new Hono()
        this.config = config
        if (!this.config.port) this.config.port = 3000
    }

    public async load() {
        this.client.get("/", (c) => {
            return c.redirect(this.config.redirectUrl)
        })
        this.client.get("/interaction", async (c) => {
            this.interaction(c)
        })

		try {
			fetch(Routes.applicationCommands(this.config.clientId), {method: "PUT"})
			const commands = this.crossbuild!.components.filter(
				(x) => x.type === "command"
			).map((command) => {
				const data: RESTPostAPIChatInputApplicationCommandsJSONBody = {
					name: command.key,
					description:
						command.description || "No description provided",
					options: [
						{
							type: ApplicationCommandOptionType.String
						}
					]
				}
				return data
			})
		}


        return true
    }

    startListening(): Promise<void> {
        serve({ fetch: this.client.fetch, port: this.config.port })
        return Promise.resolve()
    }

    public async stopListening() {
        throw new Error("Method not implemented.")
    }

    optionsHandler(
        _interaction: ReceivedInteraction,
        _componentOptions: ComponentOption[]
    ): OptionsHandler {
        throw new Error("Method not implemented.")
    }

    private async interaction(c: Context) {
        const invalid = this.validateInteraction(c)
        if (invalid) return invalid
        const interaction = (await c.req.json()) as APIInteraction

        if (interaction.type === InteractionType.Ping) {
            return c.json({
                type: InteractionResponseType.Pong
            })
        }


    }

    private validateInteraction(c: Context) {
        if (c.req.method !== "POST") {
            c.status(405)
            return c.text("Method not allowed.")
        }
        if (
            !c.req.header("x-signature-ed25519") ||
            !c.req.header("x-signature-timestamp")
        ) {
            c.status(401)
            return c.text("Invalid request signature.")
        }
        const signature = c.req.header("x-signature-ed25519")
        const timestamp = c.req.header("x-signature-timestamp")
        const body = JSON.stringify(c.body)
        const isValid = verify(
            body,
            signature,
            timestamp,
            this.config.publicKey,
            crypto.subtle
        )
        if (!isValid) {
            c.status(401)
            return c.text("Invalid request signature.")
        }
        return
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
