const questions = [
    { 
        question: "What will be the output of the following C++ code?", 
        code: "int main() {\n    int x = 5;\n    cout << x++ << \" \" << ++x;\n    return 0;\n}", 
        answer: "5 6\n\n5 7\n\n6 7\n\n6 6", 
        correctAnswer: "5 7" 
    },
    
    { 
        question: "What is the output of the following code?", 
        code: "int main() {\n    int a = 10, b = 20;\n    cout << ((a > b) ? a : b);\n    return 0;\n}", 
        answer: "10\n\n20\n\n0\n\nCompilation Error", 
        correctAnswer: "20" 
    },
    
    { 
        question: "How many times will 'Hello' be printed?", 
        code: "int main() {\n    for (int i = 0; i < 5; i += 2) {\n        cout << \"Hello\" << endl;\n    }\n    return 0;\n}", 
        answer: "5\n\n3\n\n2\n\nInfinite", 
        correctAnswer: "3" 
    },
    
    { 
        question: "What will be the output of the following code?", 
        code: "int main() {\n    int arr[] = {10, 20, 30, 40, 50};\n    cout << arr[3];\n    return 0;\n}", 
        answer: "10\n\n20\n\n30\n\n40", 
        correctAnswer: "40" 
    },
    
    { 
        question: "What will be the output of the following code?", 
        code: "int main() {\n    string s = \"ICPC\";\n    s += \" Community\";\n    cout << s;\n    return 0;\n}", 
        answer: "ICPC Community\n\nICPCCommunity\n\nCommunity\n\nError", 
        correctAnswer: "ICPC Community" 
    },
    
    { 
        question: "What does this function return for fibonacci(6)?", 
        code: "int fibonacci(int n) {\n    if (n <= 1) return n;\n    return fibonacci(n - 1) + fibonacci(n - 2);\n}", 
        answer: "6\n\n8\n\n13\n\n5", 
        correctAnswer: "8" 
    },
    
    { 
        question: "What will be the output?", 
        code: "int main() {\n    int a = 10;\n    int *p = &a;\n    cout << *p;\n    return 0;\n}", 
        answer: "Memory address of a\n\n10\n\nGarbage Value\n\nError", 
        correctAnswer: "10" 
    },
    
    { 
        question: "Implement a recursive function to calculate factorial of a number n.", 
        code: "int factorial(int n) {\n    if (n == 0) return 1;\n    return n * factorial(n - 1);\n}", 
        answer: "4\n\n6\n\n24\n\n120", 
        correctAnswer: "24" 
    },
    
    { 
        question: "Given an array of integers, find the largest element in the array.", 
        code: "int findMax(int arr[], int n) {\n    int maxVal = arr[0];\n    for (int i = 1; i < n; i++) {\n        if (arr[i] > maxVal) maxVal = arr[i];\n    }\n    return maxVal;\n}", 
        answer: "2\n\n3\n\n7\n\n9", 
        correctAnswer: "9" 
    },
    
    { 
        question: "Given an array of n numbers, find the second largest element.", 
        code: "int secondLargest(int arr[], int n) {\n    int first = INT_MIN, second = INT_MIN;\n    for (int i = 0; i < n; i++) {\n        if (arr[i] > first) {\n            second = first;\n            first = arr[i];\n        } else if (arr[i] > second && arr[i] != first) {\n            second = arr[i];\n        }\n    }\n    return second;\n}", 
        answer: "8\n\n18\n\n20\n\n25", 
        correctAnswer: "18" 
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
        preElement.style.fontSize = "20px";
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