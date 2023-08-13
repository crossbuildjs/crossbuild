import { Response, ResponseInit } from "@cloudflare/workers-types"

export class JsonResponse extends Response {
    constructor(body?: unknown, init?: ResponseInit) {
        const jsonBody = JSON.stringify(body)
        init = init || {
            headers: {
                "content-type": "application/json;charset=UTF-8"
            }
        }
        super(jsonBody, init)
    }
}
