import { Collection } from "@discordjs/collection"
import { CrossBuild, Paginator } from ".."

export type ModuleConfig = {
	/** An easily recognizable name for this module */
	name: string
}

export abstract class Module {
    /** A friendly name to refer to this module by */
    name: string
    config: ModuleConfig
    /** The CrossBuild client. Undefined when the module has not been loaded */
    crossbuild: CrossBuild | undefined
    paginators: Collection<string, Paginator> = new Collection()
	abstract client: unknown

	constructor(config: ModuleConfig) {
	    this.config = config
	    this.name = config.name
	}

	public init(crossbuild: CrossBuild): Promise<boolean> {
	    this.crossbuild = crossbuild
	    return this.load()
	}

	public abstract load(): Promise<boolean>
	public abstract startListening(): Promise<void>
	public abstract stopListening(): Promise<void>
	public abstract watchPaginator(paginator: Paginator): void
	public abstract unwatchPaginator(paginator: Paginator): void
}
