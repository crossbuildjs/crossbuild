import { Message } from "../abstract/Message"

export type ClientEvents = {
    error: (error: string) => void
    warn: (message: string) => void
    debug: (message: string) => void
    /**
     * Emitted when the client is ready to start receiving payloads
     */
    ready: () => void
    /**
     * Emitted on a new message being received by the client
     * @param message The message data that was received
     */
    message: (message: Message) => void
}
