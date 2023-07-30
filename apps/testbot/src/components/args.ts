import { Component, Crossbuild, ReceivedInteraction } from "crossbuild"
import { ApplicationCommandOptionType } from "discord.js"

export default class Cmd extends Component {
    constructor(client: Crossbuild) {
        super("argstest", "command", client, {
            description: "Test argument parsing",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "string",
                    description: "A string",
                    required: true
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "integer",
                    description: "An integer",
                    required: true
                },
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: "boolean",
                    description: "A boolean",
                    required: true
                }
            ]
        })
    }

    public override async run(interaction: ReceivedInteraction) {
        interaction.reply({
            content: `Arguments: ${JSON.stringify(interaction.options)}`
        })
    }
}
