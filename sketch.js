var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var Ground, Background;

var obstaclesGroup, obstacleImg;
var backgroundImg;
var score=0;
var jumpSound, collidedSound;

var gameOver, restart;


function preload(){
  jumpSound = loadSound("assets/sounds/jump.wav")
  collidedSound = loadSound("assets/sounds/collided.wav")
  
  backgroundImg = loadImage("assets/background.gif")
  
  trex_running = loadAnimation("assets/newRunner_01.gif","assets/newRunner_02.gif","assets/newRunner_03.gif","assets/newRunner_04.gif","assets/newRunner_05.gif","assets/newRunner_06.gif","assets/newRunner_07.gif","assets/newRunner_08.gif");
  trex_collided = loadAnimation("assets/newRunner_01.gif");
  
  obstacleImg = loadImage("assets/obstacle.png");
  
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  Background = createSprite(300,300);
  Background.addImage(backgroundImg);
  Background.scale=1.3;

  trex = createSprite(50,height-70,20,50);  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.setCollider('circle',0,0,65);
  trex.scale = 0.7;
  //trex.debug=true;
  
  Ground = createSprite(width/2,height+10,width,125);  
  Ground.shapeColor = "#000000";

  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
  // invisibleGround.visible =false

  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //console.log(trex.y);

  background('#74A5BB');
  textSize(20);
  fill("black")
  text("Score: "+ score,30,30);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    Background.velocityX = -(6 + 3*score/100);

    if(keyDown("space") && trex.y >=480) {
      trex.velocityY = -13;
      jumpSound.play()
    }
    
    if(touches.length > 0 && trex.y  >= height-120) {
      jumpSound.play()
      trex.velocityY = -13;
       touches = [];
    }
    
    trex.velocityY = trex.velocityY + 0.8
  
    if (Background.x < 0){
      Background.x = Background.width/2;
    }
  
    trex.collide(Ground);
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        collidedSound.play()
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    Background.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    
    if(touches.length>0) {      
      reset();
      touches = []
    }
  }
  
    if(mousePressedOver(restart)){
      reset();
    }
  
  drawSprites();
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-95,20,30);
    obstacle.setCollider('circle',0,0,45)
    // obstacle.debug = true
    obstacle.addImage(obstacleImg);

    obstacle.velocityX = -(6 + 3*score/100);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = trex.depth;
    trex.depth +=1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  
}
