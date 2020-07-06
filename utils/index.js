const exec = require('child_process').exec;

const padZero = num => {
  return num < 10 ? '0' + num : num
}
const getArgv = () => {
  let queryList = process.argv.slice(2);
  let result = queryList
    .map(v => v.split('='))
    //.filter(v => /--since|--before/i.test(v))
    .reduce((p, v) => {
      if ( v[1] !== undefined ){
        if ( v[1] == 'true'){
          p[v[0]] = true
        }else if ( v[1] == 'false'){
          p[v[0]] = false
        }else{
          p[v[0]] = v[1]
        }
      }else{
        p[v[0]] = true
      }
      return p;
    }, {});
  return result;
};
const execSync = (cmd, options = {cwd: './'}) => {
  return new Promise((resolve, reject) => {
    exec(cmd, options, (err, stdout, stderr) => {
      if (err) {
        console.log('err:', err);
        console.log('stderr:', stderr);
        reject();
        return;
      }
      resolve(stdout);
    });
  });
};

const getCurBranch = (cmd='git branch',options={cwd: './'})=>{
  return new Promise((resolve, reject) => {
    exec(cmd, options, (err, stdout, stderr) => {
      if (err) {
        console.log('err:', err);
        console.log('stderr:', stderr);
        reject();
        return;
      }
      resolve(stdout.match(/\*\s+(.+)/)[1]);
    });
  });
}
module.exports = {
  padZero,
  getArgv,
  execSync,
  getCurBranch
}