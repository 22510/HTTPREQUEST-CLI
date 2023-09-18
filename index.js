#! /usr/bin/env node
const { program } = require('commander')
const httprequest = require('./commands/httprequest')
const list = require('./commands/list')

program
    .command('get <url>')
    .description('Send get request to url.')
    .action(httprequest)

program
    .command('list')
    .description('List all the url requested')
    .action(list)

program.parse()