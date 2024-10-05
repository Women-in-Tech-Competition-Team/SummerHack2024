//EDITION THREE CODE

// CONFIG: put this in another file or something?
const OLLAMA_HOST = "https://ai.ncat.cafe";
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
let context = null;

//I'm lazy this is my easy method to print stuff
function print(content, id) {
  try {
    let a = document.getElementById(id);
    a.innerHTML = content.toString().replace(/\n/g, "<br />"); // HACK: replace newlines with HTML line breaks;
    a.style.display = "inline";
  } catch(e) {
    console.error("Could not print '" + content + "' to '" + id + "'");
  }
}

function getRequest() { //general function that grabs cookie from server
    let name = "question=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

async function search() {
  userRequest = getRequest(); //get userRequest from the search bar
  document.getElementById("input").placeholder = userRequest;
  //document.getElementById("result").style.display = "none"; //hide while generating
  print("Generating response, please wait...", "aiStatus");
  try {
    context = await api(userRequest, null);
  } catch (e) {
    print("Error generating response, please try again.", "aiStatus");
    throw e;
  }
  await publish();
}

async function ollamaRequest(prompt, setContext = null) {
  const GENERATE_URL = `${OLLAMA_HOST}/api/generate`;
  return fetch(GENERATE_URL, {
    method: "POST",
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt: prompt,
      format: "json",
      stream: false, // TODO: make this true
      system: OLLAMA_SYSTEM_PROMPT,
      context: setContext,
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
async function api(prompt, previousContext = null) {
  var data = await ollamaRequest(prompt, previousContext);
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
  if (previousContext == null) {
    if (!validateExplanation(responseJSON)) {
      console.log("explanation detected");
      console.error(
        "AI did not provide a valid explanation response:",
        responseJSON,
      );
      return;
    }
    explanation = responseJSON.explanation;
    exampleProblem = responseJSON.exampleProblem;
    exampleExplanation = responseJSON.exampleExplanation;
  } else {
    if (!validateProblem(responseJSON)) {
      console.log("problem detected");
      console.error(
        "AI did not provide a valid problem response:",
        responseJSON,
      );
      return;
    }
    practiceProblem = responseJSON;
  }

  return data.context;
}

// validates correct syntax for explanation
function validateExplanation(explanationJSON) {
  try {
    if (
      typeof explanationJSON.explanation != "string" ||
      !validateProblem(explanationJSON.exampleProblem) ||
      typeof explanationJSON.exampleExplanation != "string"
    ) {
      return false;
    }
    return true;
  } catch (e) {
    console.error("error attempting to validate explanation JSON");
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
async function getProblem() {
  //depends on how the API works
  context = await api("Please generate a practice problem for me.", context);

  question = practiceProblem.question;
  answer = practiceProblem.answer;

  radioA = practiceProblem.choices[0];
  radioB = practiceProblem.choices[1];
  radioC = practiceProblem.choices[2];
  radioD = practiceProblem.choices[3];
}

//function that throws the data into HTML
async function publish() {
  print(explanation, "explain");
  //print(exampleProblem, "exampleProblem");

  print(exampleProblem.question, "exampleQuestion");
  exampleProblem.choices.forEach((choice, i) => {
    const letter = String.fromCharCode(65 + i);
    print(`${letter}. ${choice}`, `exampleChoice${letter}`);
    if (i === exampleProblem.answer) {
      print(`Answer: ${letter}`, "exampleAnswer");
    }
  });
  print(exampleExplanation, "exampleExplanation");

  await nextProblem();
  document.getElementById("result").style.display = "";
  print("", "aiStatus");
}

//next onclick function
async function nextProblem() {
  //reset checks
  var radio = document.getElementsByName("ans");
  for (var i = 0; i < radio.length; i++) radio[i].checked = false;
  document.getElementById("next").style.display = "none";

  print("Generating practice problem, please wait...", "aiStatus");
  //get questions
  try {
    await getProblem();
  } catch (e) {
    print("Error generating practice problem, please try again.", "aiStatus");
    throw e;
  }

  //post all of the words onto the HTML
  print(question, "question");

  correctID = String.fromCharCode(65 + answer);
  console.log(correctID);
  print(radioA, "radioA");
  print(radioB, "radioB");
  print(radioC, "radioC");
  print(radioD, "radioD");

  print("", "aiStatus");
}

//practiceSubmit submit function
function checkAnswer() {
  if (document.getElementById(correctID).checked == true) {
    window.alert("Correct! :D");
  } else {
    window.alert("Try again...");
  } //result screen (change later?)
  document.getElementById("next").style.display = "";
}
