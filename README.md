# @nostar/gitlog

## 初衷
`git log`方法虽然强大，但是总有些不尽如人意的地方。就比如`--grep`的正则支持的是`BER`和`ERE`。我更喜欢自定义一些。

## 使用方式

> 请确保命令行可以正常使用git且当前文件夹下有.git
```bash
# 本项目安装
npm i @nostar/gitlog -D

# 全局安装
npm i @nostar/gitlog -g

# 默认显示当月1号到今天的commit
gitlog

# 配置显示since到before日期的commit,包含since和before当天
gitlog --since=2020-03-16 --before=2020-03-19

# 默认显示当月1号到今天的commit,并校验commit message
gitlog --lint

# 默认显示当月1号到今天的commit,并校验commit message,并仅显示校验通过记录
gitlog --lint --filter=pass

# 默认显示当月1号到今天的commit,并校验commit message,并仅显示校验未通过记录
gitlog --lint --filter=fail

# 默认显示当月1号到今天的commit,按用户分组
gitlog --user

# 默认显示当月1号到今天的commit,按用户分组,并校验commit message
gitlog --user --lint

# 默认显示当月1号到今天的commit,按用户分组,并校验commit message,并仅显示校验未通过记录
gitlog --user --lint --filter=pass

# 默认显示当月1号到今天的commit,按用户分组,并校验commit message,并仅显示校验未通过记录
gitlog --user --lint --filter=fail

```

![gitlog](https://img02.sogoucdn.com/app/a/100520146/8741227ddef04854f356440a2e57d83a)  

![gitlog --lint](https://img02.sogoucdn.com/app/a/100520146/789d6c1eccda28c6a20bc9ab43a118d6)  

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
  '--user': false,
  '--grep': '^(feat|fix|update|perf|doc|docs|test|chore|refactor|revert)(\\(.*\\))?:\\s.*',
  '--sort': "fail,commit",
  '--sort-type': 'desc',
  '--only-show': '',
  '--padding': '0,2,0,2',
  '--cwd': './'
};
```

