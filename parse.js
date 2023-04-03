const { exec } = require('node:child_process');

const git_log_author = `git log -i --author="\(tomat\)" --pretty="{%n \"author\":{ \"date\": \"%ai\", \"name\": \"%an\", \"email\":\"%ae\" } %n}" --name-status`;

exec(git_log_author, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });