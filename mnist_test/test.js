let brain;

let dataSet;

let RESO = 5;

function setup() {
  createCanvas(700, 700);
  dataSet = [
    { input: [0, 1], output: [1] },
    { input: [1, 0], output: [1] },
    { input: [1, 1], output: [0] },
    { input: [0, 0], output: [0] },
  ];
  brain = new NeuralNetwork(2, 100, 1);
}

function draw() {
  for (let i = 0; i < 100; i++) {
    let yes = random(dataSet);
    brain.train(yes.input, yes.output);
  }
  noStroke();
  for (let i = 0; i < height / RESO; i++) {
    for (let j = 0; j < width / RESO; j++) {
      let input = [i / (height / RESO), j / (width / RESO)];
      let output = brain.feedforward(input);
      fill(output * 255);
      rect(i * RESO, j * RESO, RESO, RESO);
    }
  }
}
