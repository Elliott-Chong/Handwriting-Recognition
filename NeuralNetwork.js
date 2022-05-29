class NeuralNetwork {
  constructor() {
    this.layers = [];
    this.input_shape = null;
  }

  add(layer) {
    this.layers.push(layer);
  }

  input(shape) {
    this.input_shape = shape;
  }

  compile() {
    for (let i = 0; i < this.layers.length; i++) {
      let layer = this.layers[i];
      let previous_layer = this.layers[i - 1];
      if (i == 0) {
        layer.weights = new Matrix(layer.nodes, this.input_shape);
        layer.bias = new Matrix(layer.nodes, 1);
      } else {
        layer.weights = new Matrix(layer.nodes, previous_layer.nodes);
        layer.bias = new Matrix(layer.nodes, 1);
      }
    }

    for (let i = 0; i < this.layers.length; i++) {
      this.layers[i].weights.randomize();
      this.layers[i].bias.randomize();
    }
  }

  predict(input_array) {
    if (input_array.length != this.input_shape) {
      console.error("Input shape does not match!");
      return;
    }

    let inputs = Matrix.fromArray(input_array);

    let prev_output = null;
    for (let layer of this.layers) {
      let output;
      if (!prev_output) {
        output = layer.feedforward(inputs);
        prev_output = output;
      } else {
        output = layer.feedforward(prev_output);
        prev_output = output;
      }
    }

    return prev_output.toArray();
  }

  train(input_array, target_array) {
    if (input_array.length != this.input_shape) {
      console.error("Input shape does not match!");
      return;
    }
    let inputs = Matrix.fromArray(input_array);
    let targets = Matrix.fromArray(target_array);

    // feedforward and store all the intermediate outputs in all_outputs
    // all_outputs[i] is the output from layer [i]
    let prev_output = null;
    for (let layer of this.layers) {
      let output;
      if (!prev_output) {
        output = layer.feedforward(inputs);
        prev_output = output;
      } else {
        output = layer.feedforward(prev_output);
        prev_output = output;
      }
      layer.output = output;
    }

    for (let i = this.layers.length - 1; i >= 0; i--) {
      let layer = this.layers[i];
      let errors;
      if (i == this.layers.length - 1) {
        errors = Matrix.subtract(targets, layer.output);
      } else {
        let forward_layer = this.layers[i + 1];
        let forward_weights_transposed = Matrix.transpose(
          forward_layer.weights
        );
        errors = Matrix.multiply(
          forward_weights_transposed,
          forward_layer.errors
        );
      }
      layer.errors = errors;
      if (i == 0) {
        layer.backprop(inputs, errors);
      } else {
        let prev_layer = this.layers[i - 1];
        layer.backprop(prev_layer.output, errors);
      }
    }
  }
}
