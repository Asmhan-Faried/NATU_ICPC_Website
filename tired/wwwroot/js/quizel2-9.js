const questions = [
    {
        question: "What’s the time complexity of inserting n elements into an empty priority_queue using push()?",
        code: "",
        answer: "O(n)\n\nO(n log n)\n\nO(n^2)\n\nO(log n)",
        correctAnswer: "O(n log n)"
    },
    {
        question: "Which of the following sort algorithms is in-place but not stable?",
        code: "",
        answer: "Merge Sort\n\nInsertion Sort\n\nQuick Sort\n\nBubble Sort",
        correctAnswer: "Quick Sort"
    },
    {
        question: "Given std::set<int> s, what is the complexity of s.upper_bound(x)?",
        code: "",
        answer: "O(1)\n\nO(log n)\n\nO(n)\n\nO(n log n)",
        correctAnswer: "O(log n)"
    },
    {
        question: "Which data structure is ideal for coordinate compression with efficient queries?",
        code: "",
        answer: "vector\n\nunordered_map\n\nset\n\nmap",
        correctAnswer: "map"
    },
    {
        question: "Why is priority_queue<int, vector<int>, greater<int>> called a min-heap?",
        code: "",
        answer: "It sorts the vector\n\nIt stores minimum on top\n\nIt uses merge sort\n\nIt only allows descending values",
        correctAnswer: "It stores minimum on top"
    },
    {
        question: "How many elements can a map have with keys 10⁹ in coordinate compression?",
        code: "",
        answer: "10⁹\n\n~10⁵\n\nDepends on values\n\nO(log n)",
        correctAnswer: "~10⁵"
    },
    {
        question: "In C++, what happens if two keys in map<int, int> have the same key?",
        code: "",
        answer: "Error\n\nKeeps both\n\nLast overwrites\n\nRandom overwrite",
        correctAnswer: "Last overwrites"
    },
    {
        question: "What is the complexity of sort(v.begin(), v.end(), cmp) where cmp is a lambda?",
        code: "",
        answer: "O(n^2)\n\nO(n)\n\nO(n log n)\n\nDepends on cmp",
        correctAnswer: "O(n log n)"
    },
    {
        question: "Which of these best describes prefix sum + frequency array together?",
        code: "",
        answer: "Optimization for loops\n\nCounting subarrays efficiently\n\nSorting vectors\n\nAvoiding if-statements",
        correctAnswer: "Counting subarrays efficiently"
    },
    {
        question: "Which STL container is best for finding k-th smallest element in O(log n)?",
        code: "",
        answer: "set\n\nmultiset\n\nordered_set (with order-statistics)\n\npriority_queue",
        correctAnswer: "ordered_set (with order-statistics)"
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