class Matrix {

     constructor( r,  c) {
        if (r instanceof Matrix) {
            this.matrix = r
            this.rows = r.length;
            this.cols = r[0].length
        } else {
            this.rows = r;
            this.cols = c;
            this.matrix = this.zeros([r,c])
        }
     }

     zeros(dimensions) {
        var array = [];
    
        for (var i = 0; i < dimensions[0]; ++i) {
            array.push(dimensions.length == 1 ? random(-1, 1) : this.zeros(dimensions.slice(1)));
        }
    
        return array;
    }

     output() {
        for(let i = 0; i < this.rows; i++) {
           for(let j = 0; j < this.cols; j++) {
              console.log(matrix[i][j] + " "); 
           }
        }
     }
     
     dot(n) {
       let result = new Matrix(this.rows, n.cols);
       
       if(this.cols == n.rows) {
          for(let i = 0; i < this.rows; i++) {
             for(let j = 0; j < n.cols; j++) {
                let sum = 0;
                for(let k = 0; k < this.cols; k++) {
                   sum += this.matrix[i][k]*n.matrix[k][j];
                }  
                if (!result.matrix[i]) result.matrix[i] = []
                result.matrix[i][j] = sum;
             }
          }
       }
       return result;
     }
     
     randomize() {
        for(let i = 0; i < this.rows; i++) {
           for(let j = 0; j < this.cols; j++) {
                this.matrix[i][j] = random(-1,1); 
           }
        }
     }
     
     singleColumnMatrixFromArray(arr) {
        let n = new Matrix(arr.length, 1);
        for(let i = 0; i < arr.length; i++) {
           n.matrix[i][0] = arr[i]; 
        }
        return n;
     }
     
     toArray() {
        let arr = []
        for(let i = 0; i < this.rows; i++) {
           for(let j = 0; j < this.cols; j++) {
              arr[j+i*this.cols] = this.matrix[i][j]; 
           }
        }
        return arr;
     }
     
     addBias() {
        let n = new Matrix(this.rows+1, 1);
        for(let i = 0; i < this.rows; i++) {
           n.matrix[i][0] = this.matrix[i][0]; 
        }
        n.matrix[this.rows][0] = 1;
        return n;
     }
     
     activate() {
        let n = new Matrix(this.rows, this.cols);
        for(let i = 0; i < this.rows; i++) {
           for(let j = 0; j < this.cols; j++) {
              n.matrix[i][j] = this.relu(this.matrix[i][j]); 
           }
        }
        return n;
     }
     
     relu(x) {
         return max(0,x);
     }
     
     mutate(mutationRate) {
        for(let i = 0; i < this.rows; i++) {
           for(let j = 0; j < this.cols; j++) {
              let rand = random(1);
              if(rand<mutationRate) {
                 this.matrix[i][j] += randomGaussian()/5;
                 
                 if(this.matrix[i][j] > 1) {
                    this.matrix[i][j] = 1;
                 }
                 if(this.matrix[i][j] <-1) {
                   this.matrix[i][j] = -1;
                 }
              }
           }
        }
     }
     
     crossover(partner) {
        let child = new Matrix(this.rows, this.cols);
        
        let randC = floor(random(this.cols));
        let randR = floor(random(this.rows));
        
        for(let i = 0; i < this.rows; i++) {
           for(let j = 0;  j < this.cols; j++) {
              if((i  < randR) || (i == randR && j <= randC)) {
                 child.matrix[i][j] = this.matrix[i][j]; 
              } else {
                child.matrix[i][j] = partner.matrix[i][j];
              }
           }
        }
        return child;
     }
     
     clone() {
        let clone = new Matrix(this.rows, this.cols);
        for(let i = 0; i < this.rows; i++) {
           for(let j = 0; j < this.cols; j++) {
              clone.matrix[i][j] = this.matrix[i][j]; 
           }
        }
        return clone;
     }
  }