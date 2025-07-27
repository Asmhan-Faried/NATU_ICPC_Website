const questions = [
    {
        question: "What is the output of this code?",
        code: "int main() {\n    int x = 7;\n    cout << x;\n    return 0;\n}",
        answer: "7\n\n0\n\nUndefined\n\nError",
        correctAnswer: "7"
    },
    {
        question: "Which keyword is used to declare a constant variable in C++?",
        code: "",
        answer: "static\n\nconst\n\nfinal\n\ndefine",
        correctAnswer: "const"
    },
    {
        question: "What is the output of this code?",
        code: "int main() {\n    int a = 5, b = 10;\n    a = b;\n    cout << a;\n    return 0;\n}",
        answer: "5\n\n10\n\n0\n\nUndefined",
        correctAnswer: "10"
    },
    {
        question: "What does the sizeof operator return for an int variable?",
        code: "",
        answer: "2\n\n4\n\n8\n\nDepends on the system",
        correctAnswer: "Depends on the system"
    },
    {
        question: "What is the default value of an uninitialized static variable in C++?",
        code: "",
        answer: "0\n\nUndefined\n\nGarbage\n\nNull",
        correctAnswer: "0"
    },
    {
        question: "What is the output of this code?",
        code: "int main() {\n    int x = 3, y = 4;\n    cout << (x * y);\n    return 0;\n}",
        answer: "7\n\n12\n\n1\n\n34",
        correctAnswer: "12"
    },
    {
        question: "What is the output of this code?",
        code: "int main() {\n    int n = 5;\n    while (n > 2) {\n        cout << n << \" \";\n        n--;\n    }\n    return 0;\n}",
        answer: "5 4 3\n\n5 4\n\n3 4 5\n\n2 3 4",
        correctAnswer: "5 4 3"
    },
    {
        question: "What is the value of result after this code executes?",
        code: "int main() {\n    int result = 0;\n    for (int i = 2; i <= 4; i++) {\n        result += i * 2;\n    }\n    cout << result;\n    return 0;\n}",
        answer: "6\n\n12\n\n18\n\n24",
        correctAnswer: "18"
    },
    {
        question: "What is the output of this code?",
        code: "int power(int base, int exp) {\n    if (exp == 0) return 1;\n    return base * power(base, exp - 1);\n}\n\nint main() {\n    cout << power(2, 3);\n    return 0;\n}",
        answer: "2\n\n4\n\n6\n\n8",
        correctAnswer: "8"
    },
    {
        question: "What is the output of this code?",
        code: "int main() {\n    int arr[] = {4, 2, 8, 1, 6};\n    int min = arr[0];\n    for (int i = 1; i < 5; i++) {\n        if (arr[i] < min) min = arr[i];\n    }\n    cout << min;\n    return 0;\n}",
        answer: "1\n\n2\n\n4\n\n6",
        correctAnswer: "1"
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
    formattedQuestion += `<pre style="";">${questions[currentIndex].code}</pre>`;

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