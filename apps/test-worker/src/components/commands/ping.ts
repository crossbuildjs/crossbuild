import { Component, CrossBuild, ReceivedInteraction } from "@crossbuild/core"
import { ButtonStyle, ComponentType } from "discord-api-types/v10"

export default class Cmd extends Component {
    constructor(client: CrossBuild) {
        super("ping", "command", client, {
            description: "Ping!"
        })
    }

    public override async run(interaction: ReceivedInteraction) {
        interaction.channel?.send("Test channel send")
        await interaction.reply({
            content: `Pong`,
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            label: "Ping",
                            custom_id: "buttonping",
                            style: ButtonStyle.Secondary
                        }
                    ]
                }
            ]
        })
    }
}
