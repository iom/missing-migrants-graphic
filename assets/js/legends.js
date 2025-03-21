import * as util from "./util.js";
import { spike } from "./spike.js";

// Colors

const legendColor = d3.select(".legend-color");

for (let i = 1; i <= 5; i++) {

    const item = legendColor.append("div")
        .attr("class", "legend-item");

    item.append("div")
        .attr("class", "legend-key")
        .append("div")
        .attr("class", "legend-key-fill")
        .style("background", util.color(util.causes[i]));

    item.append("div")
        .attr("class", "legend-text")
        .text(util.causes[i]);
};

// Spike height

const legendSpike = d3.select(".legend-spike");

const p = {
    spikewidth: 4, 
    spacing: 15, 
    high: 750, 
    mid: 300, 
    low: 50
};

addSpikeItem(1, p.high);
addSpikeItem(2, p.mid);
addSpikeItem(3, p.low);

function addSpikeItem(i, value) {
    
    legendSpike.append("div")
        .attr("class", "legend-text")
        .style("bottom", -util.spikeheight(value))
        .html("<strong>" + value + "</strong>" + " dead")
    
    const spikeItemContainer = legendSpike.append("div")
        .attr("class", "legend-spike-key")
        .append("svg")
        .attr("width", util.spikeheight(value))
        .attr("height", p.spikewidth)
    
    spikeItemContainer.append("g")
        .attr("transform", `translate(0, ${p.spikewidth / 2})`)
        .append("polyline")
        .attr("fill", util.colors.blue)
        .attr("points", d => {
            return spike()
                .x(0).y(0)
                .angle(0)
                .width(p.spikewidth)
                .height(util.spikeheight(value))
                .closed(true)
                ();
            })
};
