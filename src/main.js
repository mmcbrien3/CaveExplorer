import Player from './Player.js';
import RoomManager from './RoomManager.js';

const scaleRatio = window.devicePixelRatio / 3;
console.log(window.devicePixelRatio);
const assetsFolder = "../assets/";
const viewWidth = window.innerWidth;
const viewHeight = window.innerHeight;

var config = {
    type: Phaser.Canvas,
    width: 1280,
    height: 640,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var cursors;

var player;
var walls;
var roomManager;

function preload() {
    this.load.image('player', [assetsFolder + 'bomb.png']);
    this.load.image('bg', [assetsFolder + 'dungeonFloor.png']);
    this.load.image('standardWall', [assetsFolder + 'brickWall.png'])
}

function create() {
    this.physics.world.setBounds(0, 0, 1280, 640);
    let bg = this.add.image(1280 / 2, 640 / 2, 'bg');
    bg.setDisplaySize(1280, 640);


    player = new Player({
            game: this,
            key: 'player',
            x: viewWidth / 2,
            y: viewHeight / 2,
            width: viewWidth,
            height: viewHeight 
        });

    this.add.existing(player);
    this.physics.world.enable(player);

    player.setCollideWorldBounds(true);
    player.onWorldBounds = true;
    this.physics.world.on("worldbounds", moveRooms, this);

    walls = this.physics.add.staticGroup();
    
    roomManager = new RoomManager();

    roomManager.setPixelDimensions(1280, 640);
    roomManager.generateAllRooms();
    roomManager.drawCurrentRoom(walls, 'standardWall');

    this.physics.add.collider(player, walls);

    setUpCursors(this);
}

function update() {
    let keysPressed = [];
    if (cursors.left.isDown)
    {
        keysPressed.push("LEFT");
    }
    if (cursors.right.isDown)
    {
        keysPressed.push("RIGHT");
    }
    if (cursors.up.isDown)
    {
        keysPressed.push("UP");
    }
    if (cursors.down.isDown) {
        keysPressed.push("DOWN");
    }
    if (cursors.space.isDown) {
        keysPressed.push("SPACE");
    }
    player.handleKeys(keysPressed);
    player.handleBoost();
    console.log(player.x);
    console.log(player.y);
    if (player.x < 15 && player.y > 40 && player.y < 600) {
        roomManager.moveLeft(walls, 'standardWall');
        player.x = 1220;
    } else if (player.x > 1245 && player.y > 40 && player.y < 600) {
        roomManager.moveRight(walls, 'standardWall');
        player.x = 20;
    } else if (player.y > 625 && player.x > 40 && player.x < 1240) {
        roomManager.moveDown(walls, 'standardWall');
        player.y = 20;
    } else if (player.y < 15 && player.x > 40 && player.x < 1240) {
        roomManager.moveUp(walls, 'standardWall');
        player.y = 620;
    }
}

function moveRooms() {
    let bp = 0;
    if (player.body.x < 40 && player.y > 40 && player.y < 600) {
        roomManager.moveLeft();
        player.x = 620;
    } else if (player.body.x > 600 && player.y > 40 && player.y < 600) {
        roomManager.moveRight();
        player.x = 20;
    }
}

function setUpCursors(game) {
    cursors = game.input.keyboard.addKeys(
        {up:Phaser.Input.Keyboard.KeyCodes.W,
        down:Phaser.Input.Keyboard.KeyCodes.S,
        left:Phaser.Input.Keyboard.KeyCodes.A,
        right:Phaser.Input.Keyboard.KeyCodes.D,
        space:Phaser.Input.Keyboard.KeyCodes.SPACE});
}

