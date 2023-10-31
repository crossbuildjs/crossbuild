import { Component, CrossBuild, ReceivedInteraction } from "crossbuild"
import { sleep } from "../../index.js"

export default class Cmd extends Component {
    constructor(client: CrossBuild) {
        super("replies", "command", client, {
            description: "Check other reply methods"
        })
    }

    public override async run(interaction: ReceivedInteraction) {
        await interaction.deferReply()
        await sleep(1000)
        await interaction.editReply("Loading... 50%")
        await sleep(1000)
        await interaction.editReply("Loading... 100%")
        await sleep(1000)
        await interaction.editReply("Done!")
        await sleep(1000)
        await interaction.followUp("Done again!")
    }
}
