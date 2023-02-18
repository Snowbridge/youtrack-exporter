#!/usr/bin/env node

import fs from "fs"
import { YtExporter } from "./app/app"
import { FilterArgs, YoutrackQueryBuilder } from "./app/youtrack-query-builder"
import { YARGS } from "./cli/cli"

YARGS
    .parseAsync()
    .then((argv: any) => {

        fs.mkdirSync(argv.dir, { recursive: true })

        const builder = new YoutrackQueryBuilder(argv as FilterArgs)

        const app = new YtExporter(argv.host, argv.token, argv.project, builder.toString())
        if(argv.jsonOnly)
            app.setJsonOnly(true)

        app.setPauseMs(argv.pause)
        app.setSkipIssueIfExists(argv.skipExistingIssues)

        app.export(argv.dir).then(() => {
            console.log({ message: "DONE!" })
        })

    })