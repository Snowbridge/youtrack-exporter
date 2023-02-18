import { Axios, AxiosRequestConfig } from "axios"

export class BaseAxiosClient extends Axios{

    constructor(config?: AxiosRequestConfig) {
        super(config)

        if (!this.defaults.transformResponse)
            this.defaults.transformResponse = [this.transformResponse]

        if (!this.defaults.transformRequest)
            this.defaults.transformRequest = [this.transformRequest]

        if (!this.defaults.validateStatus)
            this.defaults.validateStatus = (status) => {
                return status < 400
            }

    }

    private transformResponse(data: any): any {
        try {
            if (data)
                return JSON.parse(data)
        } catch (e) {
            console.warn({ message: "Unexpected response data format", data: data, error: e })
        }
        return data
    }

    private transformRequest(data: any): any {
        if (data && "object" == typeof data)
            return JSON.stringify(data)
        return data
    }

}

export function isHttpCode2xx(code: number): boolean {
    return code >= 200 && code < 300
}

export function isHttpCode4xx(code: number): boolean {
    return code >= 400 && code < 500
}