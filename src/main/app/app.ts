import fs from "fs"
import { YoutrackClient } from "../client/youtrack/client"

type QueueElement = { project: string; attempt: number }

export class YtExporter {

    private host: string
    private token: string
    private projects: string[]
    private filterString: string
    private jsonOnly = false
    private pauseMs = 0
    private skipExistingIssues = false

    constructor(host: string, token: string, projects: string[], filterString: string) {
        this.host = host
        this.token = token
        this.projects = projects
        this.filterString = filterString
    }

    async export(dir: string) {

        const projectsQueue = this.projects.map(it => { return { project: it, attempt: 1 } as QueueElement })

        while (projectsQueue.length) {
            const queueElement = projectsQueue.shift() as QueueElement
            const project = queueElement.project

            const projectDir = `${dir}/${project}`
            const client = new YoutrackClient(this.host, this.token)

            try {
                console.log(`Processing project ${project}, attempt: ${queueElement.attempt}`)
                const issues = await client.getIssues(project, this.filterString)
                console.log(`Got ${issues.length} issue${issues.length == 1 ? 's' : ''}`);

                if (issues.length == 0)
                    continue // если нет задач, но и папку создавать не будем

                fs.mkdirSync(projectDir, { recursive: true })

                fs.writeFileSync(`${projectDir}/issues.json`, JSON.stringify(issues))

                if(this.jsonOnly)
                    continue

                for (const issue of issues) {

                    const attachmentsFile = `${projectDir}/${issue.idReadable}.json`
                    if (fs.existsSync(attachmentsFile)) {
                        if (this.skipExistingIssues)
                            continue
                        else
                            fs.rmSync(attachmentsFile, { recursive: true, force: true })
                    }

                    if (!issue.attachments.length)
                            continue
                    
                    const data = await (new YoutrackClient(this.host, this.token)).getAttachments(issue.id)
                    fs.writeFileSync(attachmentsFile, JSON.stringify(data))

                }

            } catch (error: any) {
                console.error(`[${project}]#${queueElement.attempt} - [${error.message || error}]`)
                queueElement.attempt++
                projectsQueue.push(queueElement)
            }

            if (this.pauseMs)
                await new Promise(resolve => setTimeout(resolve, this.pauseMs * queueElement.attempt))
        }
    }

    setJsonOnly(b: boolean) {
        this.jsonOnly = b
    }

    setPauseMs(ms: number) {
        this.pauseMs = ms
    }

    setSkipIssueIfExists(s: boolean) {
        this.skipExistingIssues = s
    }
}