class Sprite {
	constructor({position, imageSrc, scale = 1, framesNbr = 1, framesHold = 1, offset = {x: 0, y: 0}}) {
		this.position = position;
		this.height = 150;
		this.width = 50;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesNbr = framesNbr;
    this.currentFrame = 0;
    this.elapsedFrames = 0;
    this.framesHold = framesHold;
    this.offset = offset;
	}

	draw() {
    c.drawImage(
      this.image,
      this.currentFrame * (this.image.width / this.framesNbr),
      0,
      this.image.width / this.framesNbr,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesNbr) * this.scale,
      this.image.height * this.scale,
    );
	}

  animateFrames() {
    this.elapsedFrames++;
    if(this.elapsedFrames % this.framesHold === 0){
      if(this.currentFrame < this.framesNbr - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
    }
  }

	update() {
		this.draw();
    this.animateFrames();
	}
}
class Fighter extends Sprite {
	constructor({
    position,
    velocity,
    color = 'red',
    imageSrc,
    scale = 1,
    framesNbr = 1,
    framesHold = 1,
    offset = {x: 0, y: 0},
    sprites,
    damage = 10,
    attackBox = { offset: {}, width: undefined, height: undefined},
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesNbr,
      framesHold,
      offset
    });
		this.velocity = velocity;
		this.height = 150;
		this.width = 50;
		this.lastKeyPressed = '';
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height
    };
		this.color = color;
		this.isAttacking = false;
		this.health = 100;
    this.currentFrame = 0;
    this.elapsedFrames = 0;
    this.sprites = sprites;
    this.damage = damage;
    this.dead = false;

    for(const sprite in this.sprites){
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
	}

	update() {
		this.draw();
    if(!this.dead) {
      this.animateFrames()
    }
    
    //attack
		this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
		this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    //draw attackboxes
    // c.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height,
    // )

		this.position.y += this.velocity.y;
		this.position.x += this.velocity.x;

    //Gravity
		if(this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
		this.velocity.y = 0;
    this.position.y = 330;
		} else {
		this.velocity.y += gravity;
		}
	}

	attack() {
    this.switchSprite('attack1');
		this.isAttacking = true;
	}

  takeHit(player) {
    this.health -= player.damage;
    
    if(this.health <= 0) {
      this.switchSprite('death');
    } else {
      this.switchSprite('takeHit');
    }

  }

  switchSprite(sprite) {
        //override whent die
    if(this.image === this.sprites.death.image) {
      if(this.currentFrame === this.sprites.death.framesNbr - 1) {
        this.dead = true
      }
      return;
    }
    //override when take hit
    if(
      this.image === this.sprites.takeHit.image
      && this.currentFrame < this.sprites.takeHit.framesNbr -1
    ) {
      return;
    }
        //overriding animation with attack animation
    if(
      this.image === this.sprites.attack1.image
      && this.currentFrame < this.sprites.attack1.framesNbr -1
    ) {
      return;
    }
    switch(sprite) {
      case 'idle':
        if(this.image !== this.sprites.idle.image) {
          this.currentFrame = 0;
          this.image = this.sprites.idle.image;
          this.framesNbr = this.sprites.idle.framesNbr;
          this.framesHold = this.sprites.idle.framesHold;
        }
        break;
      case 'run':
        if(this.image !== this.sprites.run.image) {
          this.currentFrame = 0;
          this.image = this.sprites.run.image;
          this.framesNbr = this.sprites.run.framesNbr;
          this.framesHold = this.sprites.run.framesHold;
        }
        break;
      case 'jump':
        if(this.image !== this.sprites.jump.image) {
          this.currentFrame = 0;
          this.image = this.sprites.jump.image;
          this.framesNbr = this.sprites.jump.framesNbr;
          this.framesHold = this.sprites.jump.framesHold;
        }
        break;  
      case 'fall':
        if(this.image !== this.sprites.fall.image) {
          this.currentFrame = 0;
          this.image = this.sprites.fall.image;
          this.framesNbr = this.sprites.fall.framesNbr;
          this.framesHold = this.sprites.fall.framesHold;
        }
        break;  
      case 'attack1':
        if(this.image !== this.sprites.attack1.image) {
          this.currentFrame = 0;
          this.image = this.sprites.attack1.image;
          this.framesNbr = this.sprites.attack1.framesNbr;
          this.framesHold = this.sprites.attack1.framesHold;
        }
        break;  
      case 'takeHit':
        if(this.image !== this.sprites.takeHit.image) {
          this.currentFrame = 0;
          this.image = this.sprites.takeHit.image;
          this.framesNbr = this.sprites.takeHit.framesNbr;
          this.framesHold = this.sprites.takeHit.framesHold;
        }
        break;  
      case 'death':
        if(this.image !== this.sprites.death.image) {
          this.currentFrame = 0;
          this.image = this.sprites.death.image;
          this.framesNbr = this.sprites.death.framesNbr;
          this.framesHold = this.sprites.death.framesHold;
        }
        break;  
    }
  }
}