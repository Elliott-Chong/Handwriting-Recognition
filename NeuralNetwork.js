class NeuralNetwork {
  constructor(inputNodes, hiddenNodes, outputNodes) {
    this.inputNodes = inputNodes;
    this.hiddenNodes = hiddenNodes;
    this.outputNodes = outputNodes;

    this.weights_ih = new Matrix(this.hiddenNodes, this.inputNodes);
    this.weights_ho = new Matrix(this.outputNodes, this.hiddenNodes);
    this.weights_ih.randomize();
    this.weights_ho.randomize();

    this.bias_h = new Matrix(this.hiddenNodes, 1);
    this.bias_o = new Matrix(this.outputNodes, 1);
    this.bias_h.randomize();
    this.bias_o.randomize();

    this.learning_rate = 0.1;
  }

  activationFunction(input) {
    return 1 / (1 + Math.exp(-input));
  }

  fauxdSigmoig(y) {
    return y * (1 - y);
  }

  feedforward(inputsArr) {
    let inputs = Matrix.fromArray(inputsArr);

    //feedforward to get guesses
    let hiddenOutput = Matrix.multiply(this.weights_ih, inputs);
    hiddenOutput.add(this.bias_h);
    hiddenOutput.map(this.activationFunction);

    let guesses = Matrix.multiply(this.weights_ho, hiddenOutput);
    guesses.add(this.bias_o);
    guesses.map(this.activationFunction);
    // guesses = Matrix.map(guesses, (elt) => {
    //   return elt.toFixed(3);
    // });
    return guesses.toArray();
  }

  load(filename) {
    var weights = JSON.parse(fs.readFileSync(filename, "utf8"));
    this.weights_ih.data = weights.weights_ih;
    this.weights_ho.data = weights.weights_ho;
    this.bias_h.data = weights.bias_h;
    this.bias_o.data = weights.bias_o;
  }

  save(filename) {
    let weights = {
      weights_ih: this.weights_ih.data,
      weights_ho: this.weights_ho.data,
      bias_h: this.bias_h.data,
      bias_o: this.bias_o.data,
    };

    weights = JSON.stringify(weights);

    fs.writeFile(filename, weights, "utf8", function (err) {
      if (err) {
        return console.log(err);
      }

      console.log("The file was saved!");
    });
  }

  train(inputsArr, targetsArr) {
    let inputs = Matrix.fromArray(inputsArr);
    let targets = Matrix.fromArray(targetsArr);

    //feedforward to get guesses
    let hiddenOutput = Matrix.multiply(this.weights_ih, inputs);
    hiddenOutput.add(this.bias_h);
    hiddenOutput.map(this.activationFunction);

    let guesses = Matrix.multiply(this.weights_ho, hiddenOutput);
    guesses.add(this.bias_o);
    guesses.map(this.activationFunction);

    // Find error vector for output layer
    let outputErrors = Matrix.subtract(targets, guesses);

    //adjust the weights for this.weights_ho
    let gradient_ho = Matrix.map(guesses, this.fauxdSigmoig);
    gradient_ho.multiply(outputErrors);
    gradient_ho.map((elt) => elt * this.learning_rate);

    let delta_weights_ho = Matrix.multiply(
      gradient_ho,
      Matrix.transpose(hiddenOutput)
    );

    this.weights_ho.add(delta_weights_ho);
    //adjust the bias for the output layer
    this.bias_o.add(gradient_ho);

    let hiddenErrors = Matrix.multiply(
      Matrix.transpose(this.weights_ho),
      outputErrors
    );
    //adjust the weights for this.weights_ih
    let gradient_ih = Matrix.map(hiddenOutput, this.fauxdSigmoig);
    gradient_ih.multiply(hiddenErrors);
    gradient_ih.map((elt) => elt * this.learning_rate);

    let delta_weights_ih = Matrix.multiply(
      gradient_ih,
      Matrix.transpose(inputs)
    );

    this.weights_ih.add(delta_weights_ih);
    //adjust the bias for the hidden layer
    this.bias_h.add(gradient_ih);
  }
}
