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
    			if (this.isCornerRoom({x: j*2, y: i*2})) {
    			 	curRoom.setKeyRoom(true);
    			}
    			curRoom.generateRoom();
    			this.rooms[i].push(curRoom);
			}
		}
		this.setRoomBasedOnCurrentPosition();
	}

	isCornerRoom(pos) {
		if (pos.x === 0 && pos.y === 0) {
			return true;
		} else if (pos.x === 0 && pos.y === this.dimensions.height) {
			return true;
		} else if (pos.x === this.dimensions.width && pos.y === 0) {
			return true;
		} else if (pos.x === this.dimensions.width && this.dimensions.height) {
			return true;
		}

		return false;
	}


	drawCurrentRoom(gameObject, group, wallKey) {
    	this.currentRoom.drawRoom(gameObject, group, 'standardWall')
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

	moveUp(gameObject, group, key) {
		this.currentRoomPos.y = this.currentRoomPos.y - 2;
		this.doMove(gameObject, group, key);
	}

	moveDown(gameObject, group, key) {
		this.currentRoomPos.y = this.currentRoomPos.y + 2;
		this.doMove(gameObject, group, key);
	}

	moveLeft(gameObject, group, key) {
		this.currentRoomPos.x = this.currentRoomPos.x - 2;
		this.doMove(gameObject, group, key);
	}

	moveRight(gameObject, group, key) {
		this.currentRoomPos.x = this.currentRoomPos.x + 2;
		this.doMove(gameObject, group, key);
	}

	removeAllFromGroup(group) {
		group.clear(true, true);
	}

	destroyKey() {
		if (this.currentRoom.hasKey) {
			this.currentRoom.removeKey();
		}
	}

	doMove(gameObject, group, key) {
		this.removeAllFromGroup(group);
		this.destroyKey()
		this.setRoomBasedOnCurrentPosition();
		this.drawCurrentRoom(gameObject, group, key)
	}

	setRoomBasedOnCurrentPosition() {
		this.currentRoom = this.rooms[this.currentRoomPos.y / 2][this.currentRoomPos.x / 2];
	}

}

