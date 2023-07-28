import { Component, Crossbuild, ReceivedInteraction } from "crossbuild"

export default class Cmd extends Component {
    constructor(client: Crossbuild) {
        super("ping", "command", client, {
            description: "Ping!"
        })
    }

    public override async run(interaction: ReceivedInteraction) {
        const formatted = JSON.stringify(
            {
                key: interaction.key,
                type: interaction.type,
                source: interaction.source,
                options: interaction.options,
                server: interaction.server,
                user: interaction.user
            },
            null,
            2
        )
        await interaction.reply({ content: `\`\`\`json\n${formatted}\`\`\`` })
    }
}
