const express = require('express')
const cors = require('cors')
const NeuralNetwork = require('../../toy-neural-network-library/NeuralNetwork')
const app = express()
const brain = new NeuralNetwork(784, 100, 10)
brain.load('./model.json')

const mnist = require('mnist')

app.use(express.json())
app.use(cors())


const getMax = arr => {
    let max = -1
    let ans = 0
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i]
            ans = i
        }
    }
    return ans
}

app.post('/', (req, res) => {
    console.table(req.body)
    let response = brain.feedforward(req.body)
    let answer = getMax(response)
    res.send(answer.toString())
})


app.listen(5000, () => {
    console.log("server running on http://localhost:5000")
})
