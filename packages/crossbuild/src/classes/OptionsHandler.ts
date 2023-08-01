import { ComponentData } from "../index.js"

export default class InteractionOptions {
    private rawOptions: ComponentData["options"]

    constructor(options: ComponentData["options"]) {
        this.rawOptions = options
    }

    public get data() {
        return this.rawOptions
    }
}