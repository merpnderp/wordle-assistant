const fs = require('fs')

const readline = require('readline')
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false })

const words = JSON.parse(fs.readFileSync('./sortedWords.json'))

function parseGuess(attempt) {
    attempt = attempt.toLocaleLowerCase()

    const letters = attempt.split(' ').map(l => l.charAt(0))
    const statuses = attempt.split(' ').map(l => l.charAt(1))

    const greyLetters = letters.filter((l, i) => {
        if (statuses[i] == 'a') {
            return l
        }
    })

    const yellowLetters = []
    letters.forEach((l, i) => {
        if (statuses[i] == 'y') {
            yellowLetters.push({ l, i })
        }
    })

    const greenLetters = []
    letters.forEach((l, i) => {
        if (statuses[i] == 'g') {
            greenLetters.push({ l, i })
        }
    })
    return { greyLetters, yellowLetters, greenLetters }
}

async function getGuess() {
    return new Promise((res, rej) => {
        rl.on('line', res)
    })
}

function checkGreyLetters(greyLetters, wordList) {
    if (greyLetters.length == 0) {
        return wordlist
    }
    greyLetters.forEach(gl => {
        wordList = wordList.filter(w => !w.includes(gl))
    });
    return wordList
}

function checkYellowLetters(yellowLetters, wordList) {
    if (yellowLetters.length == 0) {
        return wordList
    }
    yellowLetters.forEach(yl => {
        wordList = wordList.filter(w => {
            return w.includes(yl.l) && w.charAt(yl.i) != yl.l
        })
    });
    return wordList
}

function checkGreenLetters(greenLetters, wordList) {
    if (greenLetters.length == 0) {
        return wordList
    }
    greenLetters.forEach(gl => {
        wordList = wordList.filter(w => {
            return w.charAt(gl.i) == yl.l
        })
    });
    return wordList
}

function checkLetters(lettersObject, wordList) {
    wordList = checkGreyLetters(lettersObject.greyLetters, wordList)
    wordList = checkYellowLetters(lettersObject.yellowLetters, wordList)
    wordList = checkGreenLetters(lettersObject.greenLetters, wordList)
    return wordList
}


(async () => {
    let guesses = 0
    let guessResults = words
    while (guesses < 5) {
        process.stdout.write(`Please enter guess #${guesses + 1} results as each letter coupled with a (gray), y (yellow), or g (green) separated by a space (ca ry aa ny ea).\n:`)
        const guess = await getGuess()
        const lettersObject = parseGuess(guess)
        console.log(words.length)
        guessResults = checkLetters(lettersObject, guessResults)
        fs.writeFileSync(`guesses${guesses + 1}.txt`, guessResults.join('\n'))
        console.log(guessResults.length)
        guesses++
    }
})()
