/**
 * Generate a random integer.
 * This function *is* inclusive of both the min and max numbers
 * @param min - The minimum number to generate
 * @param max - The maximum number to generate
 * @returns The random integer
 */
export const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
