class Car {
    constructor() {
        this.pos = createVector(110, 75);
        this.heading = 0;
        this.speed = 0;
        this.acc = 0;
        this.maxSpeed = 6;
        this.crash = false;
        
        this.rays = [];
        this.rays.push(new Ray(this.pos, -PI/2));
        this.rays.push(new Ray(this.pos, -PI/4));
        this.rays.push(new Ray(this.pos, 0));
        this.rays.push(new Ray(this.pos, PI/4));
        this.rays.push(new Ray(this.pos, PI/2));
    }
    
    turn(angle) {
        this.heading += angle;
    }
    
    update() {
        if(turnLeft && this.speed > 1) {
            this.turn(-0.05);
        } else if (turnLeft && this.speed > 0){
            this.turn(-0.02);
        }
        if(turnRight && this.speed > 1) {
            this.turn(0.05);
        } else if (turnRight && this.speed > 0){
            this.turn(0.02);
        }
        if(accelerate && this.speed < this.maxSpeed) {
            this.acc = 0.08;
        } else if(!accelerate && this.speed > 0) {
            this.acc = -0.05;
        } else {
            this.acc = 0;
        }
        if(brake && this.speed > 0) {
            this.acc = -0.15;
        }
        
        this.speed += this.acc;
        if(this.speed < 0) {
            this.speed = 0;
        }
        let vel = p5.Vector.fromAngle(this.heading);
        vel.setMag(this.speed);
        this.pos.add(vel);
    }
    
    hitbox(walls) {
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
        for(let wall of walls) {
            if(intersects(x1,y1,x2,y2,wall.a.x,wall.a.y,wall.b.x,wall.b.y)) {
                stroke(0, 200, 10);
            }
        }
        if(displayHitbox) line(x1,y1,x2,y2);
        //front
        stroke(242, 27, 239);
        for(let wall of walls) {
            if(intersects(x2,y2,x3,y3,wall.a.x,wall.a.y,wall.b.x,wall.b.y)) {
                stroke(0, 200, 10);
            }
        }
        if(displayHitbox) line(x2,y2,x3,y3);
        //right side
        stroke(242, 27, 239);
        for(let wall of walls) {
            if(intersects(x3,y3,x4,y4,wall.a.x,wall.a.y,wall.b.x,wall.b.y)) {
                stroke(0, 200, 10);
            }
        }
        if(displayHitbox) line(x3,y3,x4,y4);
        //back
        stroke(242, 27, 239);
        for(let wall of walls) {
            if(intersects(x4,y4,x1,y1,wall.a.x,wall.a.y,wall.b.x,wall.b.y)) {
                stroke(0, 200, 10);
            }
        }
        if(displayHitbox) line(x4,y4,x1,y1);
    }
    
    look(walls) {
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
                stroke(247, 179, 32);
                strokeWeight(2);
                if(displayVisionLines) {
                    line(this.pos.x, this.pos.y, closest.x, closest.y);
                    noFill();
                    ellipse(closest.x, closest.y, 5, 5);
                }
            }
        }
        
    }
    
    
    render() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.heading);
        image(car2Img,-16,-8,32,16);
        //image(carImg,-30,-15,60,30);
        //(45,20)
        pop();
    }
}
