import { Component, CrossBuild, ReceivedInteraction, Paginator } from "@crossbuild/core"

export default class Cmd extends Component {
    constructor(client: CrossBuild) {
        super("paginator", "command", client, {
            description: "Paginator test",
        })
    }

    public override async run(interaction: ReceivedInteraction) {
        if(!interaction.user) return
        const paginator = new Paginator({ id: interaction.id, userId: interaction.user.id, crossbuild: this.client })
        paginator.addPages([{
            embeds: [{ title: "Page 1" }]
        }, {
            embeds: [{ title: "Page 2" }]
        }])
        console.log(paginator)
        paginator.send(interaction)
    }
}
