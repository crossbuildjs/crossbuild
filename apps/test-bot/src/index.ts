import { CrossBuild, DiscordInteractionsModule, DiscordMessageModule, GuildedModule, LogLevel, getComponents } from "crossbuild"
import { GatewayIntentBits } from "discord.js"

const crossbuild = new CrossBuild({
    name: "Test Bot",
    modules: [
        new DiscordInteractionsModule({
            name: "Shadow Testing",
            options: {
                intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
            },
            token: process.env.DISCORD_TOKEN!
        }),
        new DiscordMessageModule({
            name: "Shadow Testing Messages",
            options: {
                intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
            },
            token: process.env.DISCORD_TOKEN!,
            prefix: "-"
        }),
        new GuildedModule({
            name: "Shadow Testing Guilded",
            options: {
                token: process.env.GUILDED_TOKEN!
            },
            prefix: "-"
        })
    ]
})

crossbuild.addComponents(await getComponents(["/src/components/buttons", "/src/components/commands", "/src/components/selectMenus"], crossbuild))

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

sleep(3000).then(() => crossbuild.log(`${crossbuild}`, LogLevel.DEBUG))
