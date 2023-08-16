import { ComponentOption } from "../typings/types"
import { Channel, ReceivedInteraction, Role, User } from ".."

export abstract class OptionsHandler {
    public data: Record<string, unknown> = {}
    private errorData: Array<string> = []

    constructor(interaction: ReceivedInteraction, componentOptions: Array<ComponentOption>) {
        if (interaction.rawOptions) {
            const rawOptions = interaction.rawOptions // stupid foreach: https://stackoverflow.com/a/61468316/12586914
            componentOptions.forEach((option) => {
                const optionData = rawOptions[option.name]
                this.data[option.name] = this.parseOption(optionData, option)
            })
        }
    }

    public get errors() {
        return this.errorData
    }

    public getString(key: string): string | undefined {
        const value = this.data[key]
        if (typeof value !== "string") return undefined
        return value
    }

    public getInteger(key: string): number | undefined {
        const value = this.data[key]
        if (typeof value !== "number") return undefined
        if (!Number.isSafeInteger(value)) return undefined
        return value
    }

    public getNumber(key: string): number | undefined {
        const value = this.data[key]
        if (typeof value !== "number") return undefined
        return value
    }

    public getBoolean(key: string): boolean | undefined {
        const value = this.data[key]
        if (typeof value !== "boolean") return undefined
        return value
    }

	abstract getUser(key: string): Promise<User | undefined>
	abstract getChannel(key: string): Promise<Channel | undefined>
	abstract getRole(key: string): Promise<Role | undefined>

	private parseOption(option: unknown, shouldBe: ComponentOption) {
	    if (!option) {
	        if (shouldBe.required) this.errorData.push(`Option ${shouldBe.name} is required!`)
	        return option
	    }
	    switch (shouldBe.type) {
	        case "string": {
	            if (typeof option !== "string") return this.errorData.push(`Expected type string for ${shouldBe.name}, got ${typeof option}!}`)
	            if (shouldBe.choices) {
	                if (!shouldBe.choices.some((choice) => choice.value === option)) {
	                    return this.errorData.push(`Invalid option value for ${shouldBe.name}!`)
	                }
	            }
	            if (shouldBe.minLength) {
	                if (option.length < shouldBe.minLength) {
	                    return this.errorData.push(`Option ${shouldBe.name} must be at least ${shouldBe.minLength} characters long!`)
	                }
	            }
	            if (shouldBe.maxLength) {
	                if (option.length > shouldBe.maxLength) {
	                    return this.errorData.push(`Option ${shouldBe.name} must be at most ${shouldBe.maxLength} characters long!`)
	                }
	            }
	            return option
	        }
	        case "integer": {
	            if (typeof option !== "number") return this.errorData.push(`Expected type integer for ${shouldBe.name}, got ${typeof option}!`)
	            if (!Number.isSafeInteger(option)) return this.errorData.push(`Expected a valid integer for ${shouldBe.name}, got ${option}!`)
	            if (shouldBe.minValue) {
	                if (option < shouldBe.minValue) {
	                    return this.errorData.push(`Option ${shouldBe.name} must be at least ${shouldBe.minValue}!`)
	                }
	            }
	            if (shouldBe.maxValue) {
	                if (option > shouldBe.maxValue) {
	                    return this.errorData.push(`Option ${shouldBe.name} must be at most ${shouldBe.maxValue}!`)
	                }
	            }
	            return option
	        }
	        case "number": {
	            if (typeof option !== "number") return this.errorData.push(`Expected type number for ${shouldBe.name}, got ${typeof option}!`)
	            if (shouldBe.minValue) {
	                if (option < shouldBe.minValue) {
	                    return this.errorData.push(`Option ${shouldBe.name} must be at least ${shouldBe.minValue}!`)
	                }
	            }
	            if (shouldBe.maxValue) {
	                if (option > shouldBe.maxValue) {
	                    return this.errorData.push(`Option ${shouldBe.name} must be at most ${shouldBe.maxValue}!`)
	                }
	            }
	            return option
	        }
	        case "boolean": {
	            if (typeof option !== "boolean") return this.errorData.push(`Expected type boolean for ${shouldBe.name}, got ${typeof option}!`)
	            return option
	        }
	        case "user":
	        case "channel":
	        case "role":
	            if (typeof option !== "string") return this.errorData.push(`Expected type string for ${shouldBe.name}, got ${typeof option}!`)
	        default: {
	            return this.errorData.push(`Invalid option type for ${shouldBe.name}!`)
	        }
	    }
	}
}
