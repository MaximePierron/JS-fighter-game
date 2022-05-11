let timer = 60;
let timerId;
function decreaseTime() {
	if(timer > 0) {
		timerId = setTimeout(decreaseTime, 1000)
		timer--;
		combatTimer.innerHTML = timer;
	}

	if(timer === 0) {
		whoWon(timerId);
	}

}

function whoWon(timerId) {
	clearTimeout(timerId);
	combatResults.style.display = 'flex';
	if(player.health === enemy.health) {
		combatResults.innerHTML = 'Draw !';
	}
	if(player.health > enemy.health) {
		combatResults.innerHTML = 'Player 1 wins !';
	}
	if(player.health < enemy.health) {
		combatResults.innerHTML = 'Player 2 wins !';
	}
}
function rectangularCollsion(rectangle1, rectangle2) {
	return rectangle1.attackBox.position.x + rectangle1.attackBox.width >=rectangle2.position.x 
	&& rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
	&& rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
	&& rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
}