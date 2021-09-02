class Particle {
  constructor() {
    this.fov = 90;
    this.pos = createVector(100, 100);
    this.rays = [];
    this.heading = 0;
    for (let a = -this.fov / 2; a < this.fov / 2; a += 1) {
      this.rays.push(new Ray(this.pos, radians(a)));
    }
  }

  updateFOV(fov) {
    this.fov = fov;
    this.rays = [];
    for (let a = -this.fov / 2; a < this.fov / 2; a += 1) {
      this.rays.push(new Ray(this.pos, radians(a) + this.heading));
    }
  }

  rotate(angle) {
    this.heading += angle;
    let index = 0;
    for (let a = -this.fov / 2; a < this.fov / 2; a += 1) {
      this.rays[index].setAngle(radians(a) + this.heading);
      index++;
    }
  }

  move(step) {
    const vel = p5.Vector.fromAngle(this.heading);
    vel.setMag(step);
    this.pos.add(vel);
  }

  update(x, y) {
    this.pos.set(x, y);
  }

  show() {
    noStroke();
    fill("green");
    ellipse(this.pos.x, this.pos.y, 12);
  }

  look(walls) {
    const scene = [];
    for (let i = 0; i < this.rays.length; i++) {
      const ray = this.rays[i];
      let closest = null;
      let record = Infinity;
      for (let wall of walls) {
        const pt = ray.cast(wall);
        if (pt) {
          let d = p5.Vector.dist(this.pos, pt);
          // const a = ray.dir.heading() - this.heading;
          // d *= cos(a);
          if (d < record) {
            record = min(d, record);
            closest = pt;
          }
        }
      }
      if (closest) {
        let mid = this.rays.length / 2;
        if (i !== mid) {
          stroke(255);
        } else {
          stroke(0, 255, 0);
        }
        line(this.pos.x, this.pos.y, closest.x, closest.y);
      }
      scene[i] = record;
    }
    return scene;
  }
}
