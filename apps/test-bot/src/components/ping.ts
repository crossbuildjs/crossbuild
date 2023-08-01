import { Component, CrossBuild, ReceivedInteraction } from "crossbuild"
import { ButtonStyle, ComponentType } from "discord.js"

export default class Cmd extends Component {
    constructor(client: CrossBuild) {
        super("ping", "command", client, {
            description: "Ping!",
            permissions: {
                discord: ["ManageRoles"],
                guilded: ["CanKickMembers"]
            }
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
                            style: ButtonStyle.Link,
                            label: "CrossBuild",
                            url: "https://crossbuild.buape.com"
                        }
                    ]
                }
            ]
        })
    }
}
