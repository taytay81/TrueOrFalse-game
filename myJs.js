var timeToAnswer = 5;
const playButton = document.getElementById("play");
var actualAnswer = "";
var step = -1;
var countDownID;
var trajectory = [10, , 6, 20, -10, -20, 5, 30];

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

    this.type = type;
    this.Y -= 10;
  }

  reInitialiaze(type) {
    this.X = 10;
    this.Y = -50;
    this.IsInTheAir = false;
    this.collison = false;
    this.fallingSpeed = "slow";
    var imgs = document.getElementById(this.Id).getElementsByTagName("img");

    if (type == "trueType") {
      imgs[0].src = "./images/truewax.png";
    } else if (type == "falseType") {
      imgs[0].src = "./images/false-wax.png";
    }
    this.getElementInHtml().style.transform = `translate(${this.X}px,${-this
      .Y}px)`;
    this.makeMeVisible();
  }

  getElementInHtml() {
    return document.getElementById(this.Id);
  }
  showCrap() {
    var imgs = document.getElementById(this.Id).getElementsByTagName("img");
    imgs[0].src = "./images/crap.png";
    imgs[0].style.visibility = "visible";
  }

  showThumbUp() {
    var imgs = document.getElementById(this.Id).getElementsByTagName("img");
    imgs[0].src = "./images/thumbup.png";
    imgs[0].style.visibility = "visible";
  }

  makeMeVisible() {
    var imgs = document.getElementById(this.Id).getElementsByTagName("img");
    imgs[0].style.visibility = "visible";
  }
  hideMe = () => {
    var imgs = document.getElementById(this.Id).getElementsByTagName("img");
    imgs[0].style.visibility = "hidden";
  };

  fall(speed) {
    this.makeMeVisible();
    //modulate the falling speed
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
    }, speed);
  }
}
//setting up the background
var trueSign = new FallingObjects("true", "trueType");
var falseSign = new FallingObjects("false", "falseType");
var cloud1 = new FallingObjects("cloud1", "cloudType");
var cloud2 = new FallingObjects("cloud2", "cloudType");
var cloud3 = new FallingObjects("cloud3", "cloudType");
var cloud4 = new FallingObjects("cloud4", "cloudType");
var cloud5 = new FallingObjects("cloud5", "cloudType");
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
    this.isDead = false;
  }

  getElementInHtml() {
    return document.getElementById(this.Id);
  }
  hideMe() {
    document.getElementById(this.Id).style.visibility = "hidden";
  }
  winning() {
    var newBunny = document.getElementById(this.Id);
    newBunny.style.backgroundImage = "url('./images/winbunnie.png')";
    newBunny.style.width = "120px";
    newBunny.style.visibility = "visible";
    this.isDead = false;
  }
  dying() {
    var newBunny = document.getElementById(this.Id);
    newBunny.style.backgroundImage = "url('./images/deadbunnie.png')";
    newBunny.style.width = "120px";
    newBunny.style.visibility = "visible";

    this.isDead = true;
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
        } else if (element.type == "falseType") {
          this.colludeWithFalse = true;
        }
        trueSign.hideMe();
        falseSign.hideMe();

        if (this.colludeWithFalse && actualAnswer == false) {
          falseSign.showThumbUp();
          setTimeout(falseSign.hideMe, 300);
        } else if (this.colludeWithFalse && actualAnswer == true) {
          falseSign.showCrap();
          setTimeout(falseSign.hideMe, 300);
        } else if (this.colludeWithTrue && actualAnswer == true) {
          trueSign.showThumbUp();
          setTimeout(trueSign.hideMe, 300);
        } else {
          trueSign.showCrap();
          setTimeout(trueSign.hideMe, 300);
        }
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
  },
  {
    question: `false||!true? True or False`,
    answer: false
  },
  {
    question: `true&&false||true? `,
    answer: true
  },
  {
    question: `(true||false)&&false?`,
    answer: false
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
  if (amountofVisibleBrains <= 0) {
    document.getElementById("countdown").innerHTML = "Bouh too late ";
    document.getElementById("brain-section").innerHTML = "100% Eaten";
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

function setNextRound() {
  if (bunny.getBrain() < 2 || step == questions.length - 1) {
    endGame();
    return false;
  } else {
    step += 1;
    if (step > 0) {
      trueSign.reInitialiaze("trueType");
      falseSign.reInitialiaze("falseType");
      cloud1.reInitialiaze("cloudType");
      cloud2.reInitialiaze("cloudType");
      cloud3.reInitialiaze("cloudType");
      cloud4.reInitialiaze("cloudType");
      cloud5.reInitialiaze("cloudType");
      bunny.colludeWithTrue = false;
      bunny.colludeWithFalse = false;
    }

    return true;
  }
}

function startGame() {
  const shouldContinue = setNextRound();
  if (shouldContinue) {
    actualAnswer = questions[step].answer;
    typeAQuestion(questions[step].question);
    //we need to listen on that
    trueSign.fall(500);
    falseSign.fall(500);
    cloud1.fall(300);
    cloud2.fall(400);
    cloud3.fall(200);
    cloud4.fall(300);
    cloud5.fall(400);
    printCountdown().then(startGame);
  }
}

function updateGame() {
  printGifQuestionResult();
  if (!bunny.colludeWithFalse && !bunny.colludeWithTrue) {
    trueSign.hideMe();
    falseSign.hideMe();
    cloud1.hideMe();
    cloud2.hideMe();
    cloud3.hideMe();
    cloud4.hideMe();
    cloud5.hideMe();
    bunny.removeBrain();
  }
  printBrains();
}

function endGame() {
  if (bunny.getBrain() < 2) {
    var myHtmlzombie = document.getElementById("zombie");
    myHtmlzombie.style.visibility = "visible";
    myZombie.X -= 10;
    myHtmlzombie.style.transform = `translateX(${myZombie.X}px)`;

    bunny.checkZombieCollision(myZombie);
    if (bunny.colludeWithAZombie) {
      bunny.removeBrain();
      printBrains();
      printGifGameResult("dead");
      bunny.dying();
      document.getElementById("question").innerHTML = "OOPS you Loose !";
    }
    if (myZombie.X > -2000) {
      requestAnimationFrame(endGame);
    }
  } else {
    typeAQuestion("CONGRATS YOU ARE A REAL IRONHACKER ");
    printGifGameResult("win");
    bunny.winning();
  }
}

//on the click of the play button
playButton.onclick = startGame;
// listen on the keys
if (!bunny.isDead) {
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
}
