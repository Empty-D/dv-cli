#!/usr/bin/env node

/**
 * 创建命令
 */

/**基本配置 */
// es6使用require引入方法
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
import fs from 'fs' // node 内置文件模块
import { dirname } from 'path' // 获取目录
import { fileURLToPath } from 'url' // 处理路径地址

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
const __dirname = `${dirname(fileURLToPath(import.meta.url))}/../`
// 读取根目录下的 template.json
let templateObj = require(`${__dirname}template.json`)

// 自定义交互式命令行的问题及简单的校验
const question = [
  {
    name: 'name',
    type: 'input',
    message: '请输入模板名称',
    validate (val) {
      if (!val.trim()) return '模板名称不能为空!'
      if (templateObj.tplArry.filter(item => item.name === val).length) return '模板已存在!'
      return true
    }
  },
  {
    name: 'description',
    type: 'input',
    message: '请输入模板描述信息'
  },
  {
    name: 'url',
    type: 'input',
    message: '请输入模板地址',
    validate (val) {
      if (val === '') return '远程地址不能为空!'
      return true
    }
  }
]

program.usage('用法: 命令 + <app-name>')
  .argument('[app-name]')
  .showHelpAfterError()
  .action((projectName, options, command) => {
    if (!projectName) return program.help()

    // 交互指令
    inquirer
    .prompt(question).then(answers => {
      // answers 就是用户输入的内容，是个对象
      let { name, description, url } = answers;
  
      // 过滤 unicode 字符
      url = url.includes('http') || url.includes('https')
        ? `direct:${url.replace(/[\u0000-\u0019]/g, '')}`
        : `${url.replace(/[\u0000-\u0019]/g, '')}`

      // 模板数据
      templateObj.tplArry = [
        ...templateObj.tplArry,
        {
          name,
          description,
          url,
          value: url
        }
      ]

      // 增强模板数据可读性
      const tempArrList = templateObj.tplArry.map(item => `${item.name}(${item.description})\n\n`)

      // 把模板信息写入 template.json 文件中
      fs.writeFile(
        `${__dirname}template.json`,
        JSON.stringify(templateObj),
        'utf-8',
        err => {
          if (err) console.log(err)
          console.log('\n', chalk.green('操作成功!\n'))
          console.log(chalk.grey('模板信息: \n'))
          console.log(...tempArrList, '\n')
        }
      )

      console.log(chalk.white('\n 开始创建项目... \n'))
      // 创建中图表
      const spinner = ora('下载中...')
      spinner.start()
      // 执行下载方法并传入参数
      download (
        url,
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
            // 结束加载图标
            spinner.succeed('下载完成!')
            console.log(chalk.green('\n 项目创建成功!'))
            console.log(`\n    cd ${projectName} \n`)
        }
      )

    })
  })
  .parse();
