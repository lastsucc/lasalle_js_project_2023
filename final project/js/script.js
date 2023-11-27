const questions = document.querySelectorAll('.question');
const resultSection = document.getElementById('result');
const resultColor = document.getElementById('result-color');

let answers = {};

// Function to move to the next question
function nextQuestion(nextQuestionId) {
  const currentQuestion = Array.from(questions).find(q => !q.classList.contains('hidden'));
  console.log(currentQuestion)

  if (currentQuestion) {
    const currentQuestionId = currentQuestion.getAttribute('id');
    const selectedAnswer = currentQuestion.querySelector('input:checked');
    
    if (selectedAnswer) {
      answers[currentQuestionId] = selectedAnswer.value;
    }

    currentQuestion.classList.add('hidden');
  }

  const nextQuestion = document.getElementById(nextQuestionId);
  if (nextQuestion) {
    nextQuestion.classList.remove('hidden');
  } else {
    // All questions answered, calculate and display the result
    resultSection.classList.remove('hidden');
    displayResult();
  }
}

function displayResult() {
  // Calculate the result based on the answers in the 'answers' object
  // You can implement your own logic for calculating the result
  // In this example, we simply display the answers in the result
  let resultText = '';
  for (const questionId in answers) {
    // resultText += `Question ${questionId}: ${answers[questionId]}` + '\n';
    updateTable(`${questionId}`,`${answers[questionId]}`)

  }
  updateTotals();
  // resultColor.textContent = resultText;
}

function updateTable(questionId, answer) {
  const cell = document.getElementById(questionId + answer);
  if (cell) {
    cell.textContent = '✓'; 
  }
}

function updateTotals() {
    // const questions = ['question1', 'question2', 'question3']; // 添加更多题目的ID
    const options = ['a', 'b', 'c', 'd'];
    var countarray = {
            a: 0,
            b: 0,
            c: 0,
            d: 0
        };

    for (const questionId in answers) {
        
        // const count = document.querySelectorAll(`input[name="${question}"][value="${option}"]:checked`).length;
        countarray[`${answers[questionId]}`] +=1
    }
    for (const option of options) {
        const total = document.getElementById(`total${option}`);
        total.textContent = countarray[option];    
    }

    const colorMapping = {
    a: 'Orange',
    b: 'Green',
    c: 'Blue',
    d: 'Gold'
};

        let favoriteColor = '';
        let secondFavoriteColor = '';

        for (const option in countarray) {
            if (favoriteColor === '' || countarray[option] > countarray[favoriteColor]) {
                secondFavoriteColor = favoriteColor;
                favoriteColor = option; 
            } else if (secondFavoriteColor === '' || countarray[option] > countarray[secondFavoriteColor]) {
                secondFavoriteColor = option; 
            }
        }

        const firstColorResult = document.getElementById('firstColorResult');
        const secondColorResult = document.getElementById('secondColorResult');

        if (favoriteColor && secondFavoriteColor) {
            firstColorResult.textContent = `Your favorite color is ${colorMapping[favoriteColor]}.`;
            secondColorResult.textContent = `Your second favorite color is ${colorMapping[secondFavoriteColor]}.`;
        } else {
            firstColorResult.textContent = 'Unable to determine your favorite color.';
            secondColorResult.textContent = 'Unable to determine your second favorite color.';
        }


}

var slidePosition = 0;
SlideShow();


function SlideShow() {
  var i;
  var slides = document.getElementsByClassName("Containers");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slidePosition++;
  if (slidePosition > slides.length) {slidePosition = 1}
  slides[slidePosition-1].style.display = "block";
  setTimeout(SlideShow, 3500); // Change image every 2 seconds
} 

// Formulary code

function submitForm() {
  // Assuming you want to validate the form data before submission
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var message = document.getElementById("message").value;

  if (name && email && message) {
    // You can replace this with your own logic for form submission
    alert("Form submitted successfully!");
    document.getElementById("contact-form").reset();
  } else {
    alert("Please fill out all fields.");
  }
}


// Login Script

function generatePassword() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }
  document.getElementById('generated-password').textContent = `Generated Password: ${password}`;
}

document.getElementById('authForm').addEventListener('submit', function (event) {
  event.preventDefault();

  // Add your authentication logic here
  const enteredPassword = document.getElementById('password').value;
  const generatedPassword = document.getElementById('generated-password').textContent.split(': ')[1].trim();

// For demonstration purposes, check if the entered password matches the generated one
if (enteredPassword === generatedPassword) {
  // Redirect to the other page
  window.location.href = 'index.html';
} else {
  // For demonstration purposes, just log a message
  console.log('Incorrect password. Please try again.');
}
});

