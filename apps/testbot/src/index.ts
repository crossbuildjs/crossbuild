import { Crossbuild, LogLevel } from "crossbuild"

const cb = new Crossbuild({
    name: "Test Bot",
    componentPaths: ["/src/components"],
    discordOptions: {
        intents: []
    },
    guildedOptions: {
        token: ""
    },
    supportServer: "",
    discordToken: process.env.DISCORD_TOKEN
})

cb.log(`${cb}`, LogLevel.NULL)

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// sleep(3000).then(() => console.log(cb))
