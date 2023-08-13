export type ServerData = {
	id: string
	name?: string
	description?: string
	ownerId?: string
	iconURL?: string
}

export abstract class Server {
    readonly id: string
    readonly name?: string
    readonly description?: string
    readonly ownerId?: string
    readonly iconURL?: string

    constructor(data: ServerData) {
        this.id = data.id
        this.name = data.name
        this.description = data.description
        this.ownerId = data.ownerId
        this.iconURL = data.iconURL
    }
}
