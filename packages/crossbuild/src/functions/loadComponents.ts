import path from "path"
import { getFiles } from "./getFiles"
import { Component, CrossBuild } from "@crossbuild/core"

/**
 * Load components from a directory to be passed to CrossBuild
 * @param componentPaths - The paths to the components.
 */
export const getComponents = async (componentPaths: string[], crossbuild: CrossBuild) => {
    const __dirname = `${path.resolve()}/dist`
    const components: Array<Component> = []
    await Promise.all(
        componentPaths.map(async (dirPath) => {
            try {
                const typePath = path.join(__dirname, dirPath)
                const files = getFiles(typePath, "js", true)

                for (const fileName of files) {
                    const filePath = path.join(typePath, fileName)
                    const fileUrl = `file://${filePath.replace(/\\/g, "/")}`
                    const file = await import(fileUrl)
                    const component = new file.default(crossbuild) as Component
                    components.push(component)
                }
            } catch (error) {
                console.debug(`${error}`)
                console.warn(`Failed to load files under ${dirPath}. Make sure you are only giving a subdirectory from ${__dirname}`)
            }
        })
    )
    return components
}
