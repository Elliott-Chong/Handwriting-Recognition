let RESO;
let trainingSet;
let brain;
let trainingIndex = 0;

let correct;
var set;
let total;

function setup() {
  let cnv = createCanvas(600, 600);
  set = mnist.set(8000, 2000);
  cnv.parent("#canvas");
  RESO = width / 28;
  correct = 0;
  total = 0;
  // frameRate(10);
  trainingSet = set.training;
  trainingIndex = 0;
  brain = new NeuralNetwork();
  brain.input(784);
  brain.add(new Dense(100));
  brain.add(new Dense(10));
  brain.compile();
}

function test() {
  let correct = 0;
  let total = set.test.length;
  for (let i = 0; i < set.test.length; i++) {
    let inputs = set.test[i].input;
    let output = set.test[i].output;
    let guess = convertOutput(brain.predict(inputs));
    let actual = convertOutput(output);
    if (guess == actual) {
      correct++;
    }
  }
  console.log((correct / total) * 100 + "%");
}

function draw() {
  background(0);
  for (let i = 0; i < 10; i++) {
    let index = Math.floor(Math.random() * 8000);
    var trainingDrawing = trainingSet[index];
    let inputs = convertInput(trainingDrawing.input);
    brain.train(inputs, trainingDrawing.output);
    for (let i = 0; i < 28; i++) {
      for (let j = 0; j < 28; j++) {
        let val = inputs[j * 28 + i];
        fill(val * 255);
        rect(i * RESO, j * RESO, RESO, RESO);
      }
    }

    let guess = convertOutput(brain.predict(inputs));
    let actual = convertOutput(trainingDrawing.output);

    select("#label").html(actual);
    select("#guess").html(`Guess is ${guess}`);
    if (guess == actual) {
      correct++;
      select("#label").elt.classList.add("correct");
      select("#guess").elt.classList.add("correct");

      select("#label").elt.classList.remove("wrong");
      select("#guess").elt.classList.remove("wrong");
    } else {
      select("#label").elt.classList.add("wrong");
      select("#guess").elt.classList.add("wrong");

      select("#label").elt.classList.remove("correct");
      select("#guess").elt.classList.remove("correct");
    }
    trainingIndex++;
    total++;
    select("#percentage").html(`${100 * (correct / total)}%`);
  }
}

const convertOutput = (arr) => {
  let max = -1;
  let ans = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
      ans = i;
    }
  }
  return ans;
};

const convertInput = (arr) => {
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    res[i] = arr[i] > 0 ? 0 : 1;
  }
  return res;
};
