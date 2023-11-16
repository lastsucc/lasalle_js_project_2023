// Initialize an object to store the names of options corresponding to each score level
let scoresToOptions = {
  '4': '',
  '3': '',
  '2': '',
  '1': ''
};

// Initialize an object to store the selected state of each option
let selections = {
  question1: {  },
};

let allAnswers = {
  currentQuestion: 'question1',
  question1: {  },
};

function updateScores(selectedRadio) {
  // Get the current question
  let currentQuestion = allAnswers.currentQuestion;
  // The currently selected score
  const selectedScore = selectedRadio.value;
  // The currently selected option name
  const selectedOption = selectedRadio.name;
  // Convert the string value to a number
  const score = parseInt(selectedScore, 10);
  selections[allAnswers.currentQuestion][selectedOption] = true;

  // Check if another option has already selected this score
  if (scoresToOptions[selectedScore] !=='' && scoresToOptions[selectedScore] !== selectedOption) {
    const previousOption = scoresToOptions[selectedScore];

    // update 清空并更新之前选项的分数记录
    allAnswers[currentQuestion][previousOption] = null;
    document.querySelector(`input[name="${previousOption}"][value="${selectedScore}"]`).checked = false;
    document.getElementById(`score${selectedScore}`).textContent = '';

    // clean scoresToOptions 中的冲突记录
    scoresToOptions[selectedScore] = '';
  }
  // update scoresToOptions 和 allAnswers
  scoresToOptions[selectedScore] = selectedOption;
  allAnswers[currentQuestion][selectedOption] = score;

  // Clear and update the table display
  clearTable();
  for (const option in allAnswers[currentQuestion]) {
    const score = allAnswers[currentQuestion][option];
    if (score) {
      const optionText = document.querySelector(`#${currentQuestion} label[for="${option}"]`).textContent;
      document.getElementById(`score${score}`).textContent = optionText;
    }
  }

  // Check if all options have been selected
  checkAllSelected();
}

function checkAllSelected() {
  // Check if each option has been selected
  let allSelected = true;
  let count = 0 ;
  for (const option of Object.keys(selections[allAnswers.currentQuestion])) {
    count++;
    if (!document.querySelector(`input[name="${option}"]:checked`)) {
      allSelected = false;
      break;
    }
  }  
  
  // If all options have been selected, enable the “Next” button
  document.getElementById('nextButton').disabled = (count!==4);
}

function submitForm() {
  // Store the current question's answer
  saveCurrentAnswers(allAnswers.currentQuestion);

  // Clear the table
  clearTable();

  // Toggle the visibility of the question
  toggleQuestionsVisibility();

  // Prepare for the next question
  prepareNextQuestion(allAnswers.currentQuestion);
}

function saveCurrentAnswers(questionId) {
  let questionAnswers = allAnswers[questionId];
  for (const option in questionAnswers) {
    questionAnswers[option] = document.querySelector(`input[name="${option}"]:checked`)?.value || null;
  }
}

function clearTable() {
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`score${i}`).textContent = '';
  }
}

function toggleQuestionsVisibility() {
    // Extract the numeric identifier of the current question
      const currentNumber = parseInt(allAnswers.currentQuestion.replace('question', ''));

        // Hide the current question
      const currentQuestionDiv = document.getElementById(allAnswers.currentQuestion);
      if (currentQuestionDiv) {
        currentQuestionDiv.classList.add('hidden');
      }

      // Calculate the identifier of the next question
    const nextNumber = currentNumber + 1;
    allAnswers.currentQuestion = `question${nextNumber}`;

    if(nextNumber>=4)
    {
        // Display the results table
      const resultsTable = document.getElementById('resultsTable');
      resultsTable.classList.remove('hidden');
      const button = document.getElementById('nextButton');
      button.classList.add('hidden');
      const Scores = document.getElementById('Scores');
      Scores.classList.add('hidden');
      displayResults();
      fillTotalResults();
    }
    else{
      // Display the next question
      const nextQuestionDiv = document.getElementById(allAnswers.currentQuestion);
      nextQuestionDiv.classList.remove('hidden');  
    }
}

function prepareNextQuestion(nextQuestionId) {
  // Reset the state for the next question, if needed
  // For example, reset the selection of the radio buttons
   // Reset scoresToOptions for the next question
   scoresToOptions = { '4': '', '3': '', '2': '', '1': '' };
   selections[nextQuestionId] = {};
   allAnswers[nextQuestionId] = {};
   const options = document.querySelectorAll(`#${nextQuestionId} input[type="radio"]`);
    options.forEach(option => {
    selections[nextQuestionId][option.name] = false;
    allAnswers[nextQuestionId][option.name] = null;
    option.checked = false; // Reset the selection state of the option
  });
   // Reset the “Next” button
  document.getElementById('nextButton').disabled = true;
}

function updateCurrentQuestion() {
  const questions = document.querySelectorAll('.question');
  for (let question of questions) {
    if (!question.classList.contains('hidden')) {
      allAnswers.currentQuestion = question.id;
      break;
    }
  }
}

// Disable the “Next” button on page load
window.onload = function() {
  document.getElementById('nextButton').disabled = true;
}

function displayResults() {
  // Initialize the total scores for each column, ensuring the initial value is 0
  let totals = { 1: 0, 2: 0, 3: 0, 4: 0 };

  // Traverse the allAnswers object, except for 'currentQuestion'
  for (const [question, answers] of Object.entries(allAnswers)) {
    if (question !== 'currentQuestion') {
      // Fill each question's row in the table
      const resultRow = document.getElementById(`resultRow${question.replace('question', '')}`);
      if (resultRow) {
        let columnIndex = 1; // Starting from the second column, the first column is the question number
        for (const [option, score] of Object.entries(answers)) {
          const cell = resultRow.cells[columnIndex];
          if (score) {
            cell.textContent = score; // If there is an answer, display the answer
            // Add to the total score, ensuring to add only when the score is a number
            const parsedScore = parseInt(score, 10); // Use base 10 to avoid octal interpretation
            if (!isNaN(parsedScore)) {
              const optionLetter = option.slice(-1); // Get the last character
              totals[optionLetter] += parsedScore;
            }
          } else {
            cell.textContent = ''; // If there is no answer, leave it as an empty string
          }
          columnIndex++;
        }
      }
    }
  }

  // Fill the total row
  const totalRow = document.getElementById('resultRowTotal');
  if (totalRow) {
    let totalColumnIndex = 1; // Starting from the second column
    for (const total of Object.values(totals)) {
      totalRow.cells[totalColumnIndex].textContent = total;
      totalColumnIndex++;
    }
  }

  // Fill in the corresponding results based on the totals
  document.getElementById('resultOrange').textContent = totals['1'];
  document.getElementById('resultGreen').textContent = totals['2'];
  document.getElementById('resultBlue').textContent = totals['3'];
  document.getElementById('resultGold').textContent = totals['4'];

let colors = {1:'Orange' , 2:'Green' , 3:'Blue' , 4:'Gold'}
   // Convert the totals object into an array and sort it
  const sortedTotals = Object.entries(totals).sort((a, b) => b[1] - a[1]);
   // Get the top two scoring colors
  const topColor = colors[sortedTotals[0][0]]; // Highest scoring color
  const secondTopColor = colors[sortedTotals[1][0]]; // Second highest scoring color
    // Display on the page
  document.getElementById('firstColorResult').textContent = topColor;
  document.getElementById('secondColorResult').textContent = secondTopColor;

}
