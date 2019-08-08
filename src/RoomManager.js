import MazeMaker from './MazeMaker.js'
import Room from './Room.js'

export default class RoomManager {
	
	constructor() {
		this.dimensions = {width: 9, height: 9};
		this.currentRoomPos = {x: 4, y: 4};
		this.mazeMaker = new MazeMaker();
		this.mazeMaker.setDimensions(this.dimensions);
		this.rooms = [];
		this.currentRoom = null;
		this.pixelDimensions = {};
	}

	setPixelDimensions(w, h) {
		this.pixelDimensions = {width: w, height: h};
	}

	generateAllRooms() {
		
		this.mazeMaker.generateMazeWithAlgorithm();
		let curRoom = null;
		let curPos = {};
		for (let i = 0; i <= Math.floor(this.dimensions.height / 2); i++) {
			this.rooms.push([]);
			for (let j = 0; j <= Math.floor(this.dimensions.width / 2); j++) {
				curPos = {x: j, y: i};
				curRoom = new Room();
				curRoom.setPixelDimensions(this.pixelDimensions.width, this.pixelDimensions.height);
				let exitDirs = this.getExitDirections({x: j*2, y: i*2});
    			curRoom.setDirections(exitDirs);
    			if (!this.isMainRoom({x: j*2, y: i*2})) {
    				curRoom.setMazeRoom(true);
    			}
    			curRoom.generateRoom();
    			this.rooms[i].push(curRoom);
			}
		}
		this.setRoomBasedOnCurrentPosition();
	}


	drawCurrentRoom(group, wallKey) {
    	this.currentRoom.drawRoom(group, 'standardWall')
	}

	isMainRoom(position) {
		if (Math.floor(this.dimensions.width / 2) === position.x &&
			Math.floor(this.dimensions.height /2) === position.y) {
			return true;
		}
		return false;
	}

	getExitDirections(position) {
		let exitDirs = this.mazeMaker.getExitDirectionsFromPosition({x: position.x, y: position.y});
		return exitDirs;
	}

	moveUp(group, key) {
		this.currentRoomPos.y = this.currentRoomPos.y - 2;
		this.doMove(group, key);
	}

	moveDown(group, key) {
		this.currentRoomPos.y = this.currentRoomPos.y + 2;
		this.doMove(group, key);
	}

	moveLeft(group, key) {
		this.currentRoomPos.x = this.currentRoomPos.x - 2;
		this.doMove(group, key);
	}

	moveRight(group, key) {
		this.currentRoomPos.x = this.currentRoomPos.x + 2;
		this.doMove(group, key);
	}

	removeAllFromGroup(group) {
		group.clear(true, true);
	}

	doMove(group, key) {
		this.removeAllFromGroup(group);
		this.setRoomBasedOnCurrentPosition();
		this.drawCurrentRoom(group, key)
	}

	setRoomBasedOnCurrentPosition() {
		this.currentRoom = this.rooms[this.currentRoomPos.y / 2][this.currentRoomPos.x / 2];
	}

}

