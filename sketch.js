var dog, dogImg2, happyDog, database, foodS, foodStock;
var feed;
var addFood;
var fedTime, lastFed;
var foodObj;

function preload()
{
  dogImg = loadImage("Dog.png");
  happyDog = loadImage("happydog.png");
}

function setup() {
	createCanvas(1000, 500);
  database = firebase.database();
  console.log(database);

  dog = createSprite(600, 220, 20, 20);
  dog.scale = 0.2;
  dog.addImage(dogImg);

  foodObj = new Food(20, 20, 50, 50);

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  })

  fill(255, 255, 254);
  textSize(15);
  if(lastFed>=12) {
    text("Last Feed : "+ lastFed%12+"PM", 350, 30);
  } else if(lastFed===0) {
    text("Last Feed : 12 AM", 350, 30);
  } else {
    text("Last Feed : "+ lastFed + "AM", 350, 30);
  }

  feed = createButton("Feed the dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background(46, 139, 87);

  foodObj.display();
  drawSprites();
  //add styles here

}

function readStock(data) {
  foodS = data.val();
}

function writeStock(x) {
  if(x<=0) {
    x = 0;
  } else {
    x = x-1
  }
  database.ref('/').update({
    food: x
  })
}

function feedDog() {
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods() {
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}



