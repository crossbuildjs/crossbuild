import { TimestampStylesString } from "discord.js"

/**
 * Generate a unix timestamp for Discord to be rendered locally per user.
 * @param options - The options to use for the timestamp.
 * @returns The generated timestamp.
 */
export const generateTimestamp = (options?: GenerateTimestampOptions): string => {
    let timestamp = options?.timestamp || new Date()
    const type = options?.type || "f"
    if (timestamp instanceof Date) timestamp = timestamp.getTime()
    return `<t:${Math.floor(timestamp / 1000)}:${type}>`
}

/**
 * The options to use for the timestamp.
 * @example {"timestamp": 1620000000000, "type": "f"}
 */
export interface GenerateTimestampOptions {
	timestamp?: Date | number
	type?: TimestampStylesString
}
