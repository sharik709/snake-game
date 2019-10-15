class NeuralNet {
   constructor(inputs, hidden, outputs) {
      this.inputs = inputs;
      this.outputs = outputs;
      this.hidden = hidden;

      this.model = tf.sequential();
      this.model.add(tf.layers.dense({
         units: hidden,
         inputShape: inputs,
         activation: 'relu',
      }))
      this.model.add(tf.layers.dense({
         units: this.outputs,
         activation: 'softmax',
      }))
      tf.setBackend('cpu')
      this.model.compile({
         loss: 'meanSquaredError',
         optimizer: tf.train.adam(LEARNING_RATE)
      })

      this.drawBrain = new DrawBrain(this.model, {
         startingX: 100,
         startingY: 100,
         layerGap: 120,
         nodeGap: 70,
         inputLabels: [
            'Wall Up', 'Wall Down', 'Wall On Right', 'Wall On left'
         ],
         outputLabels: [
            'Up', 'Down', 'Right', 'Left'
         ]
      })
   }

   predict(s) {
      return this.model.predict(tf.tensor([s])).dataSync();
   }

   render(state, predict, config = {}) {
      return this.drawBrain.render(state, predict, config);
   }

   async renderBrain(s, predict) {
      let weights = this.model.getWeights();
      let promises = [];
      for (let i = 0; i < weights.length; i++) {
         promises[i] = await weights[i].array()
      }


      for (let i = 0; i < this.inputs; i++) {
         let w = promises[0][0]
         noStroke()
         if (s[0] == 1) {
            fill(0, 255, 0)
         } else {
            fill(0);
         }
         stroke(2)
         ellipse(240, 100, 20, 20);
         for (let u = 0; u < w.length; u++) {
            if (w[u] > 0) {
               strokeWeight(w[u] * 10)
               stroke(0, 255, 0)
            } else {
               strokeWeight(-w[u] * 10)
               stroke(255, 0, 0)
            }
            line(255, 100, 350, 70 * (u + 1))
         }
         strokeWeight(1)
      }
      // for (let i = 0; i < 2;i++) {
      //    let w = promises[2][0]

      //    for(let k =0; k)
      //    fill(0)
      //    stroke(0)
      //    ellipse(352, 70*(i+1), 20, 20)

      // }

      for (let i = 0; i < this.outputs; i++) {
         noStroke()
         if (predict[i] > 0) {
            fill(0, predict[i] * 255, 0)
         } else {
            fill(-predict[i] * 255, 0, 0);
         }
         ellipse(352, 70 * (i + 1), 20, 20)
         fill(255)
         text(predict[i].toFixed(2), 365, 60 * (i + 1))
      }

      stroke(0);
   }

   async train(inputs, targets) {
      await this.model.fit(tf.tensor([inputs]), tf.tensor([targets]), {
         epochs: 10,
         callBacks: {
            onEpochEnd: async (epoch, log) => {
               console.log(`Epoch ${epoch}: loss = ${log.loss}`);
            }
         }
      })
   }
}