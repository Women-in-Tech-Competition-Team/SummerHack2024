//EDITION ONE CODE

let userRequest; //from search bar

//from API:
let explanation; 
let exampleProblem;
let practiceProblem;
  let question;
  let answer; //correct answer
  let radioA;let radioB;let radioC;let radioD; //four fake answers
  let correctID;

//submitButton onclick function, populates userRequest
function search(){
  userRequest = document.getElementById("input").value; //get userRequest from the search bar
}

//takes userRequest and transforms it into explanation, exampleProblem, and practiceProblem
function api(){}

//I'm lazy this is my easy method
function print(content, id){
  document.getElementById(id).innerHTML = content.toString();
}

//transforms the text from practiceProblem into the question question and false answers radioA/B/C/D and correct answer answer
function getProblem(){
  //depends on how the API works
}

//function that throws the data into HTML
function publish(){
  print(explanation, "explain");
  print(exampleProblem, "example");
  //print(practiceProblem, "practice");
}

//next onclick function
function nextProblem(){
  getProblem();
  print(question, "question");
  x = Math.floor(4 * Math.random());
  if(x == 0){radioA = answer;correctID = "A";}else if(x == 1){radioB = answer;correctID = "B";}else if(x == 2){radioC = answer;correctID = "C";}else{radioD = answer;correctID = "D";} //shuffle where correct answer is //MAKE SURE LINES UP WITH HTML
  print(radioA, "radioA");print(radioB, "radioB");print(radioC, "radioC");print(radioD, "radioD");
}

//practiceSubmit submit function
function checkAnswer((){
  if(document.getElementByID(correctID).checked == true){window.alert("Correct! :D");}else {window.alert("Try again...")}; //result screen (change later?)
}
