import { AxiosRequestConfig } from "axios";
import { Readable } from "stream";
import { BaseAxiosClient } from "../base-client";
import { ATTACHMENTS_QUERY_FIELDS, ISSUE_QUERY_FIELDS } from "./constants";
import { AttachmentData } from "./interfaces/Attachment";
import { Issue } from "./interfaces/Issue";

export class YoutrackClient extends BaseAxiosClient {


    constructor(host: string, token: string, config?: AxiosRequestConfig) {
        super(Object.assign(
            {},
            {
                baseURL: host,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                    'Authorization': `Bearer ${token}`
                }
            },
            config)
        )
    }

    async getIssues(project: string, filter?: string): Promise<Issue[]> {
        const { data } = await this.get<Issue[]>('/api/issues', {
            params: {
                fields: ISSUE_QUERY_FIELDS.join(','),
                query: `project: {${project}} ${filter || ''} sort by: {issue id} asc`
            }
        })
        return data
    }

    async getAttachments(issueID:string): Promise<AttachmentData[]>{
        const {data} = await this.get<AttachmentData[]>(`/api/issues/${issueID}/attachments`,{
            params:{
                fields: ATTACHMENTS_QUERY_FIELDS.join(',')
            }
        })
        return data
    }

    async getFileStream(url: string): Promise<Readable> {
        const transform = this.defaults.transformResponse
        this.defaults.transformResponse = undefined
        const { data } = await this.get<Readable>(url, {
            responseType: 'stream'
        })
        this.defaults.transformResponse = transform
        return data
    }
}