// Select Element 
let countSpan = document.querySelector('.quiz-info .count span');
let bulletsSpanContainer = document.querySelector('.bullets .spans');
let quizArea = document.querySelector('.quiz-area');
let answerArea = document.querySelector('.answers-area');
let submitButton = document.querySelector('.submit-button');
let bullets = document.querySelector('.bullets');
let resultsContainer = document.querySelector('.results');
let countdownElement = document.querySelector('.countdown');

// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;

// Bring The JSON File By Ajax
function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            let qCount =   questionsObject.length;

            // Create Bullets + Set Question Count
            createBullets(qCount);
            // Add Question Data
            addQuestionData(questionsObject[currentIndex], qCount);
            // Start CountDown    
            countDown(60, qCount);
            // Click On Submit
            submitButton.onclick = () => {
                // Get Right Answer
                let theRightAnswer = questionsObject[currentIndex].right_answer;

                // Increase Index
                currentIndex++;

                // Check the Answer
                checkAnswer(theRightAnswer, qCount);

                // Remove Previos Question
                quizArea.innerHTML = '';
                answerArea.innerHTML = '';

                // Add Question Data
                addQuestionData(questionsObject[currentIndex], qCount);

                // Handle Bullets Class
                handleBullets();
                // Start CountDown    
                clearInterval(countDownInterval);
                countDown(60, qCount);

                // Show results
                showResults(qCount);
                console.log(currentIndex);
                console.log(qCount);
            }
        }
    }

    myRequest.open("GET", "Html_questions.json", true);
    myRequest.send();
}
getQuestions();

function createBullets(num) {
    countSpan.innerHTML = num

    // Create Spans 
    for (let i = 0 ; i < num ; i++) {
        // Create span
        let theBullet = document.createElement('span');
        // Chek if Its First Span
        if (i === 0 ) {
            theBullet.className = 'on';
        }
        // Append Bullets To Main Bullest Container
        bulletsSpanContainer.appendChild(theBullet);
    }
}

function addQuestionData(obj, count) {
    if (currentIndex < count) {
        // Create H2 Question
    let questionTitle = document.createElement('h2');

    // Create Question Text
    let questionText = document.createTextNode(obj.title);

    // Append Text To h2
    questionTitle.appendChild(questionText);

    // Append the title to quiz area
    quizArea.appendChild(questionTitle);

    // Create The Answers
    for (let i = 1 ; i <= 4 ; i++ ) {
        // Create Main Answer Div
        let mainDiv = document.createElement('div');

        // Add Class To main Div
        mainDiv.className = 'answer';

        // Creat Radio Input
        let radioInput = document.createElement('input');
        // Add Type + Name + Id + Data Attribute
        radioInput.name = 'question'
        radioInput.type = 'radio';
        radioInput.id = `answer_${i}`
        radioInput.dataset.answer = obj[`answer_${i}`];

        // Make First Option Checkd
        if (i === 1 ) {
            radioInput.checked = true;
        }

        // Create Labl
        let theLabl = document.createElement('label');

        // Add For Attribute
        theLabl.htmlFor = `answer_${i}`;

        // Create Label Text
        let theLablText = document.createTextNode(obj[`answer_${i}`]);

        // Add The Text To Lable
        theLabl.appendChild(theLablText);

        // Append Tnput + Label To Mian Div 
        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabl);

        // Append The MianDiv To Quiz Area
        answerArea.appendChild(mainDiv);
    }

    }
}


function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName('question');
    let theChoosenAnswer;
    for (let i = 0 ; i < answers.length ; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }

    if (rAnswer === theChoosenAnswer) {
        rightAnswers++;
    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll('.bullets .spans span');
    let arrayOfSpan = Array.from(bulletsSpans)
    arrayOfSpan.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = 'on';
        }
    })
}

function showResults(count) {
    let theresults;
    if (currentIndex === count) {
        quizArea.remove();
        answerArea.remove();
        submitButton.remove();
        bullets.remove();

        if (rightAnswers > (count / 2) && rightAnswers < count) {
            theresults = `<span class='good'>Good</span>, ${rightAnswers} From ${count} Is Good`
        } else if (rightAnswers === count) {
            theresults = `<span class='perfect'>Perfect</span>, All Answers Is Right `
        } else {
            theresults = `<span class='bad'>Bad</span>, ${rightAnswers} From ${count} Is Bad`
        }
        resultsContainer.innerHTML = theresults;
        resultsContainer.style.padding = '10px';
        resultsContainer.style.backgroundColor = 'white';
        resultsContainer.style.marginTop = '10px';
    }
}

function countDown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countDownInterval = setInterval(function () {
            // لكتابة الوقت  بالشكل الصحيح
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            // Adding Zero befor the Number Wich smaller Than 10
            minutes = minutes < 10 ? `0${minutes}`: `${minutes}`;
            seconds = seconds < 10 ? `0${seconds}`: `${seconds}`;
            // Add Minuts and Seconds to The page
            countdownElement.innerHTML = `${minutes}:${seconds}`;
            if (--duration < 0) {
                clearInterval(countDownInterval);
                submitButton.click();
            }

        }, 1000)
    }
}