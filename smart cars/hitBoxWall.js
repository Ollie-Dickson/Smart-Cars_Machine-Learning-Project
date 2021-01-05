class HitBoxWall {
    constructor(pos, bearing, x1, y1, x2, y2) {
        this.pos = pos;
        this.bearing = bearing;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    
    intersects(wall) { //abcd > x1,y1,x2,y2  pqrs > wall.a.x,wall.a.y,wall.b.x,wall.b.y
        translate(this.pos.x, this.pos.y);
        rotate(this.bearing, this.pos);
        stroke(200,0,0);
        line(this.x1,this.y1,this.x2,this.y2);
        
        
        var det, gamma, lambda;
        //det = (c - a) * (s - q) - (r - p) * (d - b);
        det = (this.x2 - this.x1) * (wall.b.y - wall.a.y) - (wall.b.x - wall.a.x) * (this.y2 - this.y1);
        if(det === 0) {
            return false;
        } else {
            //lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
            lambda = ((wall.b.y - wall.a.y) * (wall.b.x - this.x1) + (wall.a.x - wall.b.x) * (wall.b.y - this.y1)) / det;
            //gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
            ((this.y1 - this.y2) * (wall.b.x - this.x1) + (this.x2 - this.x1) * (wall.b.y - this.y1)) / det;
            return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
        }
        
    }
}