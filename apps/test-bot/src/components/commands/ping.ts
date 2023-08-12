import { Component, CrossBuild, ReceivedInteraction } from "crossbuild"
import { ButtonStyle, ComponentType } from "discord.js"

export default class Cmd extends Component {
    constructor(client: CrossBuild) {
        super("ping", "command", client, {
            description: "Ping!"
            // permissions: {
            //     discord: ["ManageRoles"],
            //     guilded: ["CanKickMembers"]
            // }
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
                            style: ButtonStyle.Secondary,
                            label: "Ping",
                            custom_id: "buttonping"
                        },
                        {
                            type: ComponentType.Button,
                            style: ButtonStyle.Link,
                            label: "CrossBuild",
                            url: "https://crossbuild.buape.com"
                        }
                    ]
                },
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.StringSelect,
                            custom_id: "selectping",
                            options: [
                                {
                                    label: "One",
                                    value: "1"
                                },
                                {
                                    label: "Two",
                                    value: "2"
                                },
                                {
                                    label: "Three",
                                    value: "3"
                                }
                            ]
                        }
                    ]
                }
            ]
        })
    }
}
