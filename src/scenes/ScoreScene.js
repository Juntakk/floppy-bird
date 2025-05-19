import BaseScene from "./BaseScene";

class ScoreScene extends BaseScene {
  constructor(config) {
    super("ScoreScene", config);
  }

  create() {
    super.create();

    const bestScoreText = localStorage.getItem("bestScore") || 0;
    this.add
      .text(...this.screenCenter, `Best Score: ${bestScoreText}`, {
        fontSize: this.fontSize,
        fill: this.fillColor,
      })
      .setOrigin(0.5, 1)
      .setFontStyle("bold");

    const backButton = this.add
      .image(this.config.width - 10, this.config.height - 10, "back")
      .setOrigin(1)
      .setScale(2)
      .setInteractive();

    backButton.on("pointerup", () => {
      this.scene.start("MenuScene");
    });
  }
}

export default ScoreScene;
