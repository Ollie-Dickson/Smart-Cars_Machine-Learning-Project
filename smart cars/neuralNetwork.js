class NeuralNetwork {
    
    constructor(inputNodes, hiddenNodes, outputNodes, wih, who) {
        this.iNodes = inputNodes;
        this.hNodes = hiddenNodes;
        this.oNodes = outputNodes;
        
        // activation function
        this.sigmoid = (z) => 1 / (1 + Math.exp(-z));
        
        
        if(wih === undefined) {
            //input->hidden connections
            //                   wih: inputNodei    hiddenNodeh
            // 3x3 example where w12: inputNode1 -> hiddenNode2
            // [{w11, w21, w31}
            //  {w12, w22, w32}
            //  {w13, w23, w33}]
            // wih -> 6x10 
            // [{w1:1, w2:1, w3:1, w4:1, w5:1, w6:1}
            //  {     ...     }
            //  {w1:10, w2:10, w3:10, w4:10, w5:10, w6:10}]
            this.wih = [];
            for(let h=0; h<this.hNodes; h++) {
                let rowh =[];
                for(let i=0; i<this.iNodes; i++) {
                    //rowh.push(2 * Math.random() -1);
                    rowh.push(Math.random(1) - 0.5);
                }
                this.wih.push(rowh);
            } 
            // confusingly, weight wih is accessed this.wih[h][i]

            //hidden->output connections
            // who -> 10x4
            // [{w1:1, w2:1, w3:1, w4:1, w5:1, w6:1, w7:1, w8:1, w9:1, w10:1}
            //  {      ...         }
            //  {w1:4, w2:4, w3:4, w4:4, w5:4, w6:4, w7:4, w8:4, w9:4, w10:4}]
            this.who = [];
            for(let o=0; o<this.oNodes; o++) {
                let rowo =[];
                for(let h=0; h<this.hNodes; h++) {
                    rowo.push(2 * Math.random() -1);
                }
                this.who.push(rowo);
            }
            // weight who accessed this.who[o][h]
        } else {
            this.wih = wih;
            this.who = who;
        }
        
        

        
//        console.log("rows:");
//        for(let h=0; h<this.hNodes; h++) {
//            console.log(this.wih[h]);
//        }
//        console.log("rows:");
//        for(let o=0; o<this.oNodes; o++) {
//            console.log(this.who[o]);
//        }
    }
    
    
    // Standard Normal variate using Box-Muller transform.
//    randn_bm() {
//        var u = 0, v = 0;
//        while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
//        while(v === 0) v = Math.random();
//        return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
//    }
    
    
    
    
    
    query(inputList) {
        
        // hidden inputs = wih . I
        // calculate dot product
        let hidden_inputs = [];
        for(let h=0; h<this.hNodes; h++) {
            let rowSum = 0;
            for(let i=0; i<this.iNodes; i++){
                let product = this.wih[h][i] * inputList[i];
                rowSum += product;
            }
            hidden_inputs.push(rowSum);
        }
        
        let hidden_outputs =[];
        for(let hiddenInput of hidden_inputs) {
            hidden_outputs.push(this.sigmoid(hiddenInput));
        }
        
        let final_inputs =[];
        for(let o=0; o<this.oNodes; o++) {
            let rowSum = 0;
            for(let h=0; h<this.hNodes; h++) {
                let product = this.who[o][h] * hidden_outputs[h];
                rowSum += product;
            }
            final_inputs.push(rowSum);
        }
        
        let final_outputs = [];
        for(let finalInput of final_inputs) {
            final_outputs.push(this.sigmoid(finalInput));
        }
        
        
        return final_outputs;
    }
    
    
    
}