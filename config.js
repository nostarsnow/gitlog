const config = {
  '--no-pager': true,
  '--format': "{'author':'%an','message':'%s','datetime':'%ad','hash':'%h'}",
  '--since': undefined,
  '--before': undefined,
  '--date': "format:%Y-%m-%d %H:%M:%S",
  '--no-merges': true,
  '--reverse': false,
  '--lint': false,
  '--user': false,
  '--grep': '^(feat|fix|update|perf|doc|docs|test|chore|refactor|revert)(\\(.*\\))?:\\s.*',
  '--sort': "fail,commit",
  '--sort-type': 'desc',
  '--filter': '',
  '--padding': '0,2,0,2',
  '--cwd': './'
};
let now = new Date();
let year = now.getFullYear();
let month = now.getMonth() + 1;
let startDate = 1;
let endDate = now.getDate();
config['--since'] = `${year}-${month}-${startDate}`;
config['--before'] = `${year}-${month}-${endDate}`;
module.exports = config;
