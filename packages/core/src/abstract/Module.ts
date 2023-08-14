import { CrossBuild, ModulePaginator } from ".."

export type ModuleConfig = {
	/** An easily recognizable name for this module */
	name: string
}

export abstract class Module {
	/** The ID for CrossBuild to store this module as */
	abstract key: string
	/** An easily recognizable name for this module */
	name: string
	config: ModuleConfig
	/** The CrossBuild client. Undefined when the module has not been loaded */
	crossbuild: CrossBuild | undefined
	abstract modulePaginator: ModulePaginator
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
}
