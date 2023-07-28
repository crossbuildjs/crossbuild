import { Crossbuild } from "crossbuild"

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
    discordToken: "MTA4NjEwNTYxMDUxMDE1NTg1Nw.GNt-U8.OSHy-g-5FlfESnu3Z9MEEMJLHiRthXajiXNwiE"
})

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

sleep(3000).then(() => console.log(cb))
