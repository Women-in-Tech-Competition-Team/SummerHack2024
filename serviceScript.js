//EDITION ONE CODE

let userRequest; //from search bar

//from API:
let explanation; 
let exampleProblem;
let practiceProblem;

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

//function that throws the data into HTML
function publish(){
  print(explanation, "explain");
  print(exampleProblem, "example");
  print(practiceProblem, "practice"); //to be edited in edition 2
}
