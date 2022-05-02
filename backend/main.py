import json
from flask import Flask, request
from flask_cors import CORS
import numpy as np
import tensorflow as tf

model = tf.keras.models.load_model('./model.h5')

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})


@app.route('/', methods=['POST'])
def hello_world():
    handwriting = request.json
    classification = model.predict(
        [np.array(handwriting).reshape(1, 28, 28, 1)]
    ).argmax()
    print('classification is', classification)
    return str(classification)


if __name__ == '__main__':
    app.run(debug=True)
