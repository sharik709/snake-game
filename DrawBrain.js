class DrawBrain {
    /**
     * 
     * @param Sequential model 
     * @param {*} config  = {
     *      startingX   : 30,
     *      startingY   : 50,
     *      layerGap    : 120,
     *      nodeGap     : 60
     * }
     */
    constructor(model, config = {}) {
        this.model = model;
        config = this.setMissingToDefaults(config);

        this.x              = config.startingX;
        this.y              = config.startingY;
        this.hGap           = config.layerGap
        this.vGap           = config.nodeGap
        this.inputLabels    = config.inputLabels;
        this.outputLabels   = config.outputLabels;
        this.nodeRenderer   = config.nodeRenderer;
    }

    setMissingToDefaults(config) {
        if(!config.startingX) {
            config.startingX = 30;
        }
        if(!config.startingY) {
            config.startingY = 50
        }
        if(!config.layerGap) {
            config.layerGap = 120;
        }
        if(!config.nodeGap) {
            config.nodeGap = 60;
        }
        return config;
    }

    render(state, predict) {
        this.renderInputLayer(state)
        this.renderLayers(state, predict)
    }

    renderInputLayer(state) {
        let inputs = this.model.layers[0].input.shape[1];

        for (let i = 0; i < inputs; i++) {
            let x = this.x;
            let y = this.y + (this.vGap * (i + 1));
            if (state[i] > 0) {
                fill(0, 255, 0)
            } else {
                fill(0);
            }
            let text = this.inputLabels[i]
            this.renderNode(x, y, text);
        }
    }

    renderLayers(state, predict) {
        for (let i = 0; i < this.model.layers.length; i++) {
            this.renderLayer(this.model.layers[i], i, state, predict)
        }
    }

    async renderLayer(layer, layerIndex, state, predict) {
        this.renderNodes(layer.units, layerIndex, predict)
        this.renderNodesWeightLines(layer, layerIndex, predict)
        this.renderLayerBiasText(layer, layerIndex)
    }

    async renderLayerBiasText(layer, layerIndex) {
        let x = this.x + (this.hGap * (layerIndex + 1));
        let y = this.y;
        let biases = await layer.bias.val.array();
        for (let i = 0; i < biases.length; i++) {
            y = this.y + (this.vGap * (i + 1))
            this.renderNodesBiasText(biases[i], x, y, i)
        }
        this.reset()
    }

    renderNodesBiasText(bias, x, y, i) {
        fill(255)
        x = x - 10
        y = this.y + (this.vGap * (i + 1)) - 12
        text(bias.toFixed(2), x, y)
        this.reset();
    }

    renderNodes(units, layerIndex, predict) {
        let x = this.x + (this.hGap * (layerIndex + 1));
        let y = this.y;
        for (let i = 0; i < units; i++) {
            y = this.y + (this.vGap * (i + 1))
            if (layerIndex + 1 == this.model.layers.length) {
                fill(255)
                text(predict[i].toFixed(2) + ' (' + this.outputLabels[i] + ')', x+14, y+2)
                this.reset();
                if (predict[i] > 0) {
                    fill(0, predict[i] * 255, 0)
                } else {
                    fill(-predict[i] * 255, 0, 0);
                }
            }
            this.renderNode(x, y)
        }
        this.reset()
    }

    async renderNodesWeightLines(layer, layerIndex, predict) {
        let weights = await layer.kernel.val.array();
        for (let i = 0; i < weights.length; i++) {
            this.renderNodeWeightLines(weights[i], i, layer, layerIndex, predict)
        }
    }

    renderNodeWeightLines(weights, i, layer, layerIndex, predict) {
        let nodeX = this.x + (this.hGap * (layerIndex)) + 13;
        let nodeY = this.y + (this.vGap * (i + 1)) + 2

        for (let i = 0; i < weights.length; i++) {
            this.renderWeightLine(weights[i], nodeX, nodeY, i, layer, layerIndex, predict)
        }
    }

    renderNode(x, y, txt = null, direction = 'left') {
        noStroke();
        ellipse(x, y, 20, 20);
        if (txt) {
            fill(255)
            if(direction == 'left') {
                text(txt, x - 60, y-10)
            }
        }
        this.reset();
    }

    renderWeightLine(w, nodeX, nodeY, i, layer, layerIndex, predict) {

        let endLinex = this.x + (this.hGap * (layerIndex + 1)) - 14;
        let endLiney = this.y + (this.vGap * (i + 1));

        if (w > 0) {
            strokeWeight(w * 10)
            stroke(0, 255, 0)
        } else {
            strokeWeight(-w * 10)
            stroke(255, 0, 0)
        }
        line(nodeX, nodeY, endLinex, endLiney)
        this.reset()
    }

    reset() {
        stroke(1);
        strokeWeight(1)
        fill(0);
    }
}