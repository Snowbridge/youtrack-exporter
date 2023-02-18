import { Attachment } from "./Attachment"
import { User } from "./User"

export interface Comment {
    text: string
    created: number
    updated: number | null
    author: User
    attachments: Attachment[]
}