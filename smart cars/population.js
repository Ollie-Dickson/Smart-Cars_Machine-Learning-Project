class Population {
    constructor(popSize, walls, checkPoints) {
        this.popSize = popSize;
        this.walls = walls;
        this.checkPoints = checkPoints;
        this.cars = [];
        this.matingPool = [];
        
        for(let i=0; i<this.popSize; i++) {
            this.cars[i] = new SmartCar();
        }
    }
    
    // check stop conditions
    allCrashed() {
        for(let car of this.cars) {
            if(count > 100) {
                if(car.speed > 0.2 && car.currentCheckPoint > 2) {
                    stopCounter = 0;
                    return false;
                } 
            } else {
                if(!car.crashed) {
                    stopCounter = 0;
                    return false;
                }
            }
        }
        if(stopCounter < 60) {
            stopCounter++;
            return false;
        } else {
            return true;
        }
    }
    
    //Evaluate fitness and create mating pool
    evaluate() {
        let maxFit = 0;
        for (let i=0; i<this.popSize; i++) {
            this.cars[i].calcFitness();
            if(this.cars[i].fitness > maxFit) {
                maxFit = this.cars[i].fitness;
            }
        }
        console.log("Max fitness: " + maxFit);
        for (let i=0; i<this.popSize; i++) {
            this.cars[i].fitness /= maxFit;
        }
        this.matingPool = [];
        for (let i=0; i<this.popSize; i++) {
            let n = this.cars[i].fitness * 100;
            for(let j=0; j<n; j++) {
                this.matingPool.push(this.cars[i]);
            }
        }
    }
    
    // Select parents from mating pool and generate child cars using crossover and mutation
    selection() {
        let newCars = [];
        for (let i=0; i< this.cars.length; i++) {
            //select parents
            let parentA = random(this.matingPool);
            let parentB = random(this.matingPool);
            let wihA = parentA.brain.wih;
            let whoA = parentA.brain.who;
            let wihB = parentA.brain.wih;
            let whoB = parentA.brain.who;
            //crossover
            let childwih = this.crossOver(wihA,wihB,parentA.brain.iNodes,parentA.brain.hNodes);
            let childwho = this.crossOver(whoA,whoB,parentA.brain.hNodes,parentA.brain.oNodes);
            //mutation
            childwih = this.mutation(childwih, parentA.brain.iNodes,parentA.brain.hNodes);
            childwho = this.mutation(childwho, parentA.brain.hNodes,parentA.brain.oNodes);
            //add child
            newCars[i] = new SmartCar(childwih, childwho);
        }
        this.cars = newCars;
    }
    
    // creates new weight values for given layers by mixing values from two parents
    crossOver(wpqA,wpqB, pNodes, qNodes) {
        let weightCount = pNodes * qNodes;
        let mid = floor(random(weightCount));
        let n = 0;
        
        let wpqNew = [];
        for(let q=0; q<qNodes; q++) {
            let rowq = [];
            for(let p=0; p<pNodes; p++) {
                if(n < mid) {
                    rowq.push(wpqA[q][p]);
                } else {
                    rowq.push(wpqB[q][p]);
                }
                n++;
            }
            wpqNew.push(rowq);
        }
        return wpqNew;
    }
    
    //Assign random weight values to 2% of the new weights
    mutation(wpq, pNodes, qNodes) {
        let wpqNew = [];
        for(let q=0; q<qNodes; q++) {
            let rowq = [];
            for(let p=0; p<pNodes; p++) {
                if(random(1) < 0.02) {
                    //rowq.push(2 * Math.random() -1);
                    rowq.push(Math.random(1) - 0.5);
                } else {
                    rowq.push(wpq[q][p]);
                }
            }
            wpqNew.push(rowq);
        }
        return wpqNew;
    }
    
    
    run() {
        for (let car of this.cars) {
            car.hitbox(this.walls, this.checkPoints);
            car.look(this.walls);
            car.getOutputs();
            car.update();
            car.render();
        }
    }
}