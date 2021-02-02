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
      message: 'Commit message (optional):\n',
    },
    {
      type: 'input',
      name: 'issues',
      message: 'Jira Issue ID(s):\n',
    },
    {
      type: 'input',
      name: 'time',
      message: 'Time spent (in hours):\n',
      validate: function (input) {
        if (input) {
          if (Number.isInteger(parseInt(input))) {
            return true;
          } else {
            return 'Please only insert the number of hours (integer)';
          }
        } else {
          return true;
        }
      }
    },
    {
      type: 'input',
      name: 'comment',
      message: 'Jira comment (optional):\n'
    },
    {
      type: 'confirm',
      name: 'wbso',
      message: 'WBSO billable?\n',
      default: false
    },
    {
      type: 'input',
      name: 'peer',
      message: 'Peer programmers:\n'
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
      type: 'confirm',
      name: 'confirm',
      message: 'Confirm and commit? \n',
      default: false
    },
  ]).then((answers) => {
    formatCommit(commit, answers);
  });
}

function formatCommit(commit, answers) {
  if (answers.confirm) {
    let head = filter([
      answers.issues,
      answers.subject,
      answers.workflow ? '#' + answers.workflow : undefined,
      answers.time ? '#time ' + answers.time.trim() + 'h' : undefined,
      answers.comment ? '#comment ' + answers.comment : undefined,
    ]).join(' ');
    let body = filter([
      answers.message ? answers.message : undefined,
      answers.wbso ? '#wbso yes' : '#wbso no',
      answers.peer ? '#peer ' + answers.peer : undefined,
    ]).join('\n');
    commit(head + '\n\n' + body);
  }
  else {
    console.log("Commit cancelled.\n");
  }
}

function filter(array) {
  return array.filter(function(item) {
    return !!item;
  });
}
