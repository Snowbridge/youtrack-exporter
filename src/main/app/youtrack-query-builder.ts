export class YoutrackQueryBuilder {
    private queryStrings: string[]

    constructor(args: FilterArgs) {
        this.queryStrings = [];

        if (args.issues) this.issues(args.issues)
        if (args.tags) this.tags(args.tags)

        if (args.updated) this.updatedSince(args.updated)
        if (args.created) this.createdSince(args.created)

    }

    private pushElement(element: string) {
        this.queryStrings.push(element)
    }

    private pushParameter(parameter: string, value: string | string[]) {
        const values = Array.isArray(value) ? value.join(', ') : value
        this.queryStrings.push(`${parameter}: ${values}`)
    }

    private serializeDate(date: Date) {
        const mon = `${date.getMonth() + 1}`.padStart(2, "0")
        const day = `${date.getDate()}`.padStart(2, "0")
        return `${date.getFullYear()}-${mon}-${day}`
    }

    toString() {
        return this.queryStrings.join(' ')
    }

    issues(issues: string[]) {
        this.pushParameter('issue id', issues)
        return this
    }

    updatedSince(updated: Date) {
        this.pushElement(`updated: ${this.serializeDate(updated)} .. *`)
        return this
    }

    createdSince(created: Date) {
        this.pushElement(`updated: ${this.serializeDate(created)} .. *`)
        return this
    }

    tags(tags: string[]) {
        this.pushParameter('tag', tags)
        return this
    }

}

export type FilterArgs = {
    updated?: Date
    created?: Date
    issues?: string[]
    tags?: string[]
}