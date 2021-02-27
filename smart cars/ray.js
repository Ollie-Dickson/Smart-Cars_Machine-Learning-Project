class Ray {
    constructor(pos, angle){
        this.pos = pos;
        this.angle = angle;
        this.dir = createVector();
    }
    
    getDir() {
        console.log(this.dir);
    }
    
    //Calculates the point where vision ray intersects given boundary
    cast(wall, heading) {
        // line intersection calculations
        // ref https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
        this.dir = p5.Vector.fromAngle(heading + this.angle);
        const x1 = wall.a.x;
        const y1 = wall.a.y;
        const x2 = wall.b.x;
        const y2 = wall.b.y;

        const x3 = this.pos.x;
        const y3 = this.pos.y;
        const x4 = this.pos.x + this.dir.x;
        const y4 = this.pos.y + this.dir.y;
        
        const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (den == 0) { //condtion when lines are parallel
          return; //(null)
        }
        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
        if (t > 0 && t < 1 && u > 0) {
          const pt = createVector();
          pt.x = x1 + t * (x2 - x1);
          pt.y = y1 + t * (y2 - y1);
          return pt;
        } else {
          return;
        }
    }

}