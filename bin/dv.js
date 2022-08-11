#!/usr/bin/env node

/**
 * 入口
 */

/**基本配置 */
// es6使用require引入方法
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// 命令行补全工具
import { program } from 'commander';
// 交互式命令行
import inquirer from 'inquirer';

// 定义指令
program
  .version(require('../package').version, '-v, --version')
  .usage('<command> [options]')
  .command('add', '创建新的模板')
  .command('delete', '删除指定模板')
  .command('list', '列出所有模板')
  .command('init', '从模板生成新的项目')
  .command('create', '创建模板并生成新的项目')
  // .action((option) => { // 回调函数
  // 	console.log('success');
  // });
// 解析命令行参数
  .parse(process.argv);
