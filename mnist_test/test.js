let brain;

let dataSet;

let RESO = 5;

let train;

function setup() {
  createCanvas(700, 700);
  dataSet = [
    { input: [0, 1], output: [1] },
    { input: [1, 0], output: [1] },
    { input: [1, 1], output: [0] },
    { input: [0, 0], output: [0] },
  ];
  brain = new NeuralNetwork();
  brain.input(2);
  brain.add(new Dense(10));
  brain.add(new Dense(10));
  brain.add(new Dense(10));
  brain.add(new Dense(1));
  brain.compile();
  train = (n) => {
    for (let i = 0; i < n; i++) {
      let yes = random(dataSet);
      brain.train(yes.input, yes.output);
    }
  };
}

function draw() {
  noStroke();
  train(100);
  for (let i = 0; i < height / RESO; i++) {
    for (let j = 0; j < width / RESO; j++) {
      let input = [i / (height / RESO), j / (width / RESO)];
      let output = brain.predict(input);
      fill(output * 255);
      rect(i * RESO, j * RESO, RESO, RESO);
    }
  }
}
