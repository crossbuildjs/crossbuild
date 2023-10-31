/**
 * Format a string to title case.
 * @param string The string to format
 * @returns The formatted string
 * @example
 * ```ts
 * titleCase("hello_world") // "Hello world"
 * ```
 */
export const titleCase = (string: string): string => {
    return string
        .replace(/[-_]/g, " ")
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}
