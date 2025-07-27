const questions = [
    {
        question: "What will this return?",
        code: "int sum(int n) {\n    if (n == 1) return 1;\n    return n + sum(n - 1);\n}\ncout << sum(3);",
        answer: "3\n\n4\n\n5\n\n6",
        correctAnswer: "6"
    },
    {
        question: "Recursive function must have:",
        code: "",
        answer: "For loop\n\nBase case\n\nGlobal variable\n\nArray",
        correctAnswer: "Base case"
    },
    {
        question: "What is the output?",
        code: "int fun(int n) {\n    if (n == 0) return 0;\n    return 1 + fun(n - 1);\n}\ncout << fun(3);",
        answer: "3\n\n2\n\n1\n\n0",
        correctAnswer: "3"
    },
    {
        question: "What will happen if there is no base case?",
        code: "",
        answer: "Function runs once\n\nFunction ends early\n\nInfinite recursion\n\nCompile error",
        correctAnswer: "Infinite recursion"
    },
    {
        question: "What does a % b give?",
        code: "",
        answer: "Division\n\nMultiplication\n\nRemainder\n\nQuotient",
        correctAnswer: "Remainder"
    },
    {
        question: "What is the output?",
        code: "cout << 5 / 2;",
        answer: "2.5\n\n2\n\n3\n\nError",
        correctAnswer: "2"
    },
    {
        question: "What will this print?",
        code: "int a = 3;\nint b = 4;\ncout << a * b;",
        answer: "7\n\n12\n\n1\n\nError",
        correctAnswer: "12"
    },
    {
        question: "What is the perimeter of a square with side = 5?",
        code: "",
        answer: "10\n\n20\n\n25\n\n5",
        correctAnswer: "20"
    },
    {
        question: "Which formula gives area of circle?",
        code: "",
        answer: "π * r\n\nπ * r^2\n\n2 * π * r\n\nπ + r",
        correctAnswer: "π * r^2"
    },
    {
        question: "Which one calculates GCD correctly?",
        code: "while (b != 0) { int temp = b; b = a % b; a = temp; }",
        answer: "while (b != 0) swap(a, b)\n\nwhile (b != 0) { int temp = b; b = a % b; a = temp; }\n\nGCD = a * b\n\nreturn a + b",
        correctAnswer: "while (b != 0) { int temp = b; b = a % b; a = temp; }"
    }
];

let currentIndex = 0;
let isSubmitted = false;
const questionCounter = document.getElementById("question-counter");
const questionText = document.getElementById("question-text");
const answerText = document.getElementById("answer-text");

let userAnswers = JSON.parse(localStorage.getItem('quizAnswers')) || {};

function updateCard() {
    console.log("Updating card for question index:", currentIndex);
    questionCounter.textContent = `${currentIndex + 1} / ${questions.length}`;

    let formattedQuestion = `<h2 style="text-align: center;">${questions[currentIndex].question}</h2>`;
    formattedQuestion += `<pre style="">${questions[currentIndex].code}</pre>`;

    questionText.innerHTML = formattedQuestion;

    let answers = questions[currentIndex].answer.split("\n\n");
    let formattedAnswers = `<form id="answerForm">`;
    
    answers.forEach((answer, index) => {
        const isChecked = userAnswers[currentIndex] === answer.trim() ? 'checked' : '';
        formattedAnswers += `
            <label>
                <input type="checkbox" name="answer" class="answer-checkbox" onclick="handleCheckboxClick(this)" ${isChecked}>
                <span>${answer}</span>
            </label>
        `;
    });

    formattedAnswers += `</form>`;
    answerText.innerHTML = formattedAnswers;
    document.getElementById('flashcard-inner').style.transform = 'rotateY(0deg)';

    if (isSubmitted && userAnswers[currentIndex]) {
        const checkboxes = document.querySelectorAll(".answer-checkbox");
        checkboxes.forEach(checkbox => {
            const answerText = checkbox.nextElementSibling.textContent.trim();
            checkbox.classList.remove('checkbox-wrong', 'checkbox-correct');
            if (userAnswers[currentIndex] === answerText && answerText !== questions[currentIndex].correctAnswer) {
                checkbox.classList.add('checkbox-wrong');
            }
            if (answerText === questions[currentIndex].correctAnswer) {
                checkbox.classList.add('checkbox-correct');
            }
        });
    }
}

function handleCheckboxClick(clickedCheckbox) {
    console.log("Checkbox clicked:", clickedCheckbox.nextElementSibling.textContent.trim());
    let checkboxes = document.querySelectorAll(".answer-checkbox");
    const answerText = clickedCheckbox.nextElementSibling.textContent.trim();

    if (clickedCheckbox.checked) {
        checkboxes.forEach(checkbox => {
            if (checkbox !== clickedCheckbox) {
                checkbox.checked = false;
            }
        });
        userAnswers[currentIndex] = answerText;
    } else {
        delete userAnswers[currentIndex];
    }

    localStorage.setItem('quizAnswers', JSON.stringify(userAnswers));
}

function updateFontSize() {
    const preElement = document.querySelector("pre");
    if (window.innerWidth <= 480) {
        preElement.style.fontSize = "11px";
    } else {
        preElement.style.fontSize = "16px";
    }
}

function updateH2FontSize() {
    const h2Elements = document.querySelectorAll("h2");
    h2Elements.forEach(h2 => {
        if (window.innerWidth <= 480) {
            h2.style.fontSize = "14px";
        } else {
            h2.style.fontSize = "22px";
        }
    });
}

function flipCard() {
    const flashcardInner = document.getElementById('flashcard-inner');
    if (!event.target.closest("#answerForm")) {
        flashcardInner.style.transform = flashcardInner.style.transform === 'rotateY(180deg)' ? 'rotateY(0deg)' : 'rotateY(180deg)';
    }
}

function nextQuestion() {
    if (currentIndex < questions.length - 1) {
        currentIndex++;
        updateCard();
    }
}

function previousQuestion() {
    if (currentIndex > 0) {
        currentIndex--;
        updateCard();
    }
}

function submitQuiz() {
    console.log("Submit button clicked. Current answers:", userAnswers);
    if (!userAnswers[currentIndex]) {
        console.log("No answer selected, showing no-answer-popup");
        document.getElementById("no-answer-popup").style.display = "flex";
        return;
    }

    isSubmitted = true;
    let score = 0;
    questions.forEach((question, index) => {
        if (userAnswers[index] === question.correctAnswer) {
            score++;
        }
    });

    if (userAnswers[currentIndex]) {
        const checkboxes = document.querySelectorAll(".answer-checkbox");
        checkboxes.forEach(checkbox => {
            const answerText = checkbox.nextElementSibling.textContent.trim();
            checkbox.classList.remove('checkbox-wrong', 'checkbox-correct');
            if (userAnswers[currentIndex] === answerText && answerText !== questions[currentIndex].correctAnswer) {
                checkbox.classList.add('checkbox-wrong');
            }
            if (answerText === questions[currentIndex].correctAnswer) {
                checkbox.classList.add('checkbox-correct');
            }
        });
    }

    let scoreCircle = document.getElementById("score-circle");
    let scoreText = document.getElementById("score-text");

    const existingExcellentText = document.querySelector('.excellent-text');
    if (existingExcellentText) {
        existingExcellentText.remove();
    }

    if (score === 10) {
        scoreCircle.style.borderColor = "#2ecc71";
        scoreText.textContent = `${score} / ${questions.length}`;
        
        const excellentText = document.createElement('div');
        excellentText.className = 'excellent-text';
        excellentText.style.color = "#2ecc71";
        excellentText.style.fontSize = "28px";
        excellentText.style.fontWeight = "bold";
        excellentText.style.margin = "10px 0";
        excellentText.textContent = "Excellent!";
        
        const popupContent = document.querySelector('#score-popup .popup-content');
        popupContent.insertBefore(excellentText, document.querySelector('#score-popup .popup-content button'));
    } else if (score <= 5) {
        scoreCircle.style.borderColor = "red";
        scoreText.textContent = `${score} / ${questions.length}`;
    } else if (score <= 8) {
        scoreCircle.style.borderColor = "blue";
        scoreText.textContent = `${score} / ${questions.length}`;
    } else {
        scoreCircle.style.borderColor = "green";
        scoreText.textContent = `${score} / ${questions.length}`;
    }

    console.log("Showing score popup with score:", score);
    document.getElementById("score-popup").style.display = "flex";
}

function closeScorePopup() {
    console.log("Closing score popup");
    document.getElementById("score-popup").style.display = "none";
}

function closeNoAnswerPopup() {
    console.log("Closing no-answer popup");
    document.getElementById("no-answer-popup").style.display = "none";
}

function resetQuiz() {
    console.log("Resetting quiz");
    localStorage.removeItem('quizAnswers');
    userAnswers = {};
    isSubmitted = false;
    currentIndex = 0;
    updateCard();
}

document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById("submit-btn");
    if (submitBtn) {
        submitBtn.addEventListener("click", () => {
            console.log("Submit button event listener triggered");
            submitQuiz();
        });
    } else {
        console.error("Submit button not found!");
    }

    const resetBtn = document.getElementById("reset-btn");
    if (resetBtn) {
        resetBtn.addEventListener("click", resetQuiz);
    } else {
        console.error("Reset button not found!");
    }
});

window.addEventListener("resize", updateFontSize);
window.addEventListener("load", updateFontSize);
window.addEventListener("resize", updateH2FontSize);
window.addEventListener("load", updateH2FontSize);
window.onload = updateCard;