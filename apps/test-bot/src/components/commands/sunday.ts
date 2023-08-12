import { Component, CrossBuild, ReceivedInteraction } from "crossbuild"
import { todayIsSunday } from "../../customChecks.js"

export default class Cmd extends Component {
    constructor(client: CrossBuild) {
        super("ping", "command", client, {
            description: "Ping!",
            customChecks: [todayIsSunday]
        })
    }

    public override async run(interaction: ReceivedInteraction) {
        interaction.reply("It's sunday!")
    }
}
