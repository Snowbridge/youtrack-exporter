import { User } from "./User"

export interface Attachment {
    author: User
    created: number
    updated: number
    name: string
    filename: string
    url: string
}

export interface AttachmentData extends Attachment {
    metaData: string
    charset: null
    extension: string
    mimeType: string
    size: number
    base64Content: string
}