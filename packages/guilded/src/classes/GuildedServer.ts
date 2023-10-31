import { Server } from "@crossbuild/core"
import { Server as GJSServer } from "guilded.js"

export class GuildedServer extends Server {
	constructor(server: GJSServer) {
		super({
			id: server.id,
			name: server.name,
			description: server.description,
			ownerId: server.ownerId,
			iconURL: server.iconURL
		})
	}

	toString(): string {
		return JSON.parse(
			JSON.stringify(this, (_, value) => {
				return value
			})
		)
	}
}
