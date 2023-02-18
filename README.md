# Youtrack downloader

CLI-тулза для скачивания тикетов из ютрэка в JSON-файлы вместе с потрохами, включая вложения

## Первый запуск

Сразу после `$ git clone` нужно выполнить скрипт `npm run configure`, который установит зависимости, создаст необходимые каталоги и конфиги, а так же запросит хост и токен для доступа к ютрэку.

Для сборки - просто `$ npm run rebuild`

Чтобы узнать, что и как скрипт может - `$ ./build/index.js --help`

## Примеры испольования

```bash
$ ./build/index.js ./out/yt-$(date +%Y%m%d-%H%M) --project ./out/projects.list --updated 2022-09-16 # Все таски, измененные с 16 сентября из проектов, перечисленных в файле ./out/projects.list
$ ./build/index.js ./out/yt-$(date +%Y%m%d-%H%M) --project DA DO PA PO --json-only # Все таски четырех проектов без вложений
$ ./build/index.js ./out/yt-qwertyop --project QWE RTY OP --skip-existing-issues --created 2022-01-01 # Все таски трех проектов с вложениями, при этом вложения не будут скачиваться повторно для тех тасок, которые уже есть в каталоге ./out/yt-qwertyop
```

## env

```bash
$ node -v
    v16.16.0
$ npm -v
    8.16.0
$ tsc -v
    Version 4.7.4
```