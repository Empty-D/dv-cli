#!/usr/bin/env node

/**
 * 删除命令
 */

/**基本配置 */
// es6使用require引入方法
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
// node 内置文件模块
import fs from 'fs'
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

const question = [
  {
    name: 'name',
    message: '请输入要删除的模板名称',
    validate (val) {
      if (!val.trim()) return '模板名称不能为空!'
      if (val === 'tpl') return '初始模板不可删除, 如需删除请手动更改json文件!'
      if (val === '*') return true
      if (!templateObj.tplArry.filter(item => item.name === val).length) return '模板不存在!'
      return true
    }
  }
];

inquirer
  .prompt(question).then(answers => {
    let { name } = answers;
    if (name === '*') {
      templateObj = {
        tplArry: [
          {
            name: 'tpl',
            description: 'template1 (前端模板, 基于vue2)',
            url: 'direct:http://gitlab.hztianque.com/s1e/assessmentthirdparty.git',
            value: 'direct:http://gitlab.hztianque.com/s1e/assessmentthirdparty.git'
          }
        ]
      }
    } else {
      const key = templateObj.tplArry.findIndex(item => item.name === name)
      key !== -1 ? templateObj.tplArry.splice(key, 1) : ''
    }
    // 更新 template.json 文件
    fs.writeFile(
      `${__dirname}template.json`,
      JSON.stringify(templateObj),
      'utf-8',
      err => {
        if (err) console.log(err)
        console.log('\n', chalk.green('操作成功!\n'))
        console.log(chalk.grey('模板信息: \n'))
        // console.log(...templateObj.tplArry, '\n')
      }
    )
  })
