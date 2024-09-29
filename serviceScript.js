//EDITION ONE CODE

// CONFIG: put this in another file or something?
const OLLAMA_HOST = "http://127.0.0.1:11434";
const OLLAMA_MODEL = "llama3:latest";
const OLLAMA_SYSTEM_PROMPT = `
  You are QuestionGenie, a tool that generates practice problems and explanations for students.

  You must provide all responses in JSON format.

  There are two types of requests you can make to the API: explanations and problems.

  When generating a "problem", the following fields are required:
  - question: a string representing the question to ask the user
  - choices: an array of 4 strings representing the choices for the user to select from
  - answer: an integer representing the index of the correct answer in the choices array

  When generating an "explanation", the following fields are required:
  - explanation: a string representing an explanation of the given concept
  - exampleProblem: a JSON object representing an example problem, with the same fields as a "problem"
  - exampleExplanation: a string representing the explanation to solving the example problem

  When given a prompt, you must initially only generate an explanation using the format for an "explanation".
  However, if previous context is provided, you must use it to generate a problem with the format for a "problem".
`;

let userRequest; //from search bar

//from API:
let explanation;
let exampleProblem;
let exampleExplanation;
let practiceProblem;
let question;
let answer; //correct answer
let radioA;
let radioB;
let radioC;
let radioD; //four fake answers
let correctID;

//submitButton onclick function, populates userRequest
async function search() {
  userRequest = document.getElementById("user-search").value; //get userRequest from the search bar
  print("Generating response, please wait...", "ai-status");
  await api();
  publish();
  print("", "ai-status");
}

async function ollamaRequest(prompt, previousContext = null) {
  const GENERATE_URL = `${OLLAMA_HOST}/api/generate`;
  return fetch(GENERATE_URL, {
    method: "POST",
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt: prompt,
      format: "json",
      stream: false, // TODO: make this true
      system: OLLAMA_SYSTEM_PROMPT,
      context: previousContext,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Unable to fetch data:", error);
      return null;
    });
}

//takes userRequest and transforms it into explanation, exampleProblem, and practiceProblem
async function api() {
  var data = await ollamaRequest(userRequest);
  console.log(data);
  var response = data.response;
  var responseJSON;
  try {
    responseJSON = JSON.parse(response);
  } catch (e) {
    console.error("AI did not provide a valid JSON response:", response);
    return;
  }

  // TODO: maybe call elsewhere?
  validateExplanation(responseJSON);
  explanation = responseJSON.explanation;
  exampleProblem = responseJSON.exampleProblem;
  exampleExplanation = responseJSON.exampleExplanation;

  return data.context;
}

//I'm lazy this is my easy method
function print(content, id) {
  document.getElementById(id).innerHTML = content
    .toString()
    .replace(/\n/g, "<br />"); // HACK: replace newlines with HTML line breaks
}

// validates correct syntax for explanation
function validateExplanation(explanationJSON) {
  try {
    if (
      typeof explanationJSON.explanation != "string" ||
      validateProblem(explanationJSON.exampleProblem) ||
      typeof explanationJSON.exampleExplanation != "string"
    ) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

// validates correct syntax for explanation
function validateProblem(problemJSON) {
  try {
    if (
      typeof problemJSON.question != "string" ||
      typeof problemJSON.answer != "number" ||
      typeof problemJSON.choices != "object" ||
      problemJSON.choices.length != 4 ||
      problemJSON.choices.some((choice) => typeof choice != "string")
    ) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

//transforms the text from practiceProblem into the question question and false answers radioA/B/C/D and correct answer answer
function getProblem() {
  //depends on how the API works
}

//function that throws the data into HTML
function publish() {
  print(explanation, "explanation");
  //print(exampleProblem, "exampleProblem");
  print(exampleExplanation, "exampleExplanation");

  print(exampleProblem.question, "exampleQuestion");
  exampleProblem.choices.forEach((choice, i) => {
    const letter = String.fromCharCode(65 + i);
    print(`${letter}. ${choice}`, `exampleChoice${letter}`);
    if (i === exampleProblem.answer) {
      print(`Answer: ${letter}`, "exampleAnswer");
    }
  });

  //print(practiceProblem, "practice");
}

//next onclick function
function nextProblem() {
  getProblem();
  print(question, "question");
  x = Math.floor(4 * Math.random());
  if (x == 0) {
    radioA = answer;
    correctID = "A";
  } else if (x == 1) {
    radioB = answer;
    correctID = "B";
  } else if (x == 2) {
    radioC = answer;
    correctID = "C";
  } else {
    radioD = answer;
    correctID = "D";
  } //shuffle where correct answer is //MAKE SURE LINES UP WITH HTML
  print(radioA, "radioA");
  print(radioB, "radioB");
  print(radioC, "radioC");
  print(radioD, "radioD");
}

//practiceSubmit submit function
function checkAnswer() {
  if (document.getElementByID(correctID).checked == true) {
    window.alert("Correct! :D");
  } else {
    window.alert("Try again...");
  } //result screen (change later?)
}
