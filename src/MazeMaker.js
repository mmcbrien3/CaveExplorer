
export default class MazeMaker {

	constructor() {
		this.dimensions = {};
		this.map = [];
		this.emptySpace = "O";
		this.visitedIndicator
		this.wall = "*";
	}

	setDimensions(dims) {
		this.dimensions = dims;
		this.makeEmptyMaze();
	}

	isPositionAnObject(position, object) {
		if (this.map[position.y][position.x] === object) {
			return true;
		}
		return false;
	}

	makeEmptyMaze() {
		this.map = [...Array(this.dimensions.width)].map(e => Array(this.dimensions.height).fill(this.wall));
		for (let i = 0; i < this.dimensions.height; i+=2) {
			for (let j = 0; j < this.dimensions.width; j+=2) {
				this.map[i][j] = this.emptySpace;
			}
		}
	}

	makeWallLocsFromMaze(width, height) {
		let x = width / 2 + width;
		let y = height / 2 + height;
		let wallLocs = [];
		for (let i = 0; i < this.dimensions.height; i++) {
			for (let j = 0; j < this.dimensions.width; j++) {
				if (this.map[i][j] === this.wall) {
					wallLocs.push({x: x, y: y});
				}
				x += width;
			}
			y += height;
			x = width / 2 + width;
		}
		return wallLocs;
	}

	getExitDirectionsFromPosition(position) {
		let exitDirs = [];
		let posToCheck = {x: position.x, y: position.y + 1};
		if (this.isPositionInBounds(posToCheck) && this.map[posToCheck.y][posToCheck.x] !== this.wall) {
			exitDirs.push("DOWN");
		}
		posToCheck = {x: position.x, y: position.y - 1};
		if (this.isPositionInBounds(posToCheck) && this.map[posToCheck.y][posToCheck.x] !== this.wall) {
			exitDirs.push("UP");
		}
		posToCheck = {x: position.x + 1, y: position.y};
		if (this.isPositionInBounds(posToCheck) && this.map[posToCheck.y][posToCheck.x] !== this.wall) {
			exitDirs.push("RIGHT");
		}
		posToCheck = {x: position.x - 1, y: position.y};
		if (this.isPositionInBounds(posToCheck) && this.map[posToCheck.y][posToCheck.x] !== this.wall) {
			exitDirs.push("LEFT");
		}
		return exitDirs;
	}

	isPositionInBounds(position) {
		return (position.x >= 0 && position.y >= 0) && 
				(position.x < this.dimensions.width && position.y < this.dimensions.height);
	}

	generateMazeWithBinaryDecisionAlgorithm() {
		let curPos = {};
		let rightPos = {};
		let upPos = {};
		for (let i = 0; i < this.dimensions.height; i+=2) {
			for (let j = 0; j < this.dimensions.width; j+=2) {
				curPos = {x: j, y: i};
				rightPos = this.getPosToRight(curPos, 1);
				upPos = this.getPosUp(curPos, 1);
				if (i === 0 && !(j >= this.dimensions.width - 2)) {
					this.setPositionToEmpty(rightPos);
				} else if ((j >= this.dimensions.width - 2) && i !== 0) {
					this.setPositionToEmpty(upPos);
				} else if (i === 0 && j >= this.dimensions.width - 2) {

				} else {
					if (this.flipCoinForWall()) {
						this.setPositionToEmpty(rightPos);
					} else {
						this.setPositionToEmpty(upPos);
					}
				}
			}
		}
	}

	generateMazeWithRecursiveBacktracking() {
		let curPos = this.getRandomPos();
		this.recurRecursiveBacktracking(curPos);
		this.clearOutVisited();
	}

	recurRecursiveBacktracking(position) {
		let upPos = this.getPosUp(position, 2);
		let downPos = this.getPosDown(position, 2);
		let rightPos = this.getPosToRight(position, 2);
		let leftPos = this.getPosToLeft(position, 2);

		let choices = this.shuffleArray([upPos, downPos, rightPos, leftPos]);

		for (let i = 0; i < choices.length; i++) {

			if (this.isPositionInBounds(choices[i]) && this.map[choices[i].y][choices[i].x] !== this.visitedIndicator) {
				this.removeWallBetween(choices[i], position);
				this.map[choices[i].y][choices[i].x] = this.visitedIndicator;
				this.recurRecursiveBacktracking(choices[i]);
			}
		}
	}

	removeWallBetween(posOne, posTwo) {
		let wallToRemoveX = (posOne.x + posTwo.x) / 2;
		let wallToRemoveY = (posOne.y + posTwo.y) / 2;
		this.map[wallToRemoveY][wallToRemoveX] = this.emptySpace;
	}

	clearOutVisited() {
		for (let i = 0; i < this.dimensions.height; i++) {
			for (let j = 0; j < this.dimensions.width; j++) {
				if (this.map[i][j] === this.visitedIndicator) {
					this.map[i][j] = this.emptySpace;
				}
			}
		}
	}

	shuffleArray(array) {
	    for (let i = array.length - 1; i > 0; i--) {
	        const j = Math.floor(Math.random() * (i + 1));
	        [array[i], array[j]] = [array[j], array[i]];
	    }
	    return array;
	}

	getRandomPos() {
		return {x: Math.round(Math.random() * this.dimensions.width / 2) * 2, y: Math.round(Math.random() * this.dimensions.height / 2) * 2};
	}	

	getPosToRight(pos, steps) {
		return {x: pos.x + steps, y: pos.y};
	}

	getPosToLeft(pos, steps) {
		return {x: pos.x - steps, y: pos.y};
	}

	getPosDown(pos, steps) {
		return {x: pos.x, y: pos.y + steps};
	}

	getPosUp(pos, steps) {
		return {x: pos.x, y: pos.y - steps};
	}

	generateMazeWithAlgorithm() {
		this.generateMazeWithRecursiveBacktracking();
		this.createCentralRoomDoors();
	}

	createCentralRoomDoors() {
		let centralRoomPos = {x: Math.floor(this.dimensions.width / 2), y: Math.floor(this.dimensions.height / 2)};
		this.removeWallBetween(centralRoomPos, this.getPosUp(centralRoomPos, 2));
		this.removeWallBetween(centralRoomPos, this.getPosDown(centralRoomPos, 2));
		this.removeWallBetween(centralRoomPos, this.getPosToLeft(centralRoomPos, 2));
		this.removeWallBetween(centralRoomPos, this.getPosToRight(centralRoomPos, 2));
	}

	isPositionOnEdge(position) {
		if (position.x === 0) {
			return true;
		}
		if (position.y === 0) {
			return true;
		}
		if (position.x === this.dimensions.width - 1) {
			return true;
		}
		if (position.y === this.dimensions.height - 1) {
			return true;
		}
		return false;
	}

	flipCoinForWall() {
		return Math.random() > 0.5;
	}


	setPositionToWall(position) {
		this.map[position.y][position.x] = this.wall;
	}

	setPositionToEmpty(position) {
		this.map[position.y][position.x] = this.emptySpace;
	}


	printMaze() {

		console.log("********************");
		console.log("******THE MAZE******");
		console.log("********************");
		let rowText = ""
		for (let i = 0; i < this.dimensions.height; i++) {
			for (let j = 0; j < this.dimensions.width; j++) {
				rowText += this.map[i][j];
			}
			console.log("*" + rowText + "*");
			rowText = "";
		}

		console.log("********************");
		console.log("********************");
	}
}