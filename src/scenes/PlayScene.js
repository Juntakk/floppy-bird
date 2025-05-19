import BaseScene from "./BaseScene";

class PlayScene extends BaseScene {
  constructor(config) {
    super("PlayScene", config);

    this.bird = null;
    this.pipes = null;
    this.isPaused = false;

    this.pipesToRender = 4;
    this.pipeVelocity = 200;
    this.verticalFlapVelocity = 300;
    this.pipeVerticalDistanceRange = [150, 250];
    this.pipeHorizontalDistanceRange = [350, 400];

    this.score = 0;
    this.scoreText = "";

    this.difficulties = {
      easy: {
        pipeHorizontalDistanceRange: [300, 350],
        pipeVerticalDistanceRange: [150, 200],
      },
      normal: {
        pipeHorizontalDistanceRange: [280, 330],
        pipeVerticalDistanceRange: [140, 190],
      },
      hard: {
        pipeHorizontalDistanceRange: [250, 310],
        pipeVerticalDistanceRange: [120, 170],
      },
    };
  }

  create() {
    this.currentDifficulty = "easy";
    super.create();
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.createScore();
    this.createPause();
    this.handleInput();
    this.listenToEvents();

    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("bird", {
        start: 8,
        end: 15,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.bird.play("fly");
  }
  update() {
    this.checkGameStatus();
    this.recyclePipes();
  }

  listenToEvents() {
    if (this.pauseEvent) {
      return;
    }

    this.pauseEvent = this.events.on("resume", () => {
      this.initialTime = 3;
      this.countDownText = this.add
        .text(...this.screenCenter, `Game starts in ${this.initialTime}`, {
          fontSize: "32px",
          fill: "#000",
        })
        .setOrigin(0.5);
      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: this.countDown,
        callbackScope: this,
        loop: true,
      });
    });
  }
  countDown() {
    this.initialTime--;
    this.countDownText.setText(`Game starts in ${this.initialTime}`);
    if (this.initialTime <= 0) {
      this.paused = false;
      this.countDownText.setText("");
      this.physics.resume();
      this.timedEvent.remove();
    }
  }
  createBG() {
    this.add.image(0, 0, "sky").setOrigin(0);
  }
  createBird() {
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
      .setFlipX(true)
      .setScale(3)
      .setOrigin(0);

    this.bird.setBodySize(this.bird.width - 2, this.bird.height - 8);

    this.bird.body.gravity.y = 600;
    this.bird.body.setCollideWorldBounds(true);
  }
  createPipes() {
    this.pipes = this.physics.add.group();

    for (let index = 0; index < this.pipesToRender; index++) {
      const upperPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 1);
      const lowerPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 0);

      this.placePipes(upperPipe, lowerPipe);
    }
    this.pipes.setVelocityX(-this.pipeVelocity);
  }
  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }
  handleInput() {
    this.input.keyboard.on("keydown-SPACE", this.flap, this);
  }
  checkGameStatus() {
    if (
      this.bird.getBounds().top >= this.config.height ||
      this.bird.y <= 0 ||
      this.bird.getBounds().bottom >= this.config.height
    ) {
      this.gameOver();
    }
  }
  flap() {
    if (this.paused) return;
    this.bird.body.velocity.y = -this.verticalFlapVelocity;
  }
  gameOver() {
    this.physics.pause();
    this.bird.setTint(0xff0000);

    this.saveBestScore();
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
      },
      callbackScope: this,
      loop: false,
    });
  }
  createPause() {
    this.paused = false;
    this.add
      .image(this.config.width - 10, this.config.height - 10, "pause")
      .setScale(3)
      .setOrigin(1)
      .setInteractive()
      .on("pointerdown", () => {
        this.paused = true;
        this.physics.pause();
        this.scene.pause();
        this.scene.launch("PauseScene");
      });
  }
  saveBestScore() {
    const bestScoreText = localStorage.getItem("bestScore");
    const bestScore = bestScoreText && parseInt(bestScoreText, 10);
    if (!bestScore || this.score > bestScore) {
      localStorage.setItem("bestScore", this.score);
    }
  }
  placePipes(upperPipe, lowerPipe) {
    const difficulty = this.difficulties[this.currentDifficulty];

    let rightMostPipeX = this.getRightmostPipe();
    let pipeHorizontalDist = Phaser.Math.Between(
      ...difficulty.pipeHorizontalDistanceRange
    );
    let pipeDistance = Phaser.Math.Between(
      ...difficulty.pipeVerticalDistanceRange
    );
    let pipeVerticalPos = Phaser.Math.Between(
      20,
      this.config.height - 20 - pipeDistance
    );

    upperPipe.x = pipeHorizontalDist + rightMostPipeX;
    upperPipe.y = pipeVerticalPos;

    lowerPipe.x = upperPipe.x;
    lowerPipe.y = upperPipe.y + pipeDistance;
  }
  getRightmostPipe() {
    let rightMostPipeX = 0;

    this.pipes.getChildren().forEach((pipe) => {
      rightMostPipeX = Math.max(pipe.x, rightMostPipeX);
    });

    return rightMostPipeX;
  }
  recyclePipes() {
    let tempPipes = [];
    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right <= 0) {
        pipe.hasScored = false;
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.placePipes(...tempPipes);
          this.increaseScore();
          this.saveBestScore();
          this.increaseDifficulty();
        }
      }
    });
  }
  increaseDifficulty() {
    if (this.score === 8) {
      this.currentDifficulty = "normal";
    }
    if (this.score === 25) {
      this.currentDifficulty = "hard";
    }
  }
  createScore() {
    this.score = 0;
    const bestScore = localStorage.getItem("bestScore");
    this.scoreText = this.add.text(16, 16, `Score: ${0}`, {
      fontSize: "32px",
      fill: "#000",
    });
    this.bestScoreText = this.add.text(
      18,
      52,
      `Best score: ${bestScore || 0}`,
      {
        fontSize: "18px",
        fill: "#000",
      }
    );
  }
  increaseScore() {
    this.score += 1;
    this.scoreText.setText(`Score: ${this.score}`);
  }
}

export default PlayScene;
