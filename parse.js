const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
const { argv } = require('node:process');
const fs = require('fs');

// Commands
const git_show_json = async () => {
    const git_log_users = get_arg().users.map((u) => (`\\(${u}\\)`)).join('\\|');
    const command_git_log_author = `git log -i --author="${git_log_users}" --pretty=format:"{%n \\"author\\":{ \\"date\\": \\"%ai\\", \\"name\\": \\"%an\\", \\"email\\": \\"%ae\\" } %n}" --name-status`;
    const command_cd = `cd ${get_arg().path}`;

    const { stdout, stderr, error } = await exec(`${command_cd} && ${command_git_log_author}`);

    if (has_error(error, stderr))
        return;

    return create_show_author_json(stdout);
}

const has_error = (error, stderr) => {
    if (error) { console.error(`exec error: ${error}`); return true; }
    if (stderr) { console.error(`exec stderr: ${stderr}`); return true; }

    return false;
}

const create_show_author_json = (gitLog) => {
    if (!gitLog) return "";

    const lines = gitLog.split('\n');
    /** Example
        {
            "author":{ "date": "2023-04-04 21:18:03 +0200", "name": "Tomatkungen", "email": "mr_a2@hotmail.com" }
        }
        M	parse.js
     */

    let ary = [];
    let res = '[\n';
    // console.log(gitLog);

    lines.forEach((line, index) => {

        if (line.includes('{') && line.includes('}')) {

            if (index !== (lines.length - 1) && index > 2) {
                res += `\t\t${ary.join(',')}\n`;
                res += `\t]\n`;
                res += `},\n`;
                ary = [];
            }

            res += `{\n`;
            res += `\t${line.trim()},\n`;
            res += `\t"file": [\n`;

            return;
        }

        if (!line.includes('{') && !line.includes('}') && line.trim() !== '') {
            const fp = line.replace(/\s+/g, ' ').split(' ');
            ary.push(`{ "status": "${fp[0]}", "path": "${fp[1]}" }`);
        }

        if (index === lines.length - 1) {
            res += `\t\t${ary.join(',')}\n`;
            res += `\t]\n`;
            res += `}\n`;
        }
    });
    res += ']\n';

    if (get_arg().write === 'true') {
        try {
            fs.writeFileSync('log.json', res);
        } catch (err) {
            console.error(err);
        }
    }

    console.log(res);
}

const get_arg = () => {
    const arg = { // Default
        path: '.',
        users: ["tomat"],
        write: 'true',
    };

    argv.forEach((val, index) => {
        // console.log(`${index}: ${val}`);

        if (val.startsWith('--path=')) {
            arg.path = val.split('=')[1];
        }
        if (val.startsWith('--users=')) {
            arg.users = val.split('=')[1].split(',');
        }
        if (val.startsWith('--file=')) {
            arg.write = val.split('=')[1];
        }
    });

    return arg;
}

(async () => {
    await git_show_json();
})()
