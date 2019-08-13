
export default class Key extends Phaser.Physics.Arcade.Sprite {

	constructor(config) {
		super(config.game, config.x, config.y, config.key);
	}

}
