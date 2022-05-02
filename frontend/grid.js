class Grid {
    constructor(i, j) {
        this.i = i
        this.j = j
        this.GRID_LENGTH = CANVAS_HEIGHT / GRID_NUM
        this.filledIn = false
    }

    show() {
        fill(255)
        if (this.filledIn) {
            fill(100)
        }
        rect(this.j * this.GRID_LENGTH, this.i * this.GRID_LENGTH, this.GRID_LENGTH, this.GRID_LENGTH)
    }

    fillIn() {
        this.filledIn = true
        for (let neighbour of this.getNeighbours()) {
            neighbour.filledIn = true
        }
    }

    getNeighbours() {
        let neighbours = []
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                let i = this.i + dy
                let j = this.j + dx
                if (i >= GRID_NUM || i < 0 || j >= GRID_NUM || j < 0) {
                    continue
                }
                neighbours.push(grids[i][j])
            }
        }
        return neighbours
    }
}