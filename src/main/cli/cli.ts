import yargs from 'yargs/yargs';
import 'dotenv/config';
import * as fs from 'fs';

export const YARGS = yargs(process.argv.slice(2))
    .command('$0 <dir>', 'Выгрузить выгрузить таски из ютрэка в указанную директорию', (yargs) => {
        yargs.positional('dir', {
            type: 'string',
            desc: 'Каталог, в который выгрузить таски. Если не существует, то будет создан.',
            demandOption: true
        })
    })
    .options({
        project: {
            type: 'string',
            desc: [
                'Имена проектов, задачи которых нужно выкачать.',
                'Имя - это id в настройках проекта, оно же - префикс задач',
                'можно передать имя существующего файла, в котором одна строка - один проект'
            ].join('\n\t'),
            array: true,
            demandOption: true,
            coerce: (projects: string[]) => {

                const filename = projects[0]
                if (fs.existsSync(filename)) {
                    projects = fs.readFileSync(filename)
                        .toString()
                        .split('\n')
                        .map(it => it.trim())
                        .filter(it => it.length > 0)
                }

                if (projects.length == 0)
                    throw Error("Не указан ни один проект")

                return projects
            }
        },
        updated: {
            desc: 'Только таски, измененные и созданные не позднее этой даты',
            type: 'string',
            coerce: coerceDate
        },
        created: {
            desc: 'Только таски, созданные не позднее этой даты',
            type: 'string',
            coerce: coerceDate
        },
        issues: {
            desc: 'Только перечисленные в этом параметре таски',
            type: 'string',
            array: true,
        },
        tags: {
            desc: [
                'Только таски, помеченные хотя бы обним тэгом',
                'NB! Теги суммируются по ИЛИ, а не по И'
            ].join('\n\t'),
            type: 'string',
            array: true,
        },
        host: {
            type: 'string',
            default: process.env.HOST,
            demandOption: true,
            desc: 'дефолт берется из process.env.HOST',
            hidden: true,
        },
        token: {
            type: 'string',
            default: process.env.TOKEN,
            defaultDescription: !process.env.TOKEN ? 'undefined' : escapeToken(process.env.TOKEN),
            desc: 'дефолт берется из process.env.TOKEN',
            hidden: true,
        },
        'json-only': {
            type: 'boolean',
            default: false,
            describe: 'Если true, то вложения выгруцжаться не будут'
        },
        'pause': {
            type: 'number',
            desc: 'Пауза между проектами в милисекундах. Это значение умножается на номер текущей попытки так что с каждым ретраем будем ждать все дольше (на случай защиты от DDOSов)',
            default: 0
        },
        'skip-existing-issues':{
            desc:'Не скачивать вложения, если файл с вложениями уже существует'
        }
    })
    .epilog([
        '○ Для всех параметров-массивов допустим префикс значения "-", он означает "кроме".',
        'Например, "--tag FOO BAR -BUZZ" будет означать "все, помеченные FOO или BAR, но без BUZZ".',
        'Для параметров project и issue это никакого смысла не имеет, но ничего не сломает',
        '○ Все даты - в формате ISO-string и время не учитывается, пример правильной даты: "2022-09-15"',
    ].join('\n'))
    .example('./build/index.js ./out/yt-$(date +%y%m%d-%H%M) --project MNT TRKGR --issues TRKGR-119 TRKGR-1 TRKGR-42 MNT-162 MNT-105 MNT-49', 'Экпортнёт шесть конкретных задач из двух проектов')
    .example('./build/index.js ./out/yt-$(date +%y%m%d-%H%M) --project ORG --updated 2022-09-10', 'Выгрузит все задачи проекта ORG, измененные с 0:00:00 2022-09-10')
    .example('./build/index.js ./out/yt-$(date +%y%m%d-%H%M) --project * --updated 2022-09-10', 'Выгрузит все задачи проекта ORG, измененные с 0:00:00 2022-09-10')
    .example('./build/index.js ./out/yt-$(date +%Y%m%d-%H%M) --project ./out/projects.list --updated 2022-09-16', 'Все таски, измененные с 16 сентября из проектов, перечисленных в файле ./out/projects.list')
    .strict()
    .wrap(100)
    .hide('version')
    .hide('help')
    .scriptName("ytexport")

function escapeToken(token: string, left = 3, right = 2): string {
    if (token.length < left + right)
        return token[0] + new Array(token.length).join('*');
    const regex = new RegExp(`^(.{${left},${left}}).*(.{${right},${right}})$`, 'ig');
    return token.replace(regex, `$1${new Array(token.length - left - right + 1).join('*')}$2`);
}

function coerceDate(date: Date) {
    try {
        return new Date(date)
    } catch (e) {
        throw Error("Не корректный формат даты")
    }
}