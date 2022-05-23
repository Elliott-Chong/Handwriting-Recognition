const NeuralNetwork = require("../../neural_network_library/NeuralNetwork.js");
const mnist = require("mnist");

var set = mnist.set(8000, 2000);

const TRAINING = false;

var trainingSet = set.training;
var testSet = set.test;

const brain = new NeuralNetwork(784, 20, 10);

if (TRAINING) {
  for (let i = 0; i < 10000; i++) {
    if ((i + 1) % 1000 == 0) {
      console.log(`training on ${i + 1}`);
    }
    let index = Math.floor(Math.random() * 8000);
    let { input, output } = trainingSet[index];
    brain.train(input, output);
  }
  brain.save("model.json");
} else {
  brain.load("./model.json");
}

const compareArray = (arr1, arr2) => {
  return JSON.stringify(arr1) == JSON.stringify(arr2);
};

const transform = (arr) => {
  let faux = JSON.parse(JSON.stringify(arr));
  let max = 0;
  let ans = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
      ans = i;
    }
  }
  for (let i = 0; i < arr.length; i++) {
    if (i != ans) {
      faux[i] = 0;
    } else {
      faux[i] = 1;
    }
  }
  return faux;
};
let correct = 0;

for (let i = 0; i < testSet.length; i++) {
  let ans = brain.feedforward(testSet[i].input);
  if (compareArray(transform(ans), testSet[i].output)) {
    correct++;
  }
}

console.log(correct / 2000);
