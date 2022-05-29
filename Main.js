document.addEventListener("DOMContentLoaded", () => {
    createSquares()
    getNewWord()

    const keys = document.querySelectorAll('.keyboard-row button')
    let guessedWords = [[]] //this array keys a record of all the guess words
    let spaceAvaliable = 1;
    let word;
    let guessedWordCount = 0;


    function getNewWord() {
        fetch(
            `https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=5&lettersMax=5`,
            {
                method: "GET",
                headers: {
                    "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
                    "x-rapidapi-key": 'c545309271msh2d72c8f7b82f552p122125jsn3df85a77f8da',
                },
            }
            )
            .then((response) => { //converts the repsonse to json
                return response.json();
            })
            .then((res) => { // then take the result and assign it to the word variable
                word = res.word;
            })
            .catch((err) => {
                console.error(err);
            });
        }



    for (let i = 0; i < keys.length; i++){
        keys[i].onclick = ({target}) => {
            const letter = target.getAttribute('data-key')
            updateGuessedWords(letter)
        }
    }

    function getCurrentWordArray(){
        const numberOfGuessedWords = guessedWords.length // this gets the length of the guessed words so far within the array
        return guessedWords[numberOfGuessedWords - 1] // this returns the letter at the specific index
    }


    function updateGuessedWords(letter) {
        const currentWordArray = getCurrentWordArray()

        if(currentWordArray && currentWordArray.length < 5){ // here I am checking if the current length of the array is less than 5 which is the maximum number of guesses allowed
            currentWordArray.push(letter) // adds to the new array

            const availableSpace = document.getElementById(String(spaceAvaliable))
            spaceAvaliable = spaceAvaliable + 1

            availableSpace.textContent = letter
            availableSpace.classList.add("animate__bounceIn")
        }
    }

    function createSquares() {
        const gameBoard = document.getElementById("board")

        for (let i = 0; i < 30; i++){
            let square = document.createElement("div")
            square.classList.add("square")
            square.classList.add("animate__animated");
            square.setAttribute("id", i + 1); //This adds a a new value to an attribute. If the attribute is not present it will create one
            gameBoard.appendChild(square); //The appendChild method appends a node to the end of the list of children of a specified parent node
        }
    }


    function GetTileColour(letter,i){
        const CorrectLetter = word.includes(letter)  // this checks if the letter is within the word

        if (!CorrectLetter){
            return "rgb(123, 123, 123)"
        }

        const letterInPosition = word.charAt(i)
        const CorrectPosition = letter === letterInPosition

        if(CorrectPosition) {
            return "rgb(16, 178, 35)"
        }

        return "rgb(216, 207, 12)"
    }

    function SubmitWord() {
        const currentWordArray = getCurrentWordArray()
        if(currentWordArray.length !== 5){ // here we are checking the length of the array of the word entered
            window.alert("Please enter a 5 letter Word")
        }

        const currentWord = currentWordArray.join('') // we make a new array and join it together

        fetch(
            `https://wordsapiv1.p.rapidapi.com/words/${currentWord}`,
            {
                method: "GET",
                headers: {
                    "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
                    "x-rapidapi-key": 'c545309271msh2d72c8f7b82f552p122125jsn3df85a77f8da',
                },
            }
            ).then((res) => {
                if(!res.ok) {
                    throw Error("Invalid Word")
                }

                const firstLetterID = guessedWordCount * 5 + 1;
                const interval = 500;
                currentWordArray.forEach((letter, i) => {
                setTimeout(() => {
                    const tileColour = GetTileColour(letter, i)

                    const letterID = firstLetterID + i;
                    const letterElement = document.getElementById(letterID)
                    letterElement.classList.add("animate__flipInX")
                    letterElement.style = `background-color: ${tileColour}; border-color: ${tileColour}`
                }, interval * i)   
            });

            guessedWordCount += 1

            if (currentWord === word){
                window.alert("Congrats your correct")
            }

            if(guessedWords.length === 6){ //checks if the array of guesswords equals to 6 which is the maximum amounts of guesses allowed
                window.alert(`You have lost! the word was ${word}`)
            }
            guessedWords.push([])
            }).catch(() => {
                window.alert("Not a real word!")
            })
        }

    function DeleteWord(){
        const currentWordArray = getCurrentWordArray()
        const removedLetter = currentWordArray.pop() // this is just an empty list of letters

        guessedWords[guessedWords.length - 1] = currentWordArray //This is reducing the index of the array by one and reassigning it the the currentWordArray

        const lastLetterElement = document.getElementById(String(spaceAvaliable - 1))
        spaceAvaliable = spaceAvaliable - 1  // This increase the space available 
        
        lastLetterElement.textContent = ""
    }

    for (let i = 0; i < keys.length; i++){
        keys[i].onclick = ({target}) => {
            const letter = target.getAttribute('data-key') // this gets the data from the html file 
            

            if(letter === 'enter') {
                return SubmitWord();
            }

            if(letter === 'del'){
                return DeleteWord();
            }
            updateGuessedWords(letter)
        }
    }
})