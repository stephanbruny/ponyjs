#!/usr/bin/env node
const parser = require('./ptl-parser');
const fs = require('fs');
const args = require('optimist').argv;

const usage = [
    'Pony.JS Template Language Compiler',
    'ptlc -i <input file> -o <output file>',
    '',
    'Flags:',
    '-s\t\t\tIndentation spaces',
    '-h\t\t\tShows this help message',
    '',
    'Variables:',
    '--<name>=<value>\tAdding Template variables'
].join('\n');

const inputPath = args.i;
const outputPath = args.o || (args.i + '.json');
const space = args.s;

if (!inputPath || !outputPath || args.h) {
    console.log(usage);
    process.exit(1);
}

const reservedKeys = ['s', 'i', 'h', 'o'];

let context = {};

for (let key in args) {
    if (reservedKeys.indexOf(key) !== -1) continue;
    context[key] = args[key];
}

let input = fs.readFileSync(inputPath, 'utf8');

let result = parser.parse(input, context);

fs.writeFileSync(outputPath, (args.s) ? JSON.stringify(result, ' ', parseInt(args.s)) : JSON.stringify(result), 'utf8');

return 0;