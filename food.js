class Food {

    pickLocation() {
        var cols = floor(width/scl);
        var rows = floor(height/scl);
        this.food = createVector(floor(random(cols)), floor(random(rows)));
        this.food.mult(scl);
    }

    show() {
        fill(0, 255, 0)
        rect(this.food.x, this.food.y, scl, scl)
    }
  
}