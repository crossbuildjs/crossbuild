export type ServerData = {
    id: string
    name?: string | null
    description?: string | null
    ownerId?: string | null
    iconURL?: string | null
}

export abstract class Server {
    readonly id: string
    readonly name: string | null
    readonly description: string | null
    readonly ownerId: string | null
    readonly iconURL: string | null

    constructor(data: ServerData) {
        this.id = data.id
        this.name = data.name || null
        this.description = data.description || null
        this.ownerId = data.ownerId || null
        this.iconURL = data.iconURL || null
    }

    abstract toString(): string
}
