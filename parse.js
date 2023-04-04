const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

const git_log_author = 'git log -i --author="\\(tomat\\)" --pretty=format:"{%n \\"author\\":{ \\"date\\": \\"%ai\\", \\"name\\": \\"%an\\", \\"email\\": \\"%ae\\" } %n}" --name-status';

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

    console.log(gitLog);
}

git_show_author();