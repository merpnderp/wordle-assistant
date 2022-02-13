const fs = require('fs')

const words = fs.readFileSync('./words.txt', 'utf-8').split(/\s+/)
fs.writeFileSync('./sortedWords.json',JSON.stringify(words.sort()))


