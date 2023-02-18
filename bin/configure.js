#!/usr/bin/env node

/* eslint-disable  */

const exec = require('child_process').exec;
const fs = require('fs');

(async () => {
    let output = await execCommand('npm install');
    console.log(output.stdout);

    fs.mkdirSync('./out', {recursive:true})

    const host = await queryString('Enter youtrack host: ')
    const token = await queryString('Enter youtrack access token: ')

    fs.writeFileSync('.env',`HOST=${host}\nTOKEN=${token}`)

    output = await execCommand('npm run rebuild');
    console.log(output.stdout);


})();

async function execCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                return reject({ stderr: stderr });
            }
            return resolve({ stdout: stdout })
        });
    })
}

async function queryString(question) {
    return new Promise((resolve) => {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question(question, (answer) => {
            readline.close();
            resolve(answer)
        });
    })
}



