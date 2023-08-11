import { RequestInit, fetch } from "undici"

/**
 * Upload content to the hastebin we use.
 * @param content - The content to upload.
 * @param type - The file type to append to the end of the haste.
 * @param userAgent - The user agent to use.
 * @param url - A non-standard url to upload to
 * @returns The URL to the uploaded content.
 */
export const uploadHaste = async (content: string, userAgent: string, type = "md", url = "https://hst.sh"): Promise<string | null> => {
    const postUrl = `${url}/documents`
    const options: RequestInit = {
        method: "POST",
        body: content,
        headers: {
            "User-Agent": userAgent
        }
    }
    const res = await fetch(postUrl, options)

    if (!res.ok) {
        throw new Error("Failed to upload haste")
    }
    const data = (await res.json()) as { key: string }
    return `${url}/${data.key}.${type}`
}
