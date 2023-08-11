import { ComponentOption, InteractionRawOptions } from "../typings/types"

export class OptionsHandler {
    public data: Record<string, unknown> = {}
    private errorData: Array<string> = []


    constructor(interactionOptions: InteractionRawOptions, componentOptions: Array<ComponentOption>) {
        componentOptions.forEach(option => {
            const optionData = interactionOptions[option.name]
            this.data[option.name] = this.parseOption(optionData, option)
        })
    }

    public get errors() {
        return this.errorData
    }

    public getString(key: string) {
        const value = this.data[key] as string | undefined
        return value
    }

    public getInteger(key: string) {
        const value = this.data[key] as number | undefined
        return value
    }

    public getNumber(key: string) {
        const value = this.data[key] as number | undefined
        return value
    }

    public getBoolean(key: string) {
        const value = this.data[key] as boolean | undefined
        return value
    }

    private parseOption(option: unknown, shouldBe: ComponentOption) {
        if (!option) {
            if (shouldBe.required) this.errorData.push(`Option ${shouldBe.name} is required!`)
            return option
        }
        switch (shouldBe.type) {
            case "string": {
                if (typeof option !== "string") return this.errorData.push(`Expected type string for ${shouldBe.name}, got ${typeof option}!}`)
                if (shouldBe.choices) {
                    if (!shouldBe.choices.some(choice => choice.value === option)) {
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
            default: {
                return this.errorData.push(`Invalid option type for ${shouldBe.name}!`)
            }
        }
    }
}