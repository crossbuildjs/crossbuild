import { Request } from "@cloudflare/workers-types"
import { CrossBuild } from "@crossbuild/core"
import { WorkerModule } from "@crossbuild/worker"

const workerModule = new WorkerModule({
    name: "CF Worker",
    publicKey: "96c3eaa7498c67cbdd16a3e4daa7ccafc15948ea4a2cce44ffdd3b935329303f",
    token: process.env.DISCORD_TOKEN!
})

new CrossBuild({
    name: "Test Bot",
    componentPaths: ["/src/components/buttons", "/src/components/commands", "/src/components/selectMenus"],
    supportLink: "",
    modules: [workerModule]
})

export default {
    async fetch(request: Request) {
        return await workerModule.handle(request)
    }
}
