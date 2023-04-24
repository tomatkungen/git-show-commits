const { spawn } = require('node:child_process');
const { argv } = require('node:process');
const fs = require('fs');

// Commands
const git_show_json = async () => {
    const git_log_users = get_arg().users.map((u) => (`\\(${u}\\)`)).join('\\|');
    const command_git_log_author = `git log -i --author="${git_log_users}" --pretty=format:"{%n \\"author\\":{ \\"date\\": \\"%ai\\", \\"name\\": \\"%an\\", \\"email\\": \\"%ae\\", \\"commit\\": \\"%s\\", \\"hash\\": \\"%h\\" } %n}" --name-status`;
    const command_cd = `cd ${get_arg().path}`;

    console.log(`${command_cd} && ${command_git_log_author}`);
    const storeData = [];

    const ls = spawn(
        `${command_cd} && ${command_git_log_author}`,
        [],
        { shell: true }
    );

    ls.stdout.on('data', (data) => {
        if (`${data}`.includes('eButton/useButton.t')) {
            console.log('data', `${data}`);
        }

        `${data}`.split('\n').forEach((d) => {
            storeData.push(d);
        });
        // console.log(`stdout: ${data}`);
    });

    ls.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    ls.on('close', (code) => {
        write_to_file(create_start_json());
        create_body_json(storeData).forEach((res) => {
            write_to_file(res, true);
        });
        write_to_file(create_end_json(), true);
        
        console.log(`Finish ${code}`);
        // console.log(`child process exited with code ${code}`);
    });
}

const create_start_json = () => {
    return '[\n';
}

const create_body_json = (lines) => {
    if (lines.length === 0) return [];

    let ary = [];
    let res = [];

    lines.forEach((line, index) => {
        if (line.includes('{') && line.includes('}')) {

            if (index !== (lines.length - 1) && index > 2) {
                res.push(`\t\t${ary.join(',\n\t\t')}\n`);
                res.push(`\t]\n`);
                res.push(`},\n`);
                ary = [];
            }

            // escape double qouates in string literal, " hej":san" " -> " hej\"an\" "
            line = line.replace(/\"\:[a-zA-Z]/g, '"');

            // escape double qouates in string literal, " hej"san" " -> " hej\"san\" "
            line = line.replace(
                /"((?:"[^"]*"|[^"])*?)"(?=[:},])(?=(?:"[^"]*"|[^"])*$)/g,
                (m, g) => (g.includes('"') ? `"${g.replace(/"/g, '\\"')}"` : m)
            );

            res.push(`{\n`);
            res.push(`\t${line.trim()},\n`);
            res.push(`\t"files": [\n`);

            return;
        }

        if (!line.includes('{') && !line.includes('}') && line.trim() !== '') {
            const fp = line.replace(/\s+/g, ' ').split(' ');

            const status = fp.shift();
            if (status.length > 4) {
                console.log('prev',lines[index - 1]);
                console.log('status', line);
            }

            const paths = `[${fp.map((f) => (`"${f}"`)).join(', ')}]`
            ary.push(`{ "status": "${status}", "paths": ${paths} }`);
        }

        if (index === lines.length - 1) {
            res.push(`\t\t${ary.join(`,\n\t\t`)}\n`);
            res.push(`\t]\n`);
            res.push(`}\n`);
        }
    });

    return res;
}

const create_end_json = () => {
    return ']\n';
}

const write_to_file = (res, append = false) => {
    if (get_arg().write === 'true') {
        try {
            append === false ?
                fs.writeFileSync('log.json', res, { append: true }) :
                fs.appendFileSync('log.json', res);
        } catch (err) {
            console.error(err);
        }
    }
}

const get_arg = () => {
    // Default argv
    const arg = {
        path: '.',
        users: ["tomat"],
        write: 'true',
    };

    argv.forEach((val) => {
        if (val.startsWith('--path=')) {
            arg.path = val.split('=')[1];
        }
        if (val.startsWith('--users=')) {
            arg.users = val.split('=')[1].split(',');
        }
        if (val.startsWith('--write=')) {
            arg.write = val.split('=')[1];
        }
    });

    return arg;
}

// Main
(async () => {
    await git_show_json();
})()
