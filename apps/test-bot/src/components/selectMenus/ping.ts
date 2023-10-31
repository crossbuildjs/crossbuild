import { Component, CrossBuild, ReceivedInteraction } from "crossbuild"

export default class Cmd extends Component {
	constructor(client: CrossBuild) {
		super("selectping", "selectMenu", client, {})
	}

	public override async run(interaction: ReceivedInteraction) {
		await interaction.reply({
			content: `Dropdown pong: ${interaction.selectMenuValues?.join(", ")}`
		})
	}
}
