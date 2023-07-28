/**
 * Generate a formatted list of items for Discord using emojis
 * @param items - An array of strings to format
 * @param useEmojiForFirstLine - Whether the first line should have an list starting emoji (true) or be left blank to use as the title (false)
 * @note These emojis are from Buape's servers. They should work fine in interaction responses, but may not show for non-Buape bots in regular messages.
 * @returns
 */
export const emojiList = (items: string[], useEmojiForFirstLine = false) => {
    const emoji = (i: number) => {
        if (i === 0) return useEmojiForFirstLine ? "<:replystart:1086124722036678686>" : ""
        if (i === items.length - 1) return "<:reply:1086124425751052458>"
        return "<:replycont:1086124397766651954>"
    }
    return items
        .map((x, i) => `${emoji(i)} ${x}`)
        .join("\n")
        .trim()
}
