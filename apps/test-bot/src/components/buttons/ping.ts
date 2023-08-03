import { Component, CrossBuild, ReceivedInteraction } from "crossbuild"

export default class Cmd extends Component {
    constructor(client: CrossBuild) {
        super("ping", "button", client, {
        })
    }

    public override async run(interaction: ReceivedInteraction) {
        await interaction.reply({
            content: "Button pong!"
        })
    }
}
