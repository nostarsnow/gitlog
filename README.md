# @ns/gitlog

## 初衷
`git log`方法虽然强大，但是总有些不尽如人意的地方。就比如`--grep`的正则支持的是`BER`和`ERE`。我更喜欢自定义一些。

## 使用方式

> 请确保命令行可以正常使用git且当前文件夹下有.git

```bash
npm i @nostar/gitlog -D

# 默认显示当月1号到今天的commit
gitlog

# 以人为单位。校验commit message
gitlog --lint
```

## 其他参数

自己猜吧。

```js
const config = {
  '--no-pager': true,
  '--format': "{'author':'%an','message':'%s','datetime':'%ad','hash':'%h'}",
  '--since': undefined,
  '--before': undefined,
  '--date': "format:%Y-%m-%d %H:%M:%S",
  '--no-merges': true,
  '--reverse': false,
  '--lint': false,
  '--grep': '^(feat|fix|update|perf|doc|docs|test|chore|refactor|revert)(\\(.*\\))?:\\s.*',
  '--sort': "fail,commit",
  '--sort-type': 'desc',
  '--only-show': '',
  '--padding': '0,2,0,2',
  '--cwd': './'
};
```

