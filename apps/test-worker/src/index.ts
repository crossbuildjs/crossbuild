import { CrossBuild } from "@crossbuild/core"
import { WorkerModule } from "@crossbuild/worker"

import { token } from "./env"
const workerModule = new WorkerModule({
    name: "CF Worker",
    publicKey: "96c3eaa7498c67cbdd16a3e4daa7ccafc15948ea4a2cce44ffdd3b935329303f",
    token: token
})

const crossbuild = new CrossBuild({
    name: "Test Bot",
    supportLink: "",
    modules: [workerModule]
})

import PingButton from "./components/buttons/ping"
import PingCmd from "./components/buttons/ping"
crossbuild.addComponents([new PingButton(crossbuild), new PingCmd(crossbuild)])

export default {
    async fetch(request: Request) {
        return await workerModule.handle(request)
    }
}
