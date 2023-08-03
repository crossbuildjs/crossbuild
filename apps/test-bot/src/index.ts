import { CrossBuild, LogLevel } from "crossbuild"

const cb = new CrossBuild({
    name: "Test Bot",
    componentPaths: ["/src/components/buttons", "/src/components/commands"],
    discordOptions: {
        intents: ["Guilds", "GuildMessages", "MessageContent"]
    },
    guildedOptions: {
        token: process.env.GUILDED_TOKEN!
    },
    supportServer: "",
    discordToken: process.env.DISCORD_TOKEN,
    prefix: "-"
})

cb.log(`${cb}`, LogLevel.NULL)

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// sleep(3000).then(() => console.log(cb))
