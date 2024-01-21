/* 
    Default Language is English
    Default Difficulty is Mix
    Default Time is 15 Seconds

    Variable Dictionary:-
    englishDict - Is an array that stores english words chosen from a specific csv dictionary file (default is mixEnglishWords.csv).
    typingBox - Is the typing box parent <div> of all words generated.
    wordCapacity - Is the number of words to be generated in the typingBox.
    resultBox - Is the <div> that holds the results & statistics of the player.
    wordNumber - Is the current position of the selected word that the player is on. Ex. "Hello World", "Hello" is word 0 and "World" is word 1.
    letterNumber - Is the current position of the selected letter within the selected word. Ex. "Hello", "H" is letter 0, "o" letter 4.
    correctWords - Is the count of accurately spelled and written words.
    totalCharacters - Is the total count of characters typed by the player.
    incorrectLetters - Is the total count of incorrectly typed characters by the player.
    timeSet - Is the time chosen by the player in minutes. The default is 15 seconds, calculated as (seconds / 60), resulting in (15 / 60) = 0.25 minutes.
    gameStarted - Is a boolean flag that initiates all game mechanics when set to true.
    countDownSec - Is the number of seconds set by the player that counts down when the game is started.
    currentWord - Is the word that the user is currently on (i.e. <div> with class name word_active).
    instruction - Is an HTML <h1> element that includes initial instructions followed by the timer.
    timer -Is the background timer that, when it expires, displays the game statistics.
    visibleTimer - Is the onscreen timer that is displayed to the player while typing.
    options - Is the <div> element that displays all game options
    lineHeight - Is the height of a single line in the typingBox. All lines have the same line height.
    firstWordRect - Is the bounding rectangle information for the first word within the typing box.
    secondLine - Is the position of the second line in the typingBox.

*/

let englishDict;
let typingBox = document.querySelector(".typingBox");

//Stores all words in the csv file in englishDict.
function readFile() {
    return new Promise(function (resolve, reject) {
        $.get("dictionaries/english/mixEnglishWords.csv", function (CSVdata) {
            englishDict = CSVdata.split(",");
            resolve();
        });
    });
}

//Returns true if character is an english or arabic letter
function isLetter(c) {
        return /^[a-zA-Z]$/.test(c) || /[\u0600-\u06FF\u0750-\u077F]/.test(c);
    
}

//Returns true if the word passed is correct
function checkWord(word) {
    for (let i = 0; i < word.innerText.length; i++) {
        if (word.children[i].className == "incorrect" || word.children[i].className == "extraLetter" || word.children[i].className == "") {
            return false;
        }
    }
    return true;
}

//Returns the index of the last selected letter of the passed word. For example, if you had to write the word "Hello" but you passed "He", the function will return the index of "e".
//Works with correct, incorrect, and extra letters.
function getIndexOfLastLetter(word) {
    for (let i = word.innerText.length - 1; i >= 0; i--) {
        if (word.children[i].className == "incorrect" || word.children[i].className == "extraLetter" || word.children[i].className == "correct") {
            return i;
        }
    }
    return -1;
}

/*Layout of Typing Box
    Creates wordCapacity number of divs. 
    Each div is a word
    Each word/div is then assigned the class "word". However, the first word is assigned "word_active"
    Each word has children that are the letters of that word.
    Default is 50 words for 15 seconds
*/
//Generates wordCapacity number of words from the selected englishDict in the mentioned layout. No repeated words are generated.
function generateWords(wordCapacity) {
    const usedWords = new Set();
    for (let i = 0; i < wordCapacity; i++) {
        let randomWord;

        //Checks if word has already been used to avoid repitition.
        do {
            randomWord = englishDict[Math.floor(Math.random() * englishDict.length)];
        } while (usedWords.has(randomWord));

        usedWords.add(randomWord);

        let word = document.createElement("div");

        //if first word then class is word_active, else class is word.
        i == 0 ? word.classList.add("word_active") : word.classList.add("word");
        
        for (let j = 0; j < randomWord.length; j++) {
            let letters = document.createElement("letter");
            letters.innerText = randomWord[j];
            word.appendChild(letters);
        }
        document.querySelector('.typingBox').appendChild(word);
    }
}

//Easter Egg
function getRandomPosition() {
    const screenWidth = window.innerWidth - 50;
    const screenHeight = window.innerHeight - 50;

    const randomX = Math.random() * screenWidth;
    const randomY = Math.random() * screenHeight;

    return { x: randomX, y: randomY };
}

//Easter Egg
function getRandomRotation() {
    const rotation = Math.random() * -75;    
    return rotation;
}

//Easter Egg
function isPositionInElement(position, element) {
    if (!element) return false;

    const rect = element.getBoundingClientRect();

    return (
        position.x >= rect.left &&
        position.x <= rect.right &&
        position.y >= rect.top &&
        position.y <= rect.bottom
    );
}

readFile().then(function () {
    //Sets default values.
    let wordCapacity = 50;
    let resultBox = document.querySelector(".results");
    let wordNumber = 0;
    let letterNumber = 0;
    let correctWords = 0;
    let totalCharacters = 0;
    let incorrectLetters = 0;
    let timeSet = 0.25;
    let gameStarted = false;
    let countDownSec;
    let currentWord;
    let instruction;
    let timer;
    let visibleTimer;
    let options = document.querySelector(".options");
    let lineHeight;
    let firstWordRect;
    let secondLine;

    //Generate words and create the layout.
    generateWords(wordCapacity);

    //Hide the result box, it will be unhidden when the game is over.
    resultBox.style.display = "none";
    
    //Easter Egg
    function checkIfInRestrictedArea(position) {
        const resetButton = document.getElementById('reset');     
    
        if (
            isPositionInElement(position, typingBox) ||
            isPositionInElement(position, instruction) ||
            isPositionInElement(position, resetButton) ||
            isPositionInElement(position, options)
        ) {
            return true; // Heart is in a restricted area
        }
    
        return false; // Heart is not in a restricted area
    }
    
    //Easter Egg
    function randomlyPositionHeart() {
        const heart = document.getElementById('randomHeart');

        if (heart) {
            let position;
            let isInRestrictedArea;

            do {
                position = getRandomPosition();
                isInRestrictedArea = checkIfInRestrictedArea(position);
            } while (isInRestrictedArea);

            const rotation = getRandomRotation();

            heart.style.top = position.y + 'px';
            heart.style.left = position.x + 'px';
            heart.style.transform = `rotate(${rotation}deg)`;
        }
    }

    //Easter Egg
    setTimeout(randomlyPositionHeart,50);

    document.querySelector(".heart").addEventListener('click', () =>{
        console.log("Hello");
        window.location.href = "easterEgg.html";
    });

    //Adds event listener on the "15s" button.
    document.querySelector(".fifteenSeconds").addEventListener('click', function (e) {
        //Adjusts the values of timeSet and wordCapacity appropriately
        timeSet = 15 / 60;
        wordCapacity = 50;

        //Resets game with updated settings
        reset();

        //Updates the user interface to indicate the currently selected option
        document.querySelector(".time").querySelectorAll(".selected")[0].classList.remove("selected");
        e.target.classList.add("selected");
    });

    //Adds event listener on the "30s" button.
    document.querySelector(".thirtySeconds").addEventListener('click', function (e) {
        //Adjusts the values of timeSet and wordCapacity appropriately
        timeSet = 30 / 60;
        wordCapacity = 100;

        //Resets game with updated settings
        reset();

        //Updates the user interface to indicate the currently selected option
        document.querySelector(".time").querySelectorAll(".selected")[0].classList.remove("selected");
        e.target.classList.add("selected");
    });

    //Adds event listener on the "60s" button.
    document.querySelector(".sixtySeconds").addEventListener('click', function (e) {
        //Adjusts the values of timeSet and wordCapacity appropriately
        timeSet = 60 / 60;
        wordCapacity = 150;

        //Resets game with updated settings
        reset();

        //Updates the user interface to indicate the currently selected option
        document.querySelector(".time").querySelectorAll(".selected")[0].classList.remove("selected");
        e.target.classList.add("selected");
    });

    //Adds event listener on the "Easy (1-4 Letters)" button.
    document.querySelector(".easyDiff").addEventListener('click', function(e){
        //Updates englishDict to the contents of the easyEnglishWords file
        $.get("dictionaries/english/easyEnglishWords.csv", function (CSVdata) {
            englishDict = CSVdata.split(",");

        });

        //Resets game with updated settings.
        setTimeout(()=>{
            reset();
        }, 50)

        //Updates the user interface to indicate the currently selected option
        document.querySelector(".difficulty").querySelectorAll(".selected")[0].classList.remove("selected");
        e.target.classList.add("selected");
    });

    //Adds event listener on the "Medium (4-6 Letters)" button.
    document.querySelector(".mediumDiff").addEventListener('click', function(e){
        //Updates englishDict to the contents of the mediumEnglishWords file
        $.get("dictionaries/english/mediumEnglishWords.csv", function (CSVdata) {
            englishDict = CSVdata.split(",");
        });

        //Resets game with updated settings.
        setTimeout(()=>{
            reset();
        }, 50);

        //Updates the user interface to indicate the currently selected option
        document.querySelector(".difficulty").querySelectorAll(".selected")[0].classList.remove("selected");
        e.target.classList.add("selected");
    });

    //Adds event listener on the "Hard (7-9 Letters)" button.
    document.querySelector(".hardDiff").addEventListener('click', function(e){
        //Updates englishDict to the contents of the hardEnglishWords file
        $.get("dictionaries/english/hardEnglishWords.csv", function (CSVdata) {
            englishDict = CSVdata.split(",");
        });

        //Resets game with updated settings.
        setTimeout(()=>{
            reset();
        }, 50);

        //Updates the user interface to indicate the currently selected option
        document.querySelector(".difficulty").querySelectorAll(".selected")[0].classList.remove("selected");
        e.target.classList.add("selected");
    });

    //Adds event listener on the "Medium (1-14 Letters)" button.
    document.querySelector(".mixDiff").addEventListener('click', function(e){
        //Updates englishDict to the contents of the mixEnglishWords file
        $.get("dictionaries/english/mixEnglishWords.csv", function (CSVdata) {
            englishDict = CSVdata.split(",");
        });

        //Resets game with updated settings.
        setTimeout(()=>{
            reset();
        }, 50);

        //Updates the user interface to indicate the currently selected option
        document.querySelector(".difficulty").querySelectorAll(".selected")[0].classList.remove("selected");
        e.target.classList.add("selected");
    });

    //Adds event listener on the "Arabic" button.
    document.querySelector(".arabicLang").addEventListener('click', function(e){
        //Updates englishDict to the contents of the arabicWords file
        $.get("dictionaries/arabic/arabicWords.csv", function (CSVdata) {
            englishDict = CSVdata.split(",");
        });

        setTimeout(()=>{
            //Updates the user interface to indicate the currently selected option
            typingBox.style.direction = "rtl";
            typingBox.style.fontFamily = "'Rubik', sans-serif";
            
            options.style.width = "30vw";
            document.querySelector('.difficulty').style.display = "none";
            document.querySelector(".timeDiff").style.display = "none"; 
            
            document.querySelector(".language").querySelectorAll(".selected")[0].classList.remove("selected");
            e.target.classList.add("selected");
            
            //Resets game with updated settings.
            reset();
        }, 50);
        
    });

    //Adds event listener on the "English" button.
    document.querySelector(".englishLang").addEventListener('click',function (e){
        //Updates englishDict to the contents of the mixEnglishWords file
        $.get("dictionaries/english/mixEnglishWords.csv", function (CSVdata) {
            englishDict = CSVdata.split(",");
        });

        setTimeout(()=>{
            //Updates the user interface to indicate the currently selected option
            typingBox.style.direction = "";
            typingBox.style.fontFamily = "";

            options.style.width = "";
            document.querySelector(".difficulty").style.display = "";
            document.querySelector(".timeDiff").style.display = "";

            document.querySelector(".language").querySelectorAll(".selected")[0].classList.remove("selected");
            e.target.classList.add("selected");

            //Resets game with updated settings.
            reset();
        }, 50);
    });

    //When the game starts the options bar is hidden, this block of code unhides the options bar once the player's cursor leaves the typingBox.
    typingBox.addEventListener('mouseleave', function () {
        if (gameStarted){
            options.style.animation = "fadeIn .3s ease-in";
            options.style.opacity = "";
            options.style.pointerEvents = "";

            document.querySelector("footer").style.opacity = "";
            document.querySelector("footer").style.pointerEvents = "";
            document.querySelector("footer").style.animation = "fadeIn .3s ease-in";
        }
    });

    //Updates the result screen with the player's statistics.
    function loadStats(totalCharacters, incorrectLetters, timeSet) {
        //Hides typingBox and options bar then unhides the resultBox.
        typingBox.style.display = "none";
        options.style.opacity = "0%";
        options.style.pointerEvents = "none";
        resultBox.style.display = "";
        document.querySelector("footer").style.opacity = "";
        document.querySelector("footer").style.pointerEvents = "";

        //Calculates statistics
        let grossWPM = (totalCharacters / 5) / timeSet;
        let accuracy = (1 - (incorrectLetters / totalCharacters)) * 100;
        let netWPM = grossWPM * (accuracy / 100);/* - (incorrectLetters / timeSet) */

        //Displays statistics
        resultBox.querySelector(".netwpm").querySelector(".statisticValue").innerText = Math.round(netWPM);
        resultBox.querySelector(".netwpm").querySelector(".statisticDetail").innerText = `${netWPM.toFixed(2)} precision-adjusted wpm`;

        resultBox.querySelector(".grosswpm").querySelector(".statisticValue").innerText = Math.round(grossWPM);
        resultBox.querySelector(".grosswpm").querySelector(".statisticDetail").innerText = `${grossWPM.toFixed(2)} raw wpm`;

        resultBox.querySelector(".correctWords").querySelector(".statisticValue").innerText = correctWords;
        resultBox.querySelector(".correctWords").querySelector(".statisticDetail").innerText = `${correctWords} correct words`;

        resultBox.querySelector(".chars").querySelector(".statisticValue").innerText = totalCharacters;
        resultBox.querySelector(".chars").querySelector(".statisticDetail").innerText = `${totalCharacters} characters typed`;

        resultBox.querySelector(".mistakes").querySelector(".statisticValue").innerText = incorrectLetters;
        resultBox.querySelector(".mistakes").querySelector(".statisticDetail").innerText = `${incorrectLetters} incorrect characters`;

        resultBox.querySelector(".accuracy").querySelector(".statisticValue").innerText = `${Math.floor(accuracy)}%`;
        resultBox.querySelector(".accuracy").querySelector(".statisticDetail").innerText = `${accuracy.toFixed(2)}% (${totalCharacters - incorrectLetters} correct / ${incorrectLetters} incorrect)`;
    }

    //Core game mechanics
    function keydownGameMechanics(e){
            //When the first letter of the typingBox is inputted, gameStarted is set to true, the timer starts.
            if (wordNumber == 0 && letterNumber == 0 && e.key == currentWord.children[0].innerText) {
                gameStarted = true;

                //Loads the statistics and stops the game once the time set by the player is over.
                timer = setTimeout(() => {
                    loadStats(totalCharacters, incorrectLetters, timeSet);
                    gameStarted = false;
                }, timeSet * 60 * 1000);

                //Sets countDownSec to the number of seconds the player chose and displays it to the player.
                countDownSec = timeSet * 60;
                instruction.innerText = countDownSec;
                instruction.style.animation = "countdown 1s ease-in-out infinite";
                instruction.style.fontWeight = "lighter";

                //For responsiveness (Mobile)
                if (window.screen.availWidth <= 768){
                    instruction.style.fontSize = "5vw";
                }
                else{
                    instruction.style.fontSize = "1.82vw";
                }

                //Starts decreasing number of seconds.
                countDownSec--;

                //Keeps updating the number of seconds stored in countDownSec and displays it. 
                visibleTimer = setInterval(function () {
                    instruction.innerText = countDownSec;
                    countDownSec--;

                    //Once time is over, the timer is stopped and instructions is changed to "Game Statistics".
                    if (countDownSec < 0) {
                        clearInterval(visibleTimer);
                        instruction.style.color = "rgb(255,255,255,0.7)";
                        instruction.style.animation = "";
                        instruction.style.fontSize = "";
                        instruction.style.fontWeight = "";
                        instruction.innerText = "Game Statistics";
                        options.style.display = "none";
                    }
                    //Once the timer reaches 5 seconds it starts blinking faster and becomes red.
                    else if (countDownSec < 5){
                        instruction.style.color = "#F93822";
                        instruction.style.animation = "countdown 0.5s ease-in-out infinite";
                    }
                }, 1000);
            }

            if (gameStarted) {
                //Hides options when the game is started
                options.style.animation = "fadeOut .3s ease-in";
                options.style.opacity = "0%";
                options.style.pointerEvents = "none";
                document.querySelector("footer").style.opacity = "0%";
                document.querySelector("footer").style.pointerEvents = "none";
                document.querySelector("footer").style.animation = "fadeOut .3s ease-in";
                
                //Pressing space to go to next word.
                //If you press space, the next word becomes active and you move on to the next word regardless if the previous word is correct or not.
                if (e.key == " " || e.code == "Space") {
                    wordNumber++;

                    if (checkWord(typingBox.children[wordNumber - 1])) {
                        correctWords++;
                        //Code for visible cursor
                        typingBox.children[wordNumber - 1].children[getIndexOfLastLetter(typingBox.children[wordNumber - 1])].removeAttribute('id');
                    }
                    else {
                        //If the previous word is wrong, makes the previous word red to emphasize its wrong.
                        typingBox.children[wordNumber - 1].style.textDecoration = "underline";
                        typingBox.children[wordNumber - 1].style.textDecorationColor = "red";

                        //Counts number of letters that are not typed in the previous word. They are counted as incorrect.
                        for (let i = 0; i < typingBox.children[wordNumber - 1].innerText.length; i++) {
                            if ((typingBox.children[wordNumber - 1].children[i].className == "")) {
                                incorrectLetters++;
                            }
                        }
                        
                        //Code for visible cursor
                        if (getIndexOfLastLetter(typingBox.children[wordNumber - 1]) == typingBox.children[wordNumber - 1].innerText.length - 1) {
                            typingBox.children[wordNumber - 1].children[getIndexOfLastLetter(typingBox.children[wordNumber - 1])].removeAttribute('id');
                        }
                        else {
                            typingBox.children[wordNumber - 1].children[getIndexOfLastLetter(typingBox.children[wordNumber - 1]) + 1].removeAttribute('id');
                        }                        
                    }
                    //If player finishes all words available.
                    if (wordNumber == wordCapacity){
                        gameStarted = false;
                        let emptyWord = document.createElement('div');
                        emptyWord.classList.add("word");
                        emptyWord.appendChild(document.createElement('letter'));
                        typingBox.appendChild(emptyWord);
                        
                        clearInterval(visibleTimer);
                        instruction.style.color = "rgb(255,255,255,0.7)";
                        instruction.style.animation = "";
                        instruction.style.fontSize = "";
                        instruction.style.fontWeight = "";
                        instruction.innerText = "Game Statistics";
                        options.style.display = "none";
                        loadStats(totalCharacters, incorrectLetters, timeSet);
                    }
                    typingBox.children[wordNumber - 1].classList.replace("word_active", "word");
                    typingBox.children[wordNumber].classList.replace("word", "word_active");
                    currentWord = document.querySelector('.word_active');
                    letterNumber = 0;
                    totalCharacters++;

                    setTimeout(()=>{
                        if(typingBox.style.direction == ""){
                            currentWord.children[letterNumber].setAttribute('id', 'leftCursor');
                        }
                        else if(typingBox.style.direction == "rtl"){
                            currentWord.children[letterNumber].setAttribute('id', 'rightCursor');
                        }
                    },1);
                }

                //Deleting letters.
                else if ((e.key == "Backspace" || e.key == "Del") && !(wordNumber == 0 && letterNumber == 0)) {
                    //Special case where the player is at the first word and is trying to delete at the first letter, this branch doesnt allow the player to do that.
                    if (wordNumber == 0 && letterNumber > 0) {
                        letterNumber--;
                        totalCharacters--;

                        //Code for visible cursor
                        if (letterNumber == currentWord.innerText.length - 1 && currentWord.children[letterNumber].className != "extraLetter") {
                            currentWord.children[letterNumber].removeAttribute('id');
                            if (typingBox.style.direction == ""){
                                currentWord.children[letterNumber].setAttribute('id', 'leftCursor');
                            }
                            else if (typingBox.style.direction == "rtl"){
                                currentWord.children[letterNumber].setAttribute('id','rightCursor');
                            }
                        }

                        //Code for visible cursor
                        else if (letterNumber == currentWord.innerText.length - 1) {
                            currentWord.children[letterNumber].removeAttribute('id');
                            if (typingBox.style.direction == ""){
                                currentWord.children[letterNumber - 1].setAttribute('id', 'rightCursor');
                            }
                            else if (typingBox.style.direction == "rtl"){
                                currentWord.children[letterNumber - 1].setAttribute('id', 'leftCursor');
                            }
                        }

                        //Code for visible cursor
                        else {
                            currentWord.children[letterNumber + 1].removeAttribute('id');
                            if (typingBox.style.direction == ""){
                                currentWord.children[letterNumber].setAttribute('id', 'leftCursor');
                            }
                            else if (typingBox.style.direction == "rtl"){
                                currentWord.children[letterNumber].setAttribute('id', 'rightCursor');
                            }
                        }

                        //Removes the correct/incorrect/extraletter/"" classes from the letter that is being deleted.                        
                        if (currentWord.children[letterNumber].classList == "correct") {
                            currentWord.children[letterNumber].classList.remove("correct");
                        }
                        else if (currentWord.children[letterNumber].classList == "incorrect") {
                            currentWord.children[letterNumber].classList.remove("incorrect");
                            incorrectLetters--;
                        }
                        else if (currentWord.children[letterNumber].classList == "") {
                            incorrectLetters--;
                        }
                        else {
                            currentWord.children[letterNumber].remove();
                            incorrectLetters--;
                        }

                    }
                    //Checks if the player is trying to go back to the previous word to correct it, so this branch allows you to delete and go back to fix it.
                    else if (!checkWord(typingBox.children[wordNumber - 1]) && letterNumber == 0) {
                        letterNumber = getIndexOfLastLetter(typingBox.children[wordNumber - 1]);
                        
                        //Code for visible cursor
                        typingBox.children[wordNumber].children[0].removeAttribute('id');

                        //Makes previous word active and makes it the current word.
                        typingBox.children[wordNumber - 1].classList.replace("word", "word_active");
                        typingBox.children[wordNumber].classList.replace("word_active", "word");
                        typingBox.children[wordNumber - 1].style.textDecoration = "none";
                        currentWord = document.querySelector('.word_active');

                        //Updates game statistics
                        wordNumber--;
                        totalCharacters--;
                        incorrectLetters -= (currentWord.innerText.length - (letterNumber + 1));

                        //Code for visible cursor
                        if (typingBox.style.direction == ""){
                            currentWord.children[letterNumber].setAttribute('id', 'leftCursor');
                        }
                        else if (typingBox.style.direction == "rtl"){
                            currentWord.children[letterNumber].setAttribute('id','rightCursor');
                        }
                        
                        //Code for visible cursor
                        if (currentWord.children[letterNumber].className == "extraLetter") {
                            if (typingBox.style.direction == ""){
                                currentWord.children[letterNumber - 1].setAttribute('id', 'rightCursor');
                            }
                            else if (typingBox.style.direction == "rtl"){
                                currentWord.children[letterNumber - 1].setAttribute('id', 'leftCursor');
                            }
                        }

                        //Removes the correct/incorrect/extraletter/"" classes from the letter that is being deleted.
                        if (currentWord.children[letterNumber].classList == "correct") {
                            currentWord.children[letterNumber].classList.remove("correct");
                        }
                        else if (currentWord.children[letterNumber].classList == "incorrect") {
                            currentWord.children[letterNumber].classList.remove("incorrect");
                            incorrectLetters--;
                        }
                        else if (currentWord.children[letterNumber].classList == "") {
                            incorrectLetters--;
                        }
                        else {
                            currentWord.children[letterNumber].remove();
                            incorrectLetters--;
                        }
                    }

                    //Checks if previous word is correct and that you are at the first letter of the current word and trying to go back to the correct word, so it doesnt allow you.
                    else if (checkWord(typingBox.children[wordNumber - 1]) && letterNumber == 0) {
                        return;
                    }
                    //Normal delete
                    else {
                        letterNumber--;
                        totalCharacters--;

                        //new code
                        if (letterNumber == currentWord.innerText.length - 1 && currentWord.children[letterNumber].className != "extraLetter") {
                            currentWord.children[letterNumber].removeAttribute('id');
                            if (typingBox.style.direction == ""){
                                currentWord.children[letterNumber].setAttribute('id', 'leftCursor');
                            }
                            else if (typingBox.style.direction == "rtl"){
                                currentWord.children[letterNumber].setAttribute('id', 'rightCursor');
                            }
                            
                        }

                        else if (letterNumber == currentWord.innerText.length - 1) {
                            currentWord.children[letterNumber].removeAttribute('id');
                            if (typingBox.style.direction == ""){
                                currentWord.children[letterNumber - 1].setAttribute('id', 'rightCursor');
                            }
                            else if (typingBox.style.direction == "rtl"){
                                currentWord.children[letterNumber - 1].setAttribute('id', 'leftCursor');
                            }
                            
                        }
                        else {
                            currentWord.children[letterNumber + 1].removeAttribute('id');
                            if (typingBox.style.direction == ""){
                                currentWord.children[letterNumber].setAttribute('id', 'leftCursor');
                            }
                            else if (typingBox.style.direction == "rtl"){
                                currentWord.children[letterNumber].setAttribute('id', 'rightCursor');
                            }
                        }


                        if (currentWord.children[letterNumber].classList == "correct") {
                            currentWord.children[letterNumber].classList.remove("correct");
                        }
                        else if (currentWord.children[letterNumber].classList == "incorrect") {
                            currentWord.children[letterNumber].classList.remove("incorrect");
                            incorrectLetters--;
                        }
                        else if (currentWord.children[letterNumber].classList == "") {
                            incorrectLetters--;
                        }
                        else {
                            currentWord.children[letterNumber].remove();
                            incorrectLetters--;
                        }
                    }
                }

                //Checks if player inputted the correct letter.
                else if (e.key == currentWord.innerText[letterNumber]) {
                    if (letterNumber <= currentWord.innerText.length) {
                        currentWord.children[letterNumber].classList.add("correct");
                        letterNumber++;
                        totalCharacters++;

                        //Code for visible cursor
                        if (letterNumber == currentWord.innerText.length) {
                            if (typingBox.style.direction == ""){
                                currentWord.children[letterNumber - 1].setAttribute('id', 'rightCursor');
                            }
                            else if(typingBox.style.direction == "rtl"){
                                currentWord.children[letterNumber - 1].setAttribute('id', 'leftCursor');
                            }
                        }
                        else {
                            if (typingBox.style.direction == ""){
                                currentWord.children[letterNumber].setAttribute('id', 'leftCursor');
                            }
                            else if (typingBox.style.direction == "rtl"){
                                currentWord.children[letterNumber].setAttribute('id', 'rightCursor');
                            }
                            
                            currentWord.children[letterNumber - 1].removeAttribute('id');
                        }
                    }
                }

                //Checks if player inputted the wrong letter.
                else if (e.key != currentWord.innerText[letterNumber] && isLetter(e.key)) {
                    if (letterNumber < currentWord.innerText.length) {
                        currentWord.children[letterNumber].classList.add("incorrect");

                        letterNumber++;
                        totalCharacters++;
                        incorrectLetters++;

                        //Code for visible cursor
                        if (letterNumber == currentWord.innerText.length) {
                            if (typingBox.style.direction == ""){
                                currentWord.children[letterNumber - 1].setAttribute('id', 'rightCursor');
                            }
                            else if (typingBox.style.direction == "rtl"){
                                currentWord.children[letterNumber - 1].setAttribute('id', 'leftCursor');
                            }
                            
                        }
                        else {
                            if (typingBox.style.direction == ""){
                                currentWord.children[letterNumber].setAttribute('id', 'leftCursor');
                            }
                            else if (typingBox.style.direction == "rtl"){
                                currentWord.children[letterNumber].setAttribute('id', 'rightCursor');
                            }
                            
                            currentWord.children[letterNumber - 1].removeAttribute('id');
                        }
                    }
                    //Allows user to input extra letters which are counted as incorrect characters.
                    else {
                        let extraLetter = document.createElement("letter");

                        currentWord.appendChild(extraLetter);
                        currentWord.children[letterNumber].innerText = e.key;
                        currentWord.children[letterNumber].classList.add("extraLetter");

                        letterNumber++;
                        totalCharacters++;
                        incorrectLetters++;

                        //Code for visible cursor
                        if (typingBox.style.direction == ""){
                            currentWord.children[letterNumber - 1].setAttribute('id', 'rightCursor');
                        }
                        else if (typingBox.style.direction == "rtl"){
                            currentWord.children[letterNumber - 1].setAttribute('id', 'leftCursor');
                        }
                        
                        currentWord.children[letterNumber - 2].removeAttribute('id');
                    }
                }

                //Calculates the line number of the current word's top edge by obtaining its bounding rectangle and rounding up to the nearest whole number.
                let currentLine = Math.ceil(currentWord.getBoundingClientRect().top);
                if (currentLine > secondLine){                    
                    //Hides the words on the first line if the player reaches the third line.
                    for (let i = getWordsInFirstLine(firstWordRect) - 1; i >= 0; i--){
                        typingBox.children[i].style.display = "none";
                    }
                    
                }
            }
        
    }

    //Resets the game.
    let locked = false;
    function reset(){
    
        if (!locked){
            //Locked prevents button spamming for 0.3 seconds
            locked = true;
            setTimeout(()=>{
                locked = false;
            }, 300);

            //Resets all game stats
            wordNumber = 0;
            letterNumber = 0;
            correctWords = 0;
            totalCharacters = 0;
            incorrectLetters = 0;

            //Resets timer
            countDownSec = timeSet * 60;
            clearInterval(visibleTimer);
            clearTimeout(timer);

            //Resets instructions style.
            instruction.style.color = "";
            instruction.style.animation = "";
            instruction.style.fontSize = "";
            instruction.style.fontWeight = "";
            if (typingBox.style.direction == ""){
                instruction.style.fontFamily = "";
            }
            else if (typingBox.style.direction == "rtl"){
                instruction.style.fontFamily = "'Noto Sans Arabic', sans-serif";
            }

            //Sets gameStarted false so game rules can apply all over again.
            gameStarted = false;

            //Adds animation when resetting to make it appear the typing box is changing.
            typingBox.style.animation = "fadeIn .3s ease-in";
            setTimeout(() => {
                typingBox.style.animation = "";
            }, 300);
            
            //clears typingbox and generates new words in it.
            typingBox.innerText = "";
            generateWords(wordCapacity);

            //Removes last games event listener.
            window.removeEventListener('keydown', keydownGameMechanics);

            //Starts the game, hides results, and makes everything else visible.
            startGame();
            typingBox.style.display = "";
            resultBox.style.display = "none";
            options.style.animation = "fadeIn .3s ease-in";
            options.style.display = "";
            options.style.opacity = "";
            options.style.pointerEvents = "";
            document.querySelector("footer").style.opacity = "";
            document.querySelector("footer").style.pointerEvents = "";
            document.querySelector("footer").style.animation = "fadeIn .3s ease-in";
        }
        
    }

    //Starts the game.
    function startGame() {
        currentWord = document.querySelector('.word_active');

        //Code for visible cursor.
        setTimeout(() => {
            if (typingBox.style.direction == "") {
                currentWord.children[letterNumber].setAttribute('id', 'leftCursor');
            }
            else if (typingBox.style.direction == "rtl") {
                currentWord.children[letterNumber].setAttribute('id', 'rightCursor');
            }
        }, 50);

        //Sets the starting instructions.
        instruction = document.querySelector(".startInstructions");
        if (typingBox.style.direction == "") {
            instruction.innerText = "Type the first letter to start!";
            instruction.style.fontFamily = "";
        }
        else if (typingBox.style.direction == "rtl") {
            instruction.innerText = "!اكتب الحرف الأول للبدء"
            instruction.style.fontFamily = "'Noto Sans Arabic', sans-serif";
        }
    
        setTimeout(() => {
            firstWordRect = typingBox.children[0].getBoundingClientRect();
            //Calculates the line height in the typing box by adding the height of the first word and its top and bottom margins.
            lineHeight = firstWordRect.height + parseFloat(getComputedStyle(typingBox.children[0]).margin);
            //Calculates the position of the second line by rounding up the top edge of the first word's bounding rectangle and adding twice the rounded-up lineHeight.
            secondLine = Math.ceil(firstWordRect.top) + (Math.ceil(lineHeight) * 2);
        }, 1);

        //Adds the main event listener that contains the core game mechanics.
        window.addEventListener('keydown', keydownGameMechanics);
    }

    //Returns number of words in the first line.
    function getWordsInFirstLine(firstWordRect){
        for (let i = 0; i < wordCapacity; i++){
            if (Math.ceil(typingBox.children[i].getBoundingClientRect().top) > Math.ceil(firstWordRect.top) + Math.ceil(lineHeight)){
                return i;
            }
        }
    }

    //Starts the game.
    startGame();

    //Resets game if reset button is pressed.
    document.querySelector(".reset").addEventListener('click', function (e){
        reset();
    });
    
    //Removes focus off all buttons so that the space button doesnt trigger them.
    document.querySelectorAll("button").forEach( function(item) {
        item.addEventListener('focus', function() {
            this.blur();
        })
    });
});