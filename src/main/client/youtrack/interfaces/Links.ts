export interface Links {
    direction: string
    linkType: {
        name: string
    }
    issues: {
        id: string
        idReadable: string
        summary: string
    }[]
}