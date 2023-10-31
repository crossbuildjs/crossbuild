import { Component, CrossBuild, ReceivedInteraction } from "crossbuild"

export default class Cmd extends Component {
    constructor(client: CrossBuild) {
        super("sunday", "command", client, {
            description: "Check if it is sunday",
            customChecks: ["todayIsSunday"]
        })
    }

    public override async run(interaction: ReceivedInteraction) {
        interaction.reply("It's sunday!")
    }
}
