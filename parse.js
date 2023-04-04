const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
import { argv } from 'node:process';

// Const
const git_log_author = 'git log -i --author="\\(tomat\\)" --pretty=format:"{%n \\"author\\":{ \\"date\\": \\"%ai\\", \\"name\\": \\"%an\\", \\"email\\": \\"%ae\\" } %n}" --name-status';
const git_argv = get_arg();

const git_show_author = async () => {
    const { stdout, stderr, error } = await exec(git_log_author);

    if (error) {
        console.error(`exec error: ${error}`);
        return null;
    }

    if (stderr) {
        console.error(`exec stderr: ${stderr}`);
        return null;
    }

    return create_show_author_json(stdout);
}

const create_show_author_json = (gitLog) => {
    if (!gitLog) {
        return "";
    }

    const lines = gitlog.split('\n');

    console.log(lines);
}

const get_arg = () => {
    const arg = { // Default
        path: '.',
    };
    argv.forEach((val, index) => {
        console.log(`${index}: ${val}`);

        if (val.startsWith('--path=')) {
            arg.path = val.split('=')[1];
        }
    });

    return arg;
}

git_show_author();