import { Component, CrossBuild, ReceivedInteraction } from "../../../../../packages/core/dist"

export default class Cmd extends Component {
    constructor(client: CrossBuild) {
        super("buttonping", "button", client, {
        })
    }

    public override async run(interaction: ReceivedInteraction) {
        await interaction.reply({
            content: "Button pong!"
        })
    }
}
