import { Attachment } from "./Attachment"
import { Links } from "./Links"
import { Tags } from "./Tags"
import { User } from "./User"

export interface Issue {
    id: string
    idReadable: string
    project: {
        id: string
        description: string
        shortName: string
        team: {
            id: string
            name: string
        }
    }
    reporter: User
    updater: User
    created: number | null
    updated: number | null
    resolved: number | null
    summary: string
    description: string
    commentsCount: number
    comments: Comment[]
    links: Links[]    
    tags: Tags[]
    customFields: any[]
    attachments: Attachment[]
}