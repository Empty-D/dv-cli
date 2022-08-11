#!/usr/bin/env node

/**
 * 输出项目列表
 */

/**基本配置 */
// es6使用require引入方法
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import { dirname } from 'path' // 获取目录
import { fileURLToPath } from 'url' // 处理路径地址

// 修改控制台字符串的样式
import chalk from 'chalk'

// 获取当前根目录
const __dirname = `${dirname(fileURLToPath(import.meta.url))}/../`

// 读取根目录下的 template.json
const templateObj = require(`${__dirname}template.json`)

// 增强模板数据可读性
const tempArrList = templateObj.tplArry.map(item => `${item.name}-(${item.description}): ${item.url}\n`)
console.log(chalk.grey('模板信息: \n'))
console.log(...tempArrList)
