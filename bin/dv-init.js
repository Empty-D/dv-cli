#!/usr/bin/env node

/**
 * 执行初始化
 */

/**基本配置 */
// es6使用require引入方法
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
import fs from 'fs' // node 内置文件模块
import path from 'path' // 获取目录

// 修改控制台字符串的样式
import chalk from 'chalk'
// loging效果插件
import ora from 'ora'

// 交互式命令行
import inquirer from 'inquirer'
// 命令行补全工具
import { program } from 'commander'
// 远程仓库下载
import download from 'download-git-repo'

// 获取当前根目录
const __dirname = path.resolve()
// 读取根目录下的 template.json
let templateObj = require(`${__dirname}/template.json`)

// 自定义交互式命令行的问题及简单的校验
const question = [
  {
    name: 'url',
    type: 'list',
    message: '请选择模板',
    choices: [
      ...templateObj.tplArry
    ],
    validate (val) {
      console.log('进入判断');
      if (!val) return '模板不能为空!'
      return true
    }
  }
]
program.usage('用法: 命令 + <app-name>')
  .argument('[app-name]')
  .showHelpAfterError()
  .description('从已选模板创建一个新的项目')
  .action((projectName, options, command) => {
    if (!projectName) return program.help()
    console.log('projectName', projectName);
    // 交互指令
    inquirer
      .prompt(question).then(answers => {
        console.log(chalk.white('\n 开始创建项目... \n'))
        // 创建中图表
        const spinner = ora('下载中...')
        spinner.start()

        // 执行下载方法并传入参数
        download (
          answers.url,
          projectName,
          { clone: true },
          err => {
            if (err) {
              spinner.fail();
              return console.log(chalk.red(`下载失败. ${err}`))
            }
            fs.readFile(`${process.cwd()}/${projectName}/src/App.vue`, 'utf-8', (err, data) => {
              if (err) console.log(err)
              let result = data.replace(/test/g, projectName)
              fs.writeFile(`${process.cwd()}/${projectName}/src/App.vue`, result, 'utf-8',(err)=>{
                if (err) return console.log(err)
              })
            })
            console.log(chalk.green('\n 下载成功!'))
            console.log('\n 可以开始')
            console.log(`\n    cd ${projectName} \n`)
            // 结束加载图标
            spinner.succeed()
          }
        )
      })
  })
  .parse();

  // 当没有输入参数的时候给个提示
  // if (program.args.length < 1) return program.help()

  // 第一个参数是 webpack，第二个参数是 project-name
  // const templateName = program.args[0], projectName = program.args[1]
  // 校验参数
  // if (!templateObj[templateName]) return console.log(chalk.red('\n 模板不存在! \n '))
  // if (!projectName) return console.log(chalk.red('\n 项目不能为空! \n '))
