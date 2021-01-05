class SmartCar {
    constructor(wih, who) {
        this.pos = createVector(110, 75);
        this.heading = 0;
        this.speed = 0;
        this.acc = 0;
        this.maxSpeed = 5;
        this.crashed = false;
        this.currentCheckPoint = 0;
        this.checkPointTime = 1000;
        this.fitness = 0;
        
        this.vision = [];
        
        this.turnLeft = false;
        this.turnRight = false;
        this.accelerate = false;
        this.brake = false;
        this.turnMag = 0;
        
        this.rays = [];
        this.rays.push(new Ray(this.pos, -PI/2));
        this.rays.push(new Ray(this.pos, -PI/4));
        this.rays.push(new Ray(this.pos, 0));
        this.rays.push(new Ray(this.pos, PI/4));
        this.rays.push(new Ray(this.pos, PI/2));
        
        // 6 inputNodes -> 5 vision rays & current speed
        // 10 hiddenNodes
        // 4 outputNodes -> turnLeft, turnRight, accelerate, brake
        if(wih === undefined) {
            this.brain = new NeuralNetwork(6, 6, 4);
        } else {
            this.brain = new NeuralNetwork(6, 6, 4, wih, who);
        }
    }
    
    calcFitness() {
        
        this.fitness = (Math.pow(this.currentCheckPoint+1,2));// / this.checkPointTime;
    }
    
    turn(angle) {
        this.heading += angle;
    }
    
    getOutputs() {
        // set inputs
        let inputList = [];
        
        
        inputList[0] = this.speed;
        for(let i=0; i<this.vision.length; i++) {
            inputList[i+1] = this.vision[i];
        }       
        
        
        
//        let scaledSpeed = (this.speed / this.maxSpeed) * 0.99 + 0.005;
//        inputList[0] = scaledSpeed;
//        
//        let maxDis = 0;
//        for(let i=0; i<this.vision.length; i++) {
//            if(this.vision[i] > maxDis) {
//                maxDis = this.vision[i];
//            }
//        }
//        if(maxDis > 100) maxDis = 100;
//        for(let i=0; i<this.vision.length; i++) {
//            let visionDist = this.vision[i];
//            if(visionDist > 100) visionDist = 100;
//            let scaledVision = (visionDist / maxDis) * 0.99 + 0.01;
//            inputList[i+1] = scaledVision;
//        }
        
        
        // retrieve outputs
        let outputList = this.brain.query(inputList);
        if(frameCount % 40 == 0) {
            //console.log(inputList);
            //console.log(outputList);
        }
        
        // assign behaviour
        if(outputList[0] > 0.5) {
            this.accelerate = true;
        } else {
            this.accelerate = false;
        }
        if(outputList[1] > 0.5) {
            this.brake = true;
        } else {
            this.brake = false;
        }
        //this.turnMag = outputList[2] - 0.5;
        
//        if(outputList[2] > 0.55) {
//            this.turnLeft = true;
//        } else {
//            this.turnLeft = false;
//        }
//        if(outputList[3] > 0.55) {
//            this.turnRight = true;
//        } else {
//            this.turnRight = false;
//        }
        
        if(outputList[2] > 0.5 && outputList[2] > 1.05 * outputList[3]) {
            this.turnLeft = true;
        } else {
            this.turnLeft = false;
        }
        if(outputList[3] > 0.5 && outputList[3] > 1.05 * outputList[2]) {
            this.turnRight = true;
        } else {
            this.turnRight = false;
        }
        
    }
    
    update() {
        if(!this.crashed) {
            if(this.turnLeft && this.speed > 1) {
                this.turn(-0.05);
            } else if (this.turnLeft && this.speed > 0){
                this.turn(-0.02);
            }
            if(this.turnRight && this.speed > 1) {
                this.turn(0.05);
            } else if (this.turnRight && this.speed > 0){
                this.turn(0.02);
            }
            
            if(this.speed > 1) {
                this.turn(this.turnMag * 0.1);
            } else if(this.speed > 0) {
                this.turn(this.turnMag * 0.03);
            }
            
            if(this.accelerate && this.speed < this.maxSpeed) {
                this.acc = 0.08;
            } else if(!this.accelerate && this.speed > 0) {
                this.acc = -0.05;
            } else {
                this.acc = 0;
            }
            if(this.brake && this.speed > 0) {
                this.acc = -0.15;
            }

            this.speed += this.acc;
            if(this.speed < 0) {
                this.speed = 0;
            }
            let vel = p5.Vector.fromAngle(this.heading);
            vel.setMag(this.speed);
            this.pos.add(vel);
        } else {
            this.speed = 0;
            this.acc = 0;
        }
    }
    
    
    hitbox(walls, checkPoints) {
        // x = rcosTheta     y = rsinTheta
        let theta = Math.atan(8/16);
        let r = Math.sqrt(320); //(Math.pow(16,2) + Math.pow(8,2))
        
        //back left
        let x1 = r * Math.cos(-PI + theta + this.heading) + this.pos.x;
        let y1 = r * Math.sin(-PI + theta + this.heading) + this.pos.y;
        //front left
        let x2 = r * Math.cos(-theta + this.heading) + this.pos.x;
        let y2 = r * Math.sin(-theta + this.heading) + this.pos.y;
        //fron right
        let x3 = r * Math.cos(theta + this.heading) + this.pos.x;
        let y3 = r * Math.sin(theta + this.heading) + this.pos.y;
        //back right
        let x4 = r * Math.cos(PI - theta + this.heading) + this.pos.x;
        let y4 = r * Math.sin(PI - theta + this.heading) + this.pos.y;
        
        //left side
        stroke(242, 27, 239);
        if(!this.crashed) {
            for(let wall of walls) {
                if(intersects(x1,y1,x2,y2,wall.a.x,wall.a.y,wall.b.x,wall.b.y)) {
                    stroke(0, 200, 10);
                    this.crashed = true;
                    break;
                }
            }
        }
        if(displayHitbox) line(x1,y1,x2,y2);
        //front
        stroke(242, 27, 239);
        if(!this.crashed) {
            for(let wall of walls) {
                if(intersects(x2,y2,x3,y3,wall.a.x,wall.a.y,wall.b.x,wall.b.y)) {
                    stroke(0, 200, 10);
                    this.crashed = true;
                    break;
                }
            }
        }
        if(displayHitbox) line(x2,y2,x3,y3);
        //right side
        stroke(242, 27, 239);
        if(!this.crashed) {
            for(let wall of walls) {
                if(intersects(x3,y3,x4,y4,wall.a.x,wall.a.y,wall.b.x,wall.b.y)) {
                    stroke(0, 200, 10);
                    this.crashed = true;
                    break;
                }
            }
        }
        if(displayHitbox) line(x3,y3,x4,y4);
        //back
        stroke(242, 27, 239);
        if(!this.crashed) {
            for(let wall of walls) {
                if(intersects(x4,y4,x1,y1,wall.a.x,wall.a.y,wall.b.x,wall.b.y)) {
                    stroke(0, 200, 10);
                    this.crashed = true;
                    break;
                }
            }
        }
        if(displayHitbox) line(x4,y4,x1,y1);
        
        if(!this.crashed) {
            let cPAX = checkPoints[this.currentCheckPoint].a.x;
            let cPAY = checkPoints[this.currentCheckPoint].a.y;
            let cPBX = checkPoints[this.currentCheckPoint].b.x;
            let cPBY = checkPoints[this.currentCheckPoint].b.y;
            
            if(intersects(x1,y1,x2,y2,cPAX,cPAY,cPBX,cPBY)) {
                this.currentCheckPoint ++;
                this.checkPointTime = count;
            } else if(intersects(x2,y2,x3,y3,cPAX,cPAY,cPBX,cPBY)) {
                this.currentCheckPoint ++;
                this.checkPointTime = count;
            } else if(intersects(x3,y3,x4,y4,cPAX,cPAY,cPBX,cPBY)) {
                this.currentCheckPoint ++;
                this.checkPointTime = count;
            } else if(intersects(x4,y4,x1,y1,cPAX,cPAY,cPBX,cPBY)) {
                this.currentCheckPoint ++;
                this.checkPointTime = count;
            }
            
        }
    }
    
    
    look(walls) {
        if(!this.crashed){
            this.vision = [];
            let rayIndex = 0;
            for (let ray of this.rays) {
                let closest = null;
                let record = Infinity;
                for(let wall of walls) {
                    const pt = ray.cast(wall, this.heading);
                    if(pt) {
                        const d = p5.Vector.dist(this.pos, pt);
                        if(d < record) {
                            record = d;
                            closest = pt;
                        }
                    }
                }
                if(closest) {
                    //console.log(closest.x, closest.y);
                    this.vision[rayIndex] = dist(this.pos.x,this.pos.y, closest.x, closest.y);
                    stroke(66, 245, 227);
                    strokeWeight(1);
                    if(displayVisionLines) {
                        line(this.pos.x, this.pos.y, closest.x, closest.y);
                        noFill();
                        ellipse(closest.x, closest.y, 5, 5);
                    }
                }
                rayIndex ++;
            }
        } 
    }
    
    
    render() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.heading);
        image(carImg,-16,-8,32,16);
//        if(this.turnLeft) {
//            stroke(0,200,0);
//            line(-16,-8,16,-8);
//        }
//        if(this.turnRight) {
//            stroke(0,200,0);
//            line(-16,8,16,8);
//        }
//        if(this.accelerate) {
//            stroke(0,200,0);
//            line(16,-8,16,8);
//        }
//        if(this.brake) {
//            stroke(200,20,0);
//            line(-16,-8,-16,8);
//        }
        //image(carImg,-30,-15,60,30);
        //(45,20)
        pop();
    }
    
    
    
    
}