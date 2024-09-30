//EDITION THREE CODE

let userRequest; //from search bar

//from API:
let explanation; 
let exampleProblem;
let practiceProblem;
  let question;
  let answer; //correct answer
  let radioA;let radioB;let radioC;let radioD; //four fake answers
  let correctID;

//I'm lazy this is my easy method to print stuff
function print(content, id){
  let a = document.getElementById(id)
  a.innerHTML = content.toString();
  a.style.display = 'inline';
}

//START HERE submitButton onclick function, populates userRequest
function search(){
  userRequest = document.getElementById("input").value; //get userRequest from the search bar
  api()
}

//takes userRequest and transforms it into explanation, exampleProblem, and practiceProblem
function api(){
	explanation = "Insert API generated explanation here"//FIXME
  exampleProblem = "Insert API generated problem here"//FIXME
  getProblem()
  publish()
}

//transforms the text from practiceProblem into the question question and false answers radioA/B/C/D and correct answer answer
function getProblem(){
  //depends on how the API works
  practiceProblem = "QuestionANDRealAnswerANDFakeANDFakeANDFakeANDFake"//FIXME
  
  practiceProblem = practiceProblem.split("AND")//FIXME
  question = practiceProblem[0]//FIXME
  answer = practiceProblem[1]//FIXME
  radioA = practiceProblem[2]//FIXME
  radioB = practiceProblem[3]//FIXME
  radioC = practiceProblem[4]//FIXME
  radioD = practiceProblem[5]//FIXME
}

//function that throws the data into HTML
function publish(){
  print(explanation, "explain");
  print(exampleProblem, "example");
  nextProblem();
  document.getElementById("result").style.display = ""
}

//next onclick function
function nextProblem(){
	//reset checks
  var radio = document.getElementsByName("ans");
  for(var i=0;i<radio.length;i++)
    radio[i].checked = false;
  document.getElementById("next").style.display = "none";
	
  //get questions
  getProblem();

  //shuffle where correct answer is
	x = Math.floor(4 * Math.random());
  if(x == 0){radioA = answer;correctID = "A";}else if(x == 1){radioB = answer;correctID = "B";}else if(x == 2){radioC = answer;correctID = "C";}else{radioD = answer;correctID = "D";} 
  
  //post all of the words onto the HTML
  print(question, "question");
  print(radioA, "radioA");print(radioB, "radioB");print(radioC, "radioC");print(radioD, "radioD");
}

//practiceSubmit submit function
function checkAnswer(){
  if(document.getElementById(correctID).checked == true){
  window.alert("Correct! :D");}
  else {window.alert("Try again...")} //result screen (change later?)
  document.getElementById("next").style.display = "";
}
