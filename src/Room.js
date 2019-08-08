import MazeMaker from './MazeMaker.js'

export default class Room {
	
	constructor() {
		this.doorDirections = [];
		this.wallLocations = [];
		this.enemyLocations = [];
		this.difficulties = [
			{difficulty: "EASY", enemyProbability: 0.01, wallDensity: 0.05},
			{difficulty: "MEDIUM", enemyProbability: 0.03, wallDensity: 0.10},
			{difficulty: "HARD", enemyProbability: 0.08, wallDensity: 0.15}
		];

		this.isMazeRoom = false;
		this.dimensions = {width: 21, height: 21};
		this.spriteWidth = 0;
		this.spriteHeight = 0;
		this.hasKey = false;
		this.mazeMaker = new MazeMaker();
		this.mazeMaker.setDimensions({width: this.dimensions.width - 2, height: this.dimensions.height - 2});
	}

	setPixelDimensions(width, height) {

		this.spriteWidth = width / this.dimensions.width;
		this.spriteHeight = height / this.dimensions.height;

	}

	setDirections(directions) {
		this.doorDirections = directions;
	}

	setMazeRoom(isMazeRoom) {
		this.isMazeRoom = isMazeRoom;
	}

	generateRoom() {
		this.addWallsAlongEdge();

		if (this.isMazeRoom) {
			this.generateMaze();
		}
		this.generateRandomEnemies();
	}

	drawRoom(group, spriteKey) {
		this.addWallsToGroup(group, spriteKey);
	}

	generateMaze() {
		this.mazeMaker.generateMazeWithAlgorithm();
		let newWalls = this.mazeMaker.makeWallLocsFromMaze(this.spriteWidth, this.spriteHeight);
		this.wallLocations = this.wallLocations.concat(newWalls);
	}

	generateRandomEnemies() {
		return;
	}

	addWallsToGroup(group, key) {
		for (let i = 0; i < this.wallLocations.length; i++) {
			group.create(this.wallLocations[i].x, this.wallLocations[i].y, key);
		}
	}

	addWallsAlongEdge() {
		let x = this.spriteWidth / 2;
		let y = this.spriteHeight / 2;
		let newWall = null;
		for (let i = 0; i < this.dimensions.width; i++) {
			if (!this.doorDirections.includes("UP") || !this.isMiddleOfRoom(i, this.dimensions.width)) {
				this.wallLocations.push({x: x, y: y});
			}
			x += this.spriteWidth;
		}

		x = this.spriteWidth / 2;
		y = this.dimensions.height * this.spriteHeight - this.spriteHeight / 2;

		for (let i = 0; i < this.dimensions.width; i++) {
			if (!this.doorDirections.includes("DOWN") || !this.isMiddleOfRoom(i, this.dimensions.width)) {
				this.wallLocations.push({x: x, y: y});
		
			}
			x += this.spriteWidth;
		}

		x = this.spriteWidth / 2;
		y = this.spriteHeight / 2;

		for (let i = 0; i < this.dimensions.width; i++) {
			if (!this.doorDirections.includes("LEFT") || !this.isMiddleOfRoom(i, this.dimensions.width)) {
				this.wallLocations.push({x: x, y: y});

			}
			y += this.spriteHeight;
		}

		x = this.dimensions.width * this.spriteWidth - this.spriteWidth / 2;
		y = this.spriteHeight / 2;

		for (let i = 0; i < this.dimensions.width; i++) {
			if (!this.doorDirections.includes("RIGHT") || !this.isMiddleOfRoom(i, this.dimensions.width)) {
				this.wallLocations.push({x: x, y: y});
			}
			y += this.spriteHeight;
		}

	}

	isMiddleOfRoom(pos, totalDimension) {
		return Math.floor(totalDimension / 2) === pos || Math.floor(totalDimension / 2) - 1 === pos || Math.floor(totalDimension / 2) + 1 === pos;
	}




}