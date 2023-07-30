<div align="center">
<img width="150" height="150" src="https://cdn.buape.com/crossbuild.png" alt="CrossBuild Logo" />

<h1 align="center"><b>CrossBuild</b></h1>

</div>

## Installation

To install this package, you can use one of the following commands, depending on your package manager.

```
npm install crossbuild
pnpm add crossbuild
yarn add crossbuild
```

If you are connecting your bot to Discord, you will likely need [Discord.js](https://npmjs.com/package/discord.js) as well.

```
npm install discord.js
```

If you are connecting your bot to Guilded, you will likely need [Guilded.js](https://npmjs.com/package/guilded.js) as well.

```
npm install guilded.js
```

## Usage

CrossBuild is a library that allows you to build bots for Discord and Guilded, at the same time. It is designed to be as simple as possible, while still being powerful. Here is a simple example of a CrossBuild bot in Typescript:

```ts
// src/index.ts
import { CrossBuild, LogLevel } from "crossbuild"

new CrossBuild({
	name: "Test Bot",
	componentPaths: ["/src/components"],
	discordOptions: {
		intents: ["Guilds", "GuildMessages", "MessageContent"]
	},
	guildedOptions: {
		token: process.env.GUILDED_TOKEN
	},
	discordToken: process.env.DISCORD_TOKEN,
	prefix: "-"
})

// src/components/ping.ts
import { Component, CrossBuild, ReceivedInteraction } from "crossbuild"

export default class Cmd extends Component {
	constructor(client: CrossBuild) {
		super("ping", "command", client, {
			description: "Ping!"
		})
	}

	public override async run(interaction: ReceivedInteraction) {
		await interaction.reply({
			content: `Pong`
		})
	}
}
```

## Contributing

If you want to contribute to CrossBuild, please read the [contributing guidelines](/CONTRIBUTING.md) first. We welcome all types of contributions, from bug fixes to documentation improvements! If you have any questions, feel free to join our [Discord server](https://go.buape.com/discord) and ask in the `#crossbuild` channel.

## License

CrossBuild is licensed under the [MIT License](/LICENSE).
