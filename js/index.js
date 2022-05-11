const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const gravity = .7;

let playerHealth = document.querySelector('#player-health');
let enemyHealth = document.querySelector('#enemy-health');
let combatTimer = document.querySelector('#timer');
let combatResults = document.querySelector('#combat-results');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const background = new Sprite({
	position: {
		x: 0,
		y: 0,
	},
	imageSrc: './ressources/background.png',
})

const shop = new Sprite({
	position: {
		x: 625,
		y: 128,
	},
	imageSrc: './ressources/shop.png',
	scale: 2.75,
	framesNbr: 6,
	framesHold: 6,
})

const player = new Fighter({
	position: {
		x: 0,
		y: 0
	},
	velocity: {
		x: 0,
		y: 0
	},
	imageSrc: './ressources/Player1/Sprites/Idle.png',
	framesNbr: 8,
	framesHold: 6,
	scale: 2.5,
	offset: {
		x: 180,
		y: 157
	},
	sprites : {
		idle:{
			imageSrc: './ressources/Player1/Sprites/Idle.png',
			framesNbr: 8,
			framesHold: 6,
		},
		run:{
			imageSrc: './ressources/Player1/Sprites/Run.png',
			framesNbr: 8,
			framesHold: 6,
		},
		jump:{
			imageSrc: './ressources/Player1/Sprites/Jump.png',
			framesNbr: 2,
			framesHold: 6,
		},
		fall:{
			imageSrc: './ressources/Player1/Sprites/Fall.png',
			framesNbr: 2,
			framesHold: 6,
		},
		attack1:{
			imageSrc: './ressources/Player1/Sprites/Attack1.png',
			framesNbr: 6,
			framesHold: 6,
		},
		takeHit:{
			imageSrc: './ressources/Player1/Sprites/TakeHit.png',
			framesNbr: 4,
			framesHold: 6,
		},
		death:{
			imageSrc: './ressources/Player1/Sprites/Death.png',
			framesNbr: 6,
			framesHold: 6,
		},
	},
	damage: 20,
	attackBox: {
		offset: {
			x: 100,
			y: 50,
		},
		width: 190,
		height: 50,
	}
})

const enemy = new Fighter({
	position: {
		x: 400,
		y: 100
	},
	velocity: {
		x: 0,
		y: 0
	},
	imageSrc: './ressources/Player2/Sprites/Idle.png',
	framesNbr: 4,
	framesHold: 10,
	scale: 2.5,
	offset: {
		x: 180,
		y: 170
	},
	sprites : {
		idle:{
			imageSrc: './ressources/Player2/Sprites/Idle.png',
			framesNbr: 4,
			framesHold: 10,
		},
		run:{
			imageSrc: './ressources/Player2/Sprites/Run.png',
			framesNbr: 8,
			framesHold: 6,
		},
		jump:{
			imageSrc: './ressources/Player2/Sprites/Jump.png',
			framesNbr: 2,
			framesHold: 6,
		},
		fall:{
			imageSrc: './ressources/Player2/Sprites/Fall.png',
			framesNbr: 2,
			framesHold: 6,
		},
		attack1:{
			imageSrc: './ressources/Player2/Sprites/Attack1.png',
			framesNbr: 4,
			framesHold: 6,
		},
		takeHit:{
			imageSrc: './ressources/Player2/Sprites/TakeHit.png',
			framesNbr: 3,
			framesHold: 6,
		},
		death:{
			imageSrc: './ressources/Player2/Sprites/Death.png',
			framesNbr: 7,
			framesHold: 6,
		},
	},
	damage: 10,
	attackBox: {
		offset: {
			x: -135,
			y: 50,
		},
		width: 175,
		height: 50,
	}
})

const keys = {
	q: {
		pressed: false,
	},
	d: {
		pressed: false,
	},
	ArrowRight: {
		pressed: false,
	},
	ArrowLeft: {
		pressed: false,
	},
}

decreaseTime();

function animate() {
	window.requestAnimationFrame(animate);
	c.fillStyle = 'black';
	c.fillRect(0, 0, canvas.width, canvas.height);
	background.update();
	shop.update();
	c.fillStyle = 'rgba(255, 255, 255, 0.12)'
	c.fillRect(0, 0, canvas.width, canvas.height);
	player.update();
	enemy.update();

	//Player movement
	player.velocity.x = 0;

	if (keys.q.pressed && player.lastKeyPressed === 'q') {
		player.velocity.x = -5;
		player.switchSprite('run');
	} else if (keys.d.pressed && player.lastKeyPressed === 'd') {
		player.velocity.x = 5;
		player.switchSprite('run');
	} else {
		player.switchSprite('idle');
	}
	//Jumping
	if( player.velocity.y < 0) {
		player.switchSprite('jump');
	} else if (player.velocity.y > 0) {
		player.switchSprite('fall');
	}

	//Enemy movement
	enemy.velocity.x = 0;
	if (keys.ArrowRight.pressed && enemy.lastKeyPressed === 'ArrowRight') {
		enemy.velocity.x = 5;
		enemy.switchSprite('run');
	} else if (keys.ArrowLeft.pressed && enemy.lastKeyPressed === 'ArrowLeft') {
		enemy.velocity.x = -5;
		enemy.switchSprite('run');
	} else {
		enemy.switchSprite('idle');
	}
	//Jumping
	if( enemy.velocity.y < 0) {
		enemy.switchSprite('jump');
	} else if (enemy.velocity.y > 0) {
		enemy.switchSprite('fall');
	}

	//Collision detection
	//player attack
	if (
		rectangularCollsion(player, enemy)
		&& player.isAttacking
		&& player.currentFrame === 4
	) {
		enemy.takeHit(player);
		player.isAttacking = false;		
		gsap.to(enemyHealth, {
			width: enemy.health + '%',
		})
	}
	//player misses
	if (player.isAttacking && player.currentFrame === 4) {
		player.isAttacking = false;
	}

	//enemy attack
	if (
		rectangularCollsion(enemy, player)
		&& enemy.isAttacking
		&& enemy.currentFrame === 2
	) {
		player.takeHit(enemy);
		enemy.isAttacking = false;
		gsap.to(playerHealth, {
			width: player.health + '%',
		})
	}
	//enemy misses
	if (enemy.isAttacking && enemy.currentFrame === 2) {
		enemy.isAttacking = false;
	}

	//end game based on health
	if(player.health <= 0 || enemy.health <= 0) {
		whoWon(timerId);
	}
}

animate();

window.addEventListener('keydown', (e) => {
	if(!player.dead) {
		switch (e.key) {
			case 'd':
				keys.d.pressed = true;
				player.lastKeyPressed = 'd';
				break;
			case 'q':
				keys.q.pressed = true;
				player.lastKeyPressed = 'q';
				break;
			case 'z':
				player.velocity.y = -10;
				break;
			case ' ':
				player.attack();
				break;
		}
	}
	if(!enemy.dead) {
		switch (e.key) {
			case 'ArrowRight':
				keys.ArrowRight.pressed = true;
				enemy.lastKeyPressed = 'ArrowRight';
				break;
			case 'ArrowLeft':
				keys.ArrowLeft.pressed = true;
				enemy.lastKeyPressed = 'ArrowLeft';
				break;
			case 'ArrowUp':
				enemy.velocity.y = -10;
				break;
			case 'ArrowDown':
				enemy.attack();
				break;
		}
	}
});

window.addEventListener('keyup', (e) => {
	switch (e.key) {
		case 'd':
		keys.d.pressed = false;
		break;
		case 'q':
		keys.q.pressed = false;
		break;
		case 'ArrowRight':
		keys.ArrowRight.pressed = false;
		break;
		case 'ArrowLeft':
		keys.ArrowLeft.pressed = false;
		break;
	}
})