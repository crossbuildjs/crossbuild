import { Component, CrossBuild, DiscordInteractionModule, DiscordMessageModule, GeneratedMessage, GuildedModule, LogLevel, ReceivedInteraction } from "crossbuild"
import { GatewayIntentBits } from "discord.js"
import { todayIsSunday } from "./customChecks.js"

const cb = new CrossBuild({
    name: "Test Bot",
    componentPaths: ["/src/components/buttons", "/src/components/commands", "/src/components/selectMenus"],
    modules: [
        new DiscordInteractionModule({
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
    ],
    customChecks: [todayIsSunday, async (interaction: ReceivedInteraction, component: Component): Promise<GeneratedMessage | null> => {
        // check if today is sunday
        const today = new Date()
        if (today.getDay() !== 0) {
            return {
                content: `Today is not Sunday, ${interaction.user?.displayName}, so you can't use this ${component.type}!`
            }
        }
        return null
    }]
})

cb.log(`${cb}`, LogLevel.NULL)

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

sleep(3000).then(() => console.log(cb))
