var inquirer = require('inquirer')

// This can be any kind of SystemJS compatible module.
// We use Commonjs here, but ES6 or AMD would do just
// fine.
module.exports = {
  prompter: prompter,
  formatCommit: formatCommit
};

// When a user runs `git cz`, prompter will
// be executed. We pass you cz, which currently
// is just an instance of inquirer.js. Using
// this you can ask questions and get answers.
//
// The commit callback should be executed when
// you're ready to send back a commit template
// to git.
//
// By default, we'll de-indent your commit
// template and will keep empty lines.
function prompter(cz, commit) {

  // Let's ask some questions of the user
  // so that we can populate our commit
  // template.
  //
  // See inquirer.js docs for specifics.
  // You can also opt to use another input
  // collection library if you prefer.
  inquirer.prompt([
    {
      type: 'input',
      name: 'subject',
      message: 'Commit subject (required):\n',
      validate: function(input) {
        if (!input) {
          return 'Empty subject';
        } else {
          return true;
        }
      }
    },
    {
      type: 'input',
      name: 'message',
      message: 'Commit message:\n',
    },
    {
      type: 'input',
      name: 'issues',
      message: 'Jira Issue ID(s) (required):\n',
      validate: function(input) {
        if (!input) {
          return 'Must specify issue IDs, otherwise, just use a normal commit message';
        } else {
          return true;
        }
      }
    },
    {
      type: 'input',
      name: 'workflow',
      message: 'Workflow command (testing, closed, etc.) (optional):\n',
      validate: function(input) {
        if (input && input.indexOf(' ') !== -1) {
          return 'Workflows cannot have spaces in smart commits. If your workflow name has a space, use a dash (-)';
        } else {
          return true;
        }
      }
    },
    {
      type: 'input',
      name: 'time',
      message: 'Time spent (i.e. 3h 15m) (optional):\n'
    },
    {
      type: 'input',
      name: 'comment',
      message: 'Jira comment (optional):\n'
    },
    {
      type: 'input',
      name: 'wbso',
      message: 'WBSO billable (y/n):\n',
      validate: function (input) {
        if (input && !(input === 'y' || input === 'n')) {
          return 'Enter y or n';
        } else {
          return true;
        }
      }
    },
    {
      type: 'input',
      name: 'peer',
      message: 'Peer programmers:\n'
    },
  ]).then((answers) => {
    formatCommit(commit, answers);
  });
}

function formatCommit(commit, answers) {
  let head = filter([
    answers.issues,
    answers.message,
    answers.workflow ? '#' + answers.workflow : undefined,
  ]).join(' ');
  let body = filter([
    answers.subject ? answers.subject : undefined,
    answers.time ? '#time ' + answers.time : undefined,
    answers.wbso ? '#wbso ' + answers.wbso : undefined,
    answers.peer ? '#peer ' + answers.peer : undefined,
    answers.comment ? '#comment ' + answers.comment : undefined,
  ]).join('\n');
  commit(head + '\n\n' + body);
}

function filter(array) {
  return array.filter(function(item) {
    return !!item;
  });
}
