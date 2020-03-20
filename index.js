#!/usr/bin/env node
const cliui = require('cliui');
const chalk = require('chalk');
const { getArgv, execSync, getCurBranch } = require('./utils');
let config = require('./config');

config = Object.assign(config, getArgv());

const app = async () => {
  let since = config['--since'];
  let before = config['--before'];
  let lint = config['--lint'];
  let user = config['--user'];
  let grep = config['--grep'];
  let sort = config['--sort'];
  let sortType = config['--sort-type'];
  let padding = config['--padding'].split(',').map(v => +v);
  let cwd = config['--cwd'];
  let filter = config['--filter'];
  let gitlogCmd = [
    'git',
    config['--no-pager'] ? '--no-pager' : '',
    'log',
    config['--format'] ? `--format="${config['--format']}"` : '',
    since ? `--since="${since}"` : '',
    before ? `--before="${before}"` : '',
    config['--date'] ? `--date="${config['--date']}"` : '',
    config['--reverse'] ? '--reverse' : '',
    config['--no-merges'] ? '--no-merges' : ''
  ].join(' ');
  let log = await execSync(gitlogCmd, { cwd: cwd });
  console.log(log)
  log = log
    .split('\n')
    .filter(v => v)
    .map(v => JSON.parse(v.replace(/':('{2,})/g,"':'").replace(/('{2,}),/g,"',").replace(/'/g, '"')));
  if (log.length === 0) {
    return console.log(
      chalk.blue(since + '~' + before) +
        '之间' +
        chalk.bgGreen('查不到任何commit记录！')
    );
  }
  let curBranch = await getCurBranch('git branch', { cwd: cwd });
  if (user) {
    showAllUserLog();
  } else {
    showAllLog();
  }
  function showAllUserLog() {
    let result = log.reduce((p, v) => {
      let cur = p.find(vv => vv.author === v.author);
      let pass = new RegExp(grep).test(v.message);
      v._pass = pass;
      v._fail = !pass;
      if (cur) {
        cur._pass += +v._pass;
        cur._fail += +v._fail;
        cur._commit += 1;
        cur.list.push(v);
      } else {
        cur = {
          author: v.author,
          _commit: 1,
          _pass: +v._pass,
          _fail: +v._fail,
          list: [v]
        };
        p.push(cur);
      }
      return p;
    }, []);
    if (sort) {
      let _sort = sort.split(',');
      result = result.sort((a, b) => {
        let _b1 = b[`_${_sort[0]}`];
        let _a1 = a[`_${_sort[0]}`];
        let _b2 = b[`_${_sort[1]}`];
        let _a2 = a[`_${_sort[1]}`];
        if (_b1 !== _a1) {
          return (_b1 - _a1) * (sortType === 'desc' ? 1 : -1);
        } else {
          return (_b2 - _a2) * (sortType === 'desc' ? 1 : -1);
        }
      });
    }
    if (filter) {
      result = result
        .filter(v => v[`_${filter}`] > 0)
        .map(v => {
          v.list = v.list.filter(v => v[`_${filter}`]);
          return v;
        });
    }
    console.log(
      chalk.blue(
        `\n------------------------------------------------统计信息------------------------------------------------\n`
      )
    );
    console.log(
      [
        chalk.green('时间范围：') + since + ' ~ ' + before,
        chalk.green('当前分支：') + chalk.bgCyan(' ' + curBranch + ' ')
      ]
        .concat([
          chalk.yellow(
            'commit: ' +
              result.reduce((p, v) => {
                return (p += v._commit);
              }, 0)
          )
        ])
        .concat(
          lint
            ? [
                chalk.green(
                  'pass: ' +
                    result.reduce((p, v) => {
                      return (p += v._pass);
                    }, 0)
                ),
                chalk.red(
                  'fail: ' +
                    result.reduce((p, v) => {
                      return (p += v._fail);
                    }, 0)
                )
              ]
            : []
        )
        .concat([
          filter ? chalk.bgMagenta(` 仅显示${filter}记录! `) : []
        ])
        .join('  ')
    );
    console.log(
      chalk.blue(
        `\n------------------------------------------------详情信息------------------------------------------------\n`
      )
    );
    result.forEach(v => {
      console.log(
        [
          chalk.yellow('author: ') +
            chalk[ lint && v._fail > 0 ? 'bgRed' : 'cyan'](' ' + v.author + ' '),
          chalk.yellow('commit：') + chalk.yellow(' ' + v._commit + ' ')
        ]
          .concat(
            lint
              ? [
                  chalk.green('pass：') + chalk.green(' ' + v._pass + ' '),
                  chalk.red('fail：') +
                    chalk[v._fail == 0 ? 'cyan' : 'bgRed'](' ' + v._fail + ' ')
                ]
              : []
          )
          .concat(['\n'])
          .join('    ')
      );
      const ui = cliui();
      ui.div(
        {
          text: '[Hash]',
          width: 15,
          padding
        },
        {
          text: '[Message]',
          width: 40,
          padding
        },
        {
          text: '[Datetime]',
          width: 26,
          padding
        }
      );
      v.list.forEach(v => {
        return ui.div(
          {
            text: lint && v._fail ? chalk.bgRed(v.hash) : v.hash,
            width: 15,
            padding
          },
          {
            text: v.message,
            width: 40,
            padding
          },
          {
            text: v.datetime,
            width: 26,
            padding
          }
        );
      });
      console.log(ui.toString() + '\n');
    });
  }
  function showAllLog() {
    log = log.map(v => {
      let pass = new RegExp(grep).test(v.message);
      v._pass = pass;
      v._fail = !pass;
      return v;
    });
    if (filter) {
      log = log.filter(v => v[`_${filter}`]);
    }
    console.log(
      chalk.blue(
        `\n------------------------------------------------统计信息------------------------------------------------\n`
      )
    );
    console.log(
      [
        chalk.green('时间范围：') + since + ' ~ ' + before,
        chalk.green('当前分支：') + chalk.bgCyan(' ' + curBranch + ' '),
        chalk.yellow('commit: ') + chalk.bgYellow(' ' + log.length + ' ')
      ]
        .concat(
          lint
            ? [
                chalk.green('pass: ' + log.filter(v => v._pass).length),
                chalk.red('fail: ' + log.filter(v => v._fail).length)
              ]
            : []
        )
        .concat([
          filter ? chalk.bgMagenta(` 仅显示${filter}记录! `) : []
        ])
        .join('  ')
    );
    console.log(
      chalk.blue(
        `\n------------------------------------------------详情信息------------------------------------------------\n`
      )
    );
    const ui = cliui();
    ui.div(
      {
        text: chalk.bgGrey('[Hash]'),
        width: 15,
        padding
      },
      {
        text: chalk.bgGrey('[Message]'),
        width: 45,
        padding
      },
      {
        text: chalk.bgGrey('[Author]'),
        width: 20,
        padding
      },
      {
        text: chalk.bgGrey('[Datetime]'),
        width: 26,
        padding
      }
    );
    ui.div();
    log.forEach(v => {
      ui.div(
        {
          text: lint && v._fail ? chalk.bgRed(v.hash) : v.hash,
          width: 15,
          padding
        },
        {
          text: v.message,
          width: 45,
          padding
        },
        {
          text: v.author,
          width: 20,
          padding
        },
        {
          text: v.datetime,
          width: 26,
          padding
        }
      );
    });
    console.log(ui.toString());
  }
};
app();
