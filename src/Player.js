
export default class Player extends Phaser.Physics.Arcade.Sprite {

	constructor(config, keyKey) {
		super(config.game, config.x, config.y, config.key);

		this.defaultSpeed = 300;
		this.boostMultiplier = 1.5;
		this.boostTickDuration = 30;
		this.boostTickReset = 90;

		this.boostTickOnFor = 0;
		this.boostTickOffFor = 0;
		this.boostOn = false;
		this.boostAvailable = true;

		this.isHoldingKey = false;
		this.keyKey = keyKey;

		//this.setDisplaySize(config.width / 28, config.height / 28);

		this.movementKeys = [ 
			{name: "LEFT", directionAdjust: -1, axis: "x", isDown: false},
			{name: "RIGHT", directionAdjust: 1, axis: "x", isDown: false},
			{name: "UP", directionAdjust: -1, axis: "y", isDown: false},
			{name: "DOWN", directionAdjust: 1, axis: "y", isDown: false}]
	}

	getDiagonalSpeed(speed) {
		return Math.sqrt( Math.pow(speed, 2) / 2);
	}

	update() {
		this.handleBoost();	
		this.handleKey();
	}

	handleKey() {
		if (!this.isHoldingKey) {
			return;
		}
	}

	onCollisionWithKey() {
		this.isHoldingKey = true;
	}

	handleBoost() {
		if (this.boostOn) {
			this.boostTickOnFor += 1;
		} else {
			this.boostTickOffFor += 1;
		}

		if (this.boostOn && this.boostTickOnFor >= this.boostTickDuration) {
			this.boostOn = false;
			this.boostAvailable = false;
			this.boostTickOffFor = 0;
			console.log("BOOST over");
		}

		if (!this.boostOn && this.boostTickOffFor >= this.boostTickReset) {
			this.boostAvailable = true;
			this.boostTickOnFor = 0;
			console.log("BOOST available")
		}
	}

	handleKeys(keys) {
		this.setVelocityX(0);
		this.setVelocityY(0);

		if (keys.includes("SPACE")) {
			if (this.boostAvailable) {
				this.boostOn = true;
			}
		} else {
			this.boostOn = false;
		}


		for (let i = 0; i < keys.length; i++) {

			for (let j = 0; j < this.movementKeys.length; j++) {
				if (this.movementKeys[j].name === keys[i]) {
					this.moveInDirection(keys[i]);
				}
			}
		}

	}

	moveInDirection(direction) {
		let velX = 0;
		let velY = 0;
		let speed = this.boostOn ? this.boostMultiplier * this.defaultSpeed : this.defaultSpeed;

		if (speed > this.defaultSpeed) {
			console.log("BOOST");
		}

		for (let i = 0; i < this.movementKeys.length; i++) {
			if (direction === this.movementKeys[i].name) {
				if (this.movementKeys[i].axis === "x") {
					velX = speed * this.movementKeys[i].directionAdjust;
				} else {
					velY = speed * this.movementKeys[i].directionAdjust;
				}
			}
		}

		if (velX) { this.setVelocityX(velX); }
		if (velY) { this.setVelocityY(velY); }

		if (this.body.velocity.y && this.body.velocity.x) {
			this.setVelocityX(Math.sign(this.body.velocity.x) * this.getDiagonalSpeed(speed));
			this.setVelocityY(Math.sign(this.body.velocity.y) * this.getDiagonalSpeed(speed));
		}

		this.setAngleBasedOnSpeed(this.body.velocity.x, this.body.velocity.y);
	}

	setAngleBasedOnSpeed(velX, velY) {
		if (velY > 0 && velX === 0) {
			this.angle = 180;
		} else if (velY < 0 && velX === 0) {
			this.angle = 0;
		} else if (velY > 0 && velX > 0) {
			this.angle = 135;
		} else if (velY < 0 && velX > 0) {
			this.angle = 45;
		} else if (velY > 0 && velX < 0) {
			this.angle = 225;
		} else if (velY < 0 && velX < 0) {
			this.angle = 315;
		} else if (velY === 0 && velX > 0) {
			this.angle = 90;
		} else if (velY === 0 && velX < 0) {
			this.angle = 270;
		}

	}

}