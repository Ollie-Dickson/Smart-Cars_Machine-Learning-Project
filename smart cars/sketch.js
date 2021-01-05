let trackImg;
let carImg;
let car2Img;
let trackData;
let checkPointData;
var count = 0;
var gen = 1;
var stopCounter = 0;

var turnLeft = false;
var turnRight = false;
var accelerate = false;
var brake = false;

var population;
var player;
var popSize = 70;
let walls = [];
let checkPoints = [];

var recordLines = false;
var drawing = false;
var shift = false;
var nextGen = false;
var point1;
var point2;
var point1Array = [];
var point2Array = [];
var checkPoint1Array = [];
var checkPoint2Array = [];
var saveOn = false;

var displayHitbox = false;
var displayVisionLines = false;

function preload() {
    trackImg = loadImage("assets/racetrack2.png");
    carImg = loadImage("assets/blueCar.png");
    car2Img = loadImage("assets/redCar.png");
    trackData = loadTable("assets/trackData2.csv", "csv", "header");
    checkPointData = loadTable("assets/checkPoints2.csv", "csv", "header");
}

function setup() {
    createCanvas(1000, 700);
    //image(trackImg,0,0);
    
    point1 = createVector();
    point2 = createVector();
    loadTrackData();
    for(let i=0; i<point1Array.length; i++) {
        let x1 = int(point1Array[i].x);
        let y1 = int(point1Array[i].y);
        let x2 = int(point2Array[i].x);
        let y2 = int(point2Array[i].y);
        walls.push(new Boundary(x1, y1, x2, y2));
    }
    walls.push(new Boundary(0, 0, width, 0));
    walls.push(new Boundary(width, 0, width, height));
    walls.push(new Boundary(width, height, 0, height));
    walls.push(new Boundary(0, height, 0, 0));
    
    for(let i=0; i<checkPoint1Array.length; i++) {
        let x1 = int(checkPoint1Array[i].x);
        let y1 = int(checkPoint1Array[i].y);
        let x2 = int(checkPoint2Array[i].x);
        let y2 = int(checkPoint2Array[i].y);
        checkPoints.push(new Boundary(x1, y1, x2, y2));
    }
//    let numRows = trackData.getRowCount();
//    console.log(numRows);
    population = new Population(popSize, walls, checkPoints);
    player = new Car();
}

function draw() {
    image(trackImg,0,0);
    population.run();
    player.update();
    player.look(walls);
    player.render();
    player.hitbox(walls);
    
    
    let genText = "Generation: " + gen;
    let countText = "Time: " + count;
    let stopText = "Stop Counter: " + stopCounter;
    let popText = "Population: " + popSize;
    let visionText = "Toggle Vision Lines: press 'v'";
    textSize(12);
    fill(255);
    stroke(242, 27, 239);
    text(genText, 10, 10, 100, 15);
    text(countText, 10, 20, 100, 15);
    text(stopText, 10, 30, 100, 15);
    text(popText, 100, 10, 100, 15);
    if(frameCount > 1) {
        let frames = frameRate();
        //console.log(frames);
        let frameText = "FrameRate: " + int(frames);
        text(frameText,210, 10, 100, 15);
    }
    stroke(93, 212, 34);
    text(visionText, 400, 10, 200, 15);
    
    if(population.allCrashed() || nextGen) {
        population.evaluate();
        population.selection();
        count = 0;
        gen ++;
        //console.log(gen);
        nextGen = false;
        stopCounter = 0;
    }
    count++;
    
    for(let wall of walls) {
        let col = color('rgb(200,0,0)');
        //wall.show(col);
    }
    
    for(let checkPoint of checkPoints) {
        let col = color('rgb(0,200,0)');
        //checkPoint.show(col);
    }
    
    
    if(saveOn) {
        //saveTrackData();
        console.log("attempted save.");
        saveOn = false;
    }
}

function saveTrackData() {
    trackData.clearRows();
    for(let i=0; i<point1Array.length; i++) {
       let newRow = trackData.addRow();
        newRow.setString('p1_x', point1Array[i].x);
        newRow.setString('p1_y', point1Array[i].y);
        newRow.setString('p2_x', point2Array[i].x);
        newRow.setString('p2_y', point2Array[i].y);
    }
    for (let r = 0; r < trackData.getRowCount(); r++)
        for (let c = 0; c < trackData.getColumnCount(); c++)
            print(trackData.getString(r, c));
    
    saveTable(trackData,"checkPoints2.csv","csv");
}

//    // p5 saveTable is broke as heck
//    // everything saves in one column

function loadTrackData() {
//    let p1_x = trackData.getColumn('p1_x');
//    let p1_y = trackData.getColumn('p1_y');
//    let p2_x = trackData.getColumn('p2_x');
//    let p2_y = trackData.getColumn('p2_y');
//    for(let i=0; i<trackData.getRowCount(); i++) {
//        console.log(p1_x[i] +" "+ p1_y[i] +" "+ p2_x[i] +" "+ p2_y[i] +"\n");
//    }
    
    //console.log(trackData.getRowCount());
    let n = 1;
    for(let i=3; i<trackData.getRowCount(); i++){
        if(n == 1) {
            point1 = createVector(trackData.get(i,0),trackData.get(i+1,0));
            point1Array.push(point1.copy());
            //console.log(i);
            n++;
        } else if (n == 2) {
            n++;
        } else if (n == 3) {
            point2 = createVector(trackData.get(i,0),trackData.get(i+1,0));
            point2Array.push(point2.copy());
            n++;
        } else if (n == 4) {
            n = 1;
        }
    }
    
    n = 1;
    for(let i=3; i<checkPointData.getRowCount(); i++) {
        if(n == 1) {
            point1 = createVector(checkPointData.get(i,0),checkPointData.get(i+1,0));
            checkPoint1Array.push(point1.copy());
            //console.log(i);
            n++;
        } else if (n == 2) {
            n++;
        } else if (n == 3) {
            point2 = createVector(checkPointData.get(i,0),checkPointData.get(i+1,0));
            checkPoint2Array.push(point2.copy());
            n++;
        } else if (n == 4) {
            n = 1;
        }
    }
    //console.log(point1Array.length);
    
}

// returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
function intersects(a,b,c,d,p,q,r,s) {
  var det, gamma, lambda;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    return false;
  } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }
};


function keyPressed() {
    if ((keyCode == RIGHT_ARROW || keyCode == 68) && !turnRight) {
        turnRight = true;
    }
    if ((keyCode == LEFT_ARROW || keyCode == 65) && !turnLeft) {
        turnLeft = true;
    }
    if ((keyCode == UP_ARROW || keyCode == 87) && !accelerate) {
        accelerate = true;
    }
    if ((keyCode == DOWN_ARROW || keyCode == 83) && !brake) {
        brake = true;
    }
    if(keyCode == 16 && !shift) {
        shift = true;
    }
    if(keyCode == 84) { //'t' for save
        saveOn = true;
    }
    if(keyCode == 78) { //'n' for next
        nextGen = true;
    }
    if(keyCode == 86) { //'v' for vision toggle
        if(displayVisionLines) {
            displayVisionLines = false;
        } else {
            displayVisionLines = true;
        }
    }
}

function keyReleased() {
    if ((keyCode == RIGHT_ARROW || keyCode == 68) && turnRight) {
        turnRight = false;
    }
    if ((keyCode == LEFT_ARROW || keyCode == 65) && turnLeft) {
        turnLeft = false;
    }
    if ((keyCode == UP_ARROW || keyCode == 87) && accelerate) {
        accelerate = false;
    }
    if ((keyCode == DOWN_ARROW || keyCode == 83) && brake) {
        brake = false;
    }
    if (keyCode == 16 && shift) {
        shift = false;
    }
}

function mousePressed() {
    if(!shift && recordLines) {
        if(!drawing) {
            point1.x = mouseX;
            point1.y = mouseY;
            drawing = true;
        } else {
            point2.x = mouseX;
            point2.y = mouseY;
            stroke(0);
            strokeWeight = 2;
            line(point1.x,point1.y,point2.x,point2.y);
            point1Array.push(point1.copy());
            point2Array.push(point2.copy());
            console.log("p1_x:"+ point1.x +" p1_y:"+ point1.y +" p2_x:"+ point2.x +" p2_y:"+ point2.y);
            drawing = false;
        } 
    } else if(recordLines) {
        if(drawing) {
            point2.x = mouseX;
            point2.y = mouseY;
            stroke(0);
            strokeWeight = 2;
            line(point1.x,point1.y,point2.x,point2.y);
            point1Array.push(point1.copy());
            point2Array.push(point2.copy());
            console.log("p1_x:"+ point1.x +" p1_y:"+ point1.y +" p2_x:"+ point2.x +" p2_y:"+ point2.y);
            drawing = false;
        } else {
            point1.x = point2.x;
            point1.y = point2.y;
            point2.x = mouseX;
            point2.y = mouseY;
            stroke(0);
            strokeWeight = 2;
            line(point1.x,point1.y,point2.x,point2.y);
            point1Array.push(point1.copy());
            point2Array.push(point2.copy());
            console.log("p1_x:"+ point1.x +" p1_y:"+ point1.y +" p2_x:"+ point2.x +" p2_y:"+ point2.y);
            drawing = false;
        }
    }     
    
}