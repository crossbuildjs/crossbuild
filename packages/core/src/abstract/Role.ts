export type RoleData = {
	id: string
	name: string
}

export abstract class Role {
    readonly id: string
    readonly name: string

    constructor(data: RoleData) {
        this.id = data.id
        this.name = data.name
    }
}
