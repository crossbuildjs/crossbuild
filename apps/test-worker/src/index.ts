import { CrossBuild, LogLevel } from "../../../packages/core/dist"

const cb = new CrossBuild({
    name: "Test Bot",
    componentPaths: ["/src/components/buttons", "/src/components/commands", "/src/components/selectMenus"],
    supportLink: "",
    prefix: "-",
    httpOptions: {
        publicKey: "96c3eaa7498c67cbdd16a3e4daa7ccafc15948ea4a2cce44ffdd3b935329303f"
    }
})

cb.log(`${cb}`, LogLevel.INFO)

export default {
    async fetch(request: Request) {
        return await cb.httpListener!.handle(request)
    }
}

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// sleep(3000).then(() => console.log(cb))
