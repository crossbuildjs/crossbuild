import { Component, CrossBuild, ReceivedInteraction } from "../../../../../packages/core/dist"
import { todayIsSunday } from "../../customChecks"

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
