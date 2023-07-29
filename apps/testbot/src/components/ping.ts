import { Component, Crossbuild, ReceivedInteraction } from "crossbuild"
import { ButtonStyle, ComponentType } from "discord.js"

export default class Cmd extends Component {
    constructor(client: Crossbuild) {
        super("ping", "command", client, {
            description: "Ping!",
            permissions: {
                discord: ["ManageRoles"],
                guilded: ["CanKickMembers"]
            }
        })
    }

    public override async run(interaction: ReceivedInteraction) {
        await interaction.reply({
            content: `Pong`,
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            style: ButtonStyle.Link,
                            label: "Crossbuild",
                            url: "https://crossbuild.google.com"
                        }
                    ]
                }
            ]
        })
    }
}
