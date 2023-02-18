const typeUser = "login,fullName,email"
const typeAttachment = `name,author(${typeUser}),created,updated,url,filename`
const typeUserGroup = `id,name`
const typeProject = `id,shortName,description,team(${typeUserGroup})`
const typeIssueTag = `name,owner(${typeUser})`
const typeIssueLink = `direction,linkType(name,localizedName),issues(id,idReadable,summary)`

export const ISSUE_QUERY_FIELDS = [
       "id",
        "idReadable",
        "created",
        "updated",
        "resolved",
        `project(${typeProject})`,
        "summary",
        "description",
        `reporter(${typeUser})`,
        `updater(${typeUser})`,
        `comments(text,created,updated,author(${typeUser}),attachments(${typeAttachment}))`,
        "commentsCount",
        `tags(${typeIssueTag})`,
        `links(${typeIssueLink})`,
        "customFields(id,name,value(name,presentation))",
        `attachments(name, size)`,
        `subtasks(${typeIssueLink})`,
        `parent(${typeIssueLink})`
    ]

export const ATTACHMENTS_QUERY_FIELDS = [
    typeAttachment,
    'size',
    'mimeType',
    'extension',
    'charset',
    'metaData',
    'base64Content'
]