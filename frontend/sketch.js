let CANVAS_HEIGHT = window.innerHeight * .8
if (window.innerWidth < window.innerHeight) {
    CANVAS_HEIGHT = window.innerWidth * 0.8
}
const GRID_NUM = 28
let resetBtn;
let submitBtn;
let buttonContainerDiv;
let answerP

let grids = []
let allFilledIn = []

function setup() {
    createCanvas(CANVAS_HEIGHT, CANVAS_HEIGHT)
    for (let i = 0; i < GRID_NUM; i++) {
        let row = []
        for (let j = 0; j < GRID_NUM; j++) {
            row.push(new Grid(i, j))
        }
        grids.push(row)
    }
    buttonContainerDiv = createDiv()
    buttonContainerDiv.elt.setAttribute('id', 'button-container-div')
    resetBtn = createButton('Reset')

    resetBtn.elt.onclick = () => {
        for (let i = 0; i < GRID_NUM; i++) {
            for (let j = 0; j < GRID_NUM; j++) {
                grids[i][j].filledIn = false
            }
        }
    }
    answerP = createP()
    submitBtn = createButton("Evaluate")
    submitBtn.elt.onclick = () => {
        evaluate()
    }
    buttonContainerDiv.elt.appendChild(resetBtn.elt)
    buttonContainerDiv.elt.appendChild(submitBtn.elt)
    buttonContainerDiv.elt.appendChild(answerP.elt)
}


const evaluate = async () => {
    allFilledIn = []
    for (let i = 0; i < GRID_NUM; i++) {
        let row = []
        for (let j = 0; j < GRID_NUM; j++) {
            if (grids[i][j].filledIn) {
                row.push(1)
            }
            else {
                row.push(0)
            }
        }
        allFilledIn.push(row)
    }
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const body = JSON.stringify(allFilledIn)
        const response = await axios.post('http://192.168.50.74:5000', body, config)
        answerP.elt.innerHTML = `The model thinks that you have written: <strong>${response.data}</strong>`
    } catch (error) {
        console.error(error)
    }
}


function draw() {
    background(255)
    for (let i = 0; i < GRID_NUM; i++) {
        for (let j = 0; j < GRID_NUM; j++) {
            grids[i][j].show()
        }
    }
    if (mouseIsPressed) {
        let x = floor(map(mouseX, 0, CANVAS_HEIGHT, 0, GRID_NUM))
        let y = floor(map(mouseY, 0, CANVAS_HEIGHT, 0, GRID_NUM))
        if (x >= GRID_NUM || y >= GRID_NUM || x < 0 || y < 0) return
        grids[y][x].fillIn()
    }
}
