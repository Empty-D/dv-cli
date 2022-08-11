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
// 交互式命令行
import inquirer from 'inquirer'

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

inquirer
  .prompt(question).then(answers => {
    // answers 就是用户输入的内容，是个对象
    let { name, description, url } = answers;

    // 过滤 unicode 字符
    url = url.includes('http') || url.includes('https')
      ? `direct:${url.replace(/[\u0000-\u0019]/g, '')}`
      : `${url.replace(/[\u0000-\u0019]/g, '')}`

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
    const tempArrList = templateObj.tplArry.map(item => `${item.name}(${item.description}): ${item.url}\n\n`)

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
  })
