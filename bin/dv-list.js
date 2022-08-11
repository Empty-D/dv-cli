#!/usr/bin/env node

/**
 * 输出项目列表
 */

/**基本配置 */
// es6使用require引入方法
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
// node 内置文件模块
import fs from 'fs'
// 获取目录
import path from 'path'

// 获取当前根目录
const __dirname = path.resolve()
// 读取根目录下的 template.json
const templateObj = require(`${__dirname}/template.json`)
console.log('模板数据\n', ...templateObj.tplArry);
