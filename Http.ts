import { Router } from "itty-router"
import { CrossBuild } from "./packages/core/src"
import { isValidRequest, PlatformAlgorithm } from "discord-verify"
import { APIInteraction } from "discord.js"

export default class HTTPListener {
    client: CrossBuild
    router = Router()

    constructor(client: CrossBuild) {
        this.client = client

        this.router.post("/interaction", (request: Request) => {
            return this.interaction(request)
        })

        this.router.all("*", () => {
            return new Response("Not found", {
                status: 404
            })
        })
    }

    /**
	 * The handler that is exposed to the worker.
	 * @example
	 * ```js
	 * addEventListener("fetch", (event) => {
	 *     event.respondWith(crossbuild.httpListener.handle(event.request))
	 * })
	 * ```
	 */
    public async handle(request: Request) {
        if (!this.client.config.httpOptions) return new Response("No http options provided", { status: 500 })
        if (request.method === "POST" && request.url.includes("/interaction")) {
            const isValid = await isValidRequest(request, this.client.config.httpOptions.publicKey, PlatformAlgorithm.Cloudflare)
            if (!isValid) {
                return new Response("Invalid request signature", { status: 401 })
            }
        }
        return this.router.handle(request)
    }

    private async interaction(request: Request) {
        const reqData = (await request.json()) as APIInteraction
        console.log(reqData)
        return new Response("Hello world!", {
            status: 200
        })
    }
}
