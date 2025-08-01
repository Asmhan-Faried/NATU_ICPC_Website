const questions = [
  {
    question: "What is the output?",
    code: "int arr[3] = {1, 2, 3};\ncout << 2[arr];",
    answer: "1\n\n2\n\n3\n\nError",
    correctAnswer: "3"
  },
  {
    question: "What is printed?",
    code: "int a = 5;\nif ((a & 1) && !(a % 2 == 0))\n    cout << \"Odd\";\nelse\n    cout << \"Even\";",
    answer: "Odd\n\nEven\n\nError\n\n5",
    correctAnswer: "Odd"
  },
  {
    question: "What will this output?",
    code: "int x = 3;\nx = ++x + x++;\ncout << x;",
    answer: "7\n\n8\n\n9\n\n10",
    correctAnswer: "9"
  },
  {
    question: "Result?",
    code: "int a = 3, b = 4;\nif ((a * b) % (a + b) == 0)\n    cout << \"Yes\";\nelse\n    cout << \"No\";",
    answer: "Yes\n\nNo\n\nError\n\n12",
    correctAnswer: "Yes"
  },
  {
    question: "What is the result?",
    code: "int a = 2, b = 3;\ncout << pow(a, b);",
    answer: "6\n\n9\n\n8\n\nCompile error",
    correctAnswer: "8"
  },
  {
    question: "What’s the output?",
    code: "int i = 0, j = 0;\nfor (; i < 3 && j < 3; i++, j++)\n    cout << i + j;",
    answer: "036\n\n03\n\n012\n\n024",
    correctAnswer: "024"
  },
  {
    question: "Find the output:",
    code: "int x = 2;\nx += x++ + ++x;\ncout << x;",
    answer: "6\n\n7\n\n8\n\n9",
    correctAnswer: "9"
  },
  {
    question: "What does this return?",
    code: "int f(int x) {\n    if (x == 1) return 1;\n    return f(x - 1) + x;\n}\ncout << f(4);",
    answer: "6\n\n7\n\n8\n\n10",
    correctAnswer: "10"
  },
  {
    question: "What is the output?",
    code: "int a = 5;\ncout << (a << 1);",
    answer: "5\n\n10\n\n6\n\n7",
    correctAnswer: "10"
  },
  {
    question: "Output of this loop?",
    code: "for (int i = 1; i < 10; i *= 2)\n    cout << i;",
    answer: "1234\n\n1248\n\n12345678\n\nInfinite",
    correctAnswer: "1248"
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