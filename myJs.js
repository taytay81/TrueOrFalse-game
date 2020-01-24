var tID;
var timeToAnswer = 5;
const playButton = document.getElementById("play");

var actualAnswer = "";
var step = -1;
var countDownID;

//const actualQuestion;
class zombie {
  constructor() {
    this.X = 0;
    this.type = "zombie";
  }

  getElementInHtml() {
    return document.getElementById("zombie");
  }
}
class FallingObjects {
  constructor(Id, type) {
    this.X = 10;
    this.Y = -50;
    this.Id = Id;
    this.IsInTheAir = false;
    this.collison = false;
    this.fallingSpeed = "slow";
    this.visible = false;
    this.type = type;
    this.visible = false;
    this.Y -= 10;
  }

  reInitialiaze() {
    this.X = 10;
    this.Y = -50;
    this.IsInTheAir = false;
    this.collison = false;
    this.fallingSpeed = "slow";
    this.visible = false;
    this.visible = false;
    this.getElementInHtml().style.transform = `translate(${this.X}px,${-this
      .Y}px)`;
    this.makeMeVisible();
  }

  getElementInHtml() {
    return document.getElementById(this.Id);
  }

  makeMeVisible() {
    var imgs = document.getElementById(this.Id).getElementsByTagName("img");
    imgs[0].style.visibility = "visible";
    this.visible = true;
  }
  hideMe() {
    var imgs = document.getElementById(this.Id).getElementsByTagName("img");
    imgs[0].style.visibility = "hidden";
    this.visible = false;
  }
  isvisible() {
    return this.visible;
  }

  fall() {
    this.makeMeVisible();
    let intervalId = setInterval(() => {
      if (this.Y === -600) {
        this.IsInTheAir = false;
        //the falling element become invisible if not touched
        clearInterval(intervalId);
        this.hideMe();
        return;
      }
      this.Y -= 10;
      this.getElementInHtml().style.transform = `translate(${this.X}px,${-this
        .Y}px)`;
    }, 500);
  }
}

var trueSign = new FallingObjects("true", "trueType");
var falseSign = new FallingObjects("false", "falseType");
var myZombie = new zombie();

class Player {
  constructor() {
    this.brain = 5;
    this.X = 0;
    this.Y = 0;
    this.Id = "bunny";
    this.direction = 180;
    this.IsInTheAir = false;
    this.colludeWithTrue = false;
    this.colludeWithAZombie = false;
    this.colludeWithFalse = false;
  }
  getElementInHtml() {
    return document.getElementById(this.Id);
  }
  moveRight() {
    this.X += 10;
    var action;
    this.direction = 0;
    action = `rotateY(${this.direction}deg)translateX(${this.X}px)`;
    this.getElementInHtml().style.transform = action;
  }
  moveLeft() {
    this.X -= 10;
    var action;
    this.direction = 180;
    action = `rotateY(${this.direction}deg)translateX(${-this.X}px)`;
    this.getElementInHtml().style.transform = action;
  }
  fall() {
    return new Promise((resolve, reject) => {
      let intervalId = setInterval(() => {
        if (this.Y === 0) {
          this.IsInTheAir = false;
          clearInterval(intervalId);
          resolve();
          return;
        }
        this.Y -= 10;
        var action;
        if (this.direction === 0) {
          action = `rotateY(${this.direction}deg)translate(${this.X}px,${-this
            .Y}px)`;
        } else {
          action = `rotateY(${this.direction}deg)translate(${-this.X}px,${-this
            .Y}px)`;
        }
        this.getElementInHtml().style.transform = action;
      }, 10);
    });
  }

  removeBrain() {
    if (this.brain > 0) {
      this.brain = this.brain - 1;
    }
  }
  getBrain() {
    return this.brain;
  }
  addBrain() {
    if (this.brain < 5) this.brain = this.brain + 1;
  }

  checkColision(element) {
    console.log("on rentre dans checkcolision");
    return new Promise((resolve, reject) => {
      let element1 = this.getElementInHtml().getBoundingClientRect();
      let element2 = element.getElementInHtml().getBoundingClientRect();
      if (
        element2.left < element1.left + element1.width &&
        element2.left + element2.width > element1.left &&
        element2.top < element1.top + element1.height &&
        element2.height + element2.top > element1.top
      ) {
        //condition to distinguish different collision

        if (element.type == "trueType") {
          this.colludeWithTrue = true;
          console.log(
            "We colude with true element TRUE TYPE ",
            this.colludeWithTrue
          );
        } else {
          this.colludeWithFalse = true;
          console.log(
            "We colude with false element FALSE TYPE ",
            this.colludeWithFalse
          );
        }
        trueSign.hideMe();
        falseSign.hideMe();
      }

      resolve();
    });
  }

  checkZombieCollision(element) {
    let element1 = this.getElementInHtml().getBoundingClientRect();
    let element2 = element.getElementInHtml().getBoundingClientRect();
    if (
      element2.left + element2.width / 2 < element1.left + element1.width &&
      element2.left + element2.width > element1.left &&
      element2.top < element1.top + element1.height &&
      element2.height + element2.top > element1.top
    ) {
      //condition to distinguish different collision

      this.colludeWithAZombie = true;
    }
  }

  handleColision(element) {
    //on ajoute la condition pour executer ca si seulement jamais execute
    if (this.colludeWithTrue || this.colludeWithFalse) {
      var WellAnswered = false;

      console.log(
        "in handle collision pour voir si on entre dans la condition add brain",
        this.colludeWithTrue,
        this.colludeWithFalse,
        element.type,
        actualAnswer
      );

      if (
        this.colludeWithTrue &&
        element.type == "trueType" &&
        actualAnswer === true
      ) {
        this.addBrain();
        WellAnswered = true;
        console.log("YOU WIN THE QUESTION  the answer was true", this.brain);
      }
      if (
        this.colludeWithFalse &&
        element.type == "falseType" &&
        actualAnswer === false
      ) {
        WellAnswered = true;
        this.addBrain();
        console.log("YOU WIN THE QUESTION  the answer was false ", this.brain);
      }

      if (!WellAnswered) {
        //we have a collision with the wrong element

        this.removeBrain();
        console.log(" remove a brain YOU LOOSE THE QUESTION ", this.brain);
      }
      setTimeout(printGifQuestionResult(), 1000);
    }
  }

  jump() {
    let limit = 0;
    console.log(
      "avant de sauter la valeur de colision true ",
      this.colludeWithTrue
    );
    if (!this.IsInTheAir) {
      this.IsInTheAir = true;
      let intervalId = setInterval(() => {
        if (limit > 25) {
          this.fall();
          clearInterval(intervalId);
        }
        this.Y += 20;
        var action;
        if (this.direction === 0) {
          action = `rotateY(${this.direction}deg)translate(${this.X}px,${-this
            .Y}px)`;
        } else {
          action = `rotateY(${this.direction}deg)translate(${-this.X}px,${-this
            .Y}px)`;
        }
        this.getElementInHtml().style.transform = action;
        if (!this.colludeWithTrue && !this.colludeWithFalse) {
          console.log("on va rentrer car collude est negatif");
          this.checkColision(trueSign).then(this.handleColision(trueSign));
          if (!this.colludeWithTrue)
            this.checkColision(falseSign).then(this.handleColision(falseSign));
        }
        limit++;
      }, 10);
    }
  }
}

/*object definitions */

var bunny = new Player();
//le rendre visible avant

const questions = [
  {
    question: `isNan(3)? true Or False? `,
    answer: false
  },
  {
    question: `isNan(Hello)? True or False`,
    answer: true
  },
  {
    question: `true&true? True or False`,
    answer: true
  },
  {
    question: `false&false? True or False`,
    answer: false
  },
  {
    question: `false||true? True or False`,
    answer: true
  },
  {
    question: `true||undefined? True or False`,
    answer: true
  },
  {
    question: `false&&null? True or False`,
    answer: true
  }
];

/*functions */
function typeAQuestion(question) {
  return new Promise((resolve, reject) => {
    var i = 0;
    clearAQuestion();
    var timer = setInterval(function() {
      document.getElementById("question").innerHTML += question[i];
      i++;
      if (i > question.length - 1) {
        clearInterval(timer);
        resolve();
      }
    }, 100);
  });
}

function clearAQuestion() {
  document.getElementById("question").innerHTML = " ";
}
function printGifGameResult(result) {
  if (result == "dead" || "win") {
    if (result == "dead") {
      document.getElementById("dead-iframe").style.visibility = "visible";
      document.getElementById("true-iframe").style.visibility = "hidden";
      document.getElementById("false-iframe").style.visibility = "hidden";
      document.getElementById("win-iframe").style.visibility = "hidden";
    } else {
      document.getElementById("dead-iframe").style.visibility = "hidden";
      document.getElementById("true-iframe").style.visibility = "hidden";
      document.getElementById("false-iframe").style.visibility = "hidden";
      document.getElementById("win-iframe").style.visibility = "visible";
    }
  }
}
function printGifQuestionResult() {
  if (actualAnswer == true) {
    document.getElementById("true-iframe").style.visibility = "visible";
    document.getElementById("false-iframe").style.visibility = "hidden";
    document.getElementById("dead-iframe").style.visibility = "hidden";
    document.getElementById("win-iframe").style.visibility = "hidden";
  } else if (actualAnswer == false) {
    document.getElementById("false-iframe").style.visibility = "visible";
    document.getElementById("dead-iframe").style.visibility = "hidden";
    document.getElementById("true-iframe").style.visibility = "hidden";
    document.getElementById("win-iframe").style.visibility = "hidden";
  }
}

//function animateScript() {}

/*function stopAnimate() {
  clearInterval(tID);
}*/

function updateGame() {
  document.getElementById("countdown").innerHTML = "Bouhhh too Late ";
  setTimeout(printGifQuestionResult(), 3000);
  if (!bunny.colludeWithFalse && !bunny.colludeWithTrue) {
    trueSign.hideMe();
    falseSign.hideMe();
    console.log("remove a brain because no collision and finish the timer ");
    bunny.removeBrain();
  }
  setTimeout(printBrains(), 2000);
}

function setNextRound() {
  if (bunny.getBrain() < 2 || step == questions.length - 1) {
    endGame();
    return false;
  } else {
    step += 1;
    if (step > 0) {
      trueSign.reInitialiaze();
      falseSign.reInitialiaze();
      bunny.colludeWithTrue = false;
      bunny.colludeWithFalse = false;
    }

    return true;
  }
}

function startGame() {
  const shouldContinue = setNextRound();
  if (shouldContinue) {
    console.log("we enter step: " + step);
    actualAnswer = questions[step].answer;
    typeAQuestion(questions[step].question);
    //we need to listen on that
    trueSign.fall();
    falseSign.fall();
    printCountdown().then(startGame);
  }
}

playButton.onclick = startGame;

function endGame() {
  console.log("ici plein de fois");
  var myHtmlzombie = document.getElementById("zombie");
  myHtmlzombie.style.visibility = "visible";
  myZombie.X -= 10;
  myHtmlzombie.style.transform = `translateX(${myZombie.X}px)`;

  bunny.checkZombieCollision(myZombie);
  if (bunny.colludeWithAZombie) {
    //ajouter la condition si le zombie est visible
    bunny.removeBrain();
    setTimeout(printBrains(), 2000);
    setTimeout(printGifGameResult("dead"), 3000);
    typeAQuestion("    YOU LOOSE");
    bunny.hideMe();
    //bunny.getElementInHtml().style.backgroundImage = `url("./images/bunnysprite5.jpg")`;
  }

  requestAnimationFrame(endGame);
}

function printBrains() {
  var brainimgs = document
    .getElementById("brain-section")
    .getElementsByTagName("img");

  var amountofVisibleBrains = bunny.getBrain();

  for (let i = 0; i < 5; i++) {
    if (i < amountofVisibleBrains) {
      brainimgs[i].style.visibility = "visible";
    } else {
      brainimgs[i].style.visibility = "hidden";
    }
  }
}

function printCountdown() {
  var timeleftToAnswer = timeToAnswer;
  return new Promise((resolve, reject) => {
    countDownID = setInterval(function() {
      document.getElementById("countdown").innerHTML =
        timeleftToAnswer + " Sec";

      timeleftToAnswer -= 1;
      if (timeleftToAnswer <= -1) {
        updateGame();
        resetCountDown();
        resolve();
      }
    }, 1000);
  });
}
function resetCountDown() {
  document.getElementById("countdown").innerHTML = timeToAnswer + " Sec";
  clearInterval(countDownID);
}
//animateScript();
document.onkeydown = function(e) {
  switch (e.keyCode) {
    case 37:
      bunny.moveLeft();
      break;
    case 38:
      bunny.jump();
      break;
    case 39:
      bunny.moveRight();
      break;
    default:
      break;
  }
};
