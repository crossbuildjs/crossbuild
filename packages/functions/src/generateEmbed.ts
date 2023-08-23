import { GeneratedMessage, SimpleEmbed } from "@crossbuild/types"
import { APIActionRowComponent, APIMessageActionRowComponent, ButtonStyle, ComponentType } from "discord-api-types/v10"

/**
 * Generate a message with the specified type (error, success, or warning).
 * @param type - The type of the message: 'error', 'success', or 'warning'.
 * @param embedInfo - The information to build our embed with.
 * @param components - The components for our message.
 * @param ephemeral - Whether our message should be ephemeral or not.
 * @param supportLink - Whether or not to add the support server link as a component (for error messages only).
 * @returns The generated message.
 */
export const generateEmbed = (
    type: "error" | "success" | "warning",
    embedInfo: SimpleEmbed,
    components?: APIActionRowComponent<APIMessageActionRowComponent>[],
    silent = false,
    supportLink: string | undefined = undefined
): GeneratedMessage => {
    let color: number
    switch (type) {
        case "error":
            color = 0xed4245
            break
        case "success":
            color = 0x57f287
            break
        case "warning":
            color = 0xfee75c
            break
        default:
            throw new Error(`Invalid message type: ${type}`)
    }

    const message: GeneratedMessage = {
        embeds: [{ ...embedInfo, color }],
        silent,
        components
    }

    if (type === "error" && supportLink) {
        message.components?.push({
            type: ComponentType.ActionRow,
            components: [
                {
                    type: ComponentType.Button,
                    label: "Support Server",
                    url: supportLink,
                    style: ButtonStyle.Link
                }
            ]
        })
    }

    return message
}
