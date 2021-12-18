const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var plank;
var ground;
var higherground;
var con;
var con2;
var rope;
var bubble,bubble_img;
var bg_song;
var canW;
var canH;

function preload()
{
  bubble_img = loadImage("bubble.png")
  bg_img = loadImage("background.png");
  food = loadImage("ice_cream.png");
  kateLOL = loadImage("kateXD.png");
  bacon_img = loadImage("bacon.png");

  bg_song = loadSound("music.mp3");

  idle = loadAnimation("kate_idle-1.png","kate_idle-2.png","kate_idle-3.png","kate_idle-4.png","kate_idle-5.png","kate_idle-6.png");
  eat = loadAnimation("kate_eat-1.png","kate_eat-2.png","kate_eat-3.png","kate_eat-4.png","kate_eat-5.png","kate_eat-6.png","kate_eat-7.png","kate_eat-8.png","kate_eat-9.png");
  sad = loadAnimation("kate_cry-1.png","kate_cry-2.png");
  
  idle.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping= false;
  eat.looping = false; 

  mute_button = loadImage("mute_btn.png");
  unmuted = loadAnimation("mute_btn_on.png");
  muted = loadAnimation("mute_btn_off.png");

  mute_button.playing = true;
  unmuted.playing = true;
  muted.playing = true;

  bacon2_img = loadImage("bacon2.png");
  bacon_zero = loadAnimation("no_bacon.png");
  bacon_one = loadAnimation("half_bacon.png");
  bacon_two = loadAnimation("full_bacon.png");
}

function setup() {
  var isMobile = /iPhone|Android|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile) {
    canW = displayWidth;
    canH = displayHeight;
    createCanvas(displayWidth + 80,displayHeight);
  }
  else {
    canW = windowWidth;
    canH = windowHeight;
    createCanvas(windowWidth,windowHeight);
  }
  
  createCanvas(500,800);
  frameRate(80);

  bg_song.play(true);
  bg_song.setVolume(0.5);
  engine = Engine.create();
  world = engine.world;

   var snack_options = {
    restitution: 0.8
  }
  
  ground = new Ground(250,height-10,width,20);
  snack = Bodies.circle(100,420,15,snack_options);
  World.add(world,snack);
  
  bubble = createSprite(260,570,20,20);
  bubble.addImage(bubble_img);
  bubble.scale = 0.175;

  idle.frameDelay = 20;
  eat.frameDelay = 20;
  kate = createSprite(50,155,100,100);
  kate.addImage(kateLOL);
  kate.scale = 0.25;

  higherground = new Ground(60,190,200,15);
  kate.depth = higherground.depth;
  kate.depth = kate.depth + 1;

  kate.addAnimation('idling',idle);
  kate.addAnimation('eating',eat);
  kate.addAnimation('crying',sad);
  kate.changeAnimation('idling');

  rope = new Rope(4,{x:200,y:450});
  rope2 = new Rope(3,{x:40,y:530});
  con = new Link(rope,snack);
  con2 = new Link(rope2,snack);

  button = createImg('cut_btn.png');
  button.position(170,440);
  button.size(60,60);
  button.mouseClicked(drop);

  button2 = createImg('cut_btn.png');
  button2.position(20,500);
  button2.size(60,60);
  button2.mouseClicked(drop2);

  mute_btn = createSprite(50,50,25,25);
  mute_btn.scale = 0.2;
  mute_btn.addAnimation('on',unmuted);
  mute_btn.addAnimation('off',muted);
  mute_btn.changeAnimation('on');

  //mute_btn.mouseClicked(mute);

  bacon = createSprite(120,340);
  bacon.addImage(bacon_img);
  bacon.scale = 0.4;

  bacon2 = createSprite(250,245);
  bacon2.addImage(bacon_img);
  bacon2.scale = 0.4;

  ellipseMode(RADIUS);
}

function draw() 
{
  background(51);
  image(bg_img,0,0,width,height);
  Engine.update(engine);
  
  push();
  imageMode(CENTER);
  if(snack!=null){
    image(food,snack.position.x,snack.position.y,70,70);
  }
  pop();

  ground.show();
  higherground.show();
  rope.show();
  rope2.show();

  if(collide(snack,kate,80)==true)
  {
    drop2();
    bubble.visible = false;
    World.remove(engine.world,snack);
    snack = null;
    kate.changeAnimation('eating');
  }
  
  if(collide(snack,bubble,40) == true)
  {
    engine.world.gravity.y = -0.5;
    bubble.position.x = snack.position.x;
    bubble.position.y = snack.position.y;
  }

  if(snack!=null && snack.position.y>=850)
  {
    kate.changeAnimation('crying');
    bg_song.stop();
    snack = null;
     
  }

  drawSprites();
}

function drop()
{
  rope.break();
  con.detach();
  con = null; 
}

function drop2()
{
  rope2.break();
  con2.detach();
  con2 = null;
}

function collide(body,sprite,x)
{
  if(body!=null)
        {
         var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
          if(d<=x)
            {
               return true; 
            }
            else{
              return false;
            }
         }
}

function mute()
{
  if(bg_song.isPlaying())
     {
      bg_song.stop();
      mute_btn.changeAnimation('off');
     }
     else{
      bg_song.play();
      mute_btn.changeAnimation('on');
     }
}