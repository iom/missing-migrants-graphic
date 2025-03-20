import * as forms from "./forms.js";
import * as util from "./util.js";
import { zoompanel } from "./zoompanel.js";
import { spike } from "./spike.js";

// Forms

forms.addFormYears(2014, 2024);
forms.addFormCause();
forms.addFormRegion();

// Render chart

Promise.all([
    
    d3.json("./assets/data/world_map.json"),
    d3.json("./assets/data/disputed_dotted_black.json"),
    d3.json("./assets/data/disputed_dotted_white.json"),
    d3.csv("./assets/data/mmp-2025-03-10.csv"),

]).then(function([mapRaw, disputedBlackRaw, disputedWhiteRaw, dataRaw]) {

    const map = topojson.feature(mapRaw, mapRaw.objects.countries).features;

    const disputedBlack = topojson.feature(
        disputedBlackRaw, 
        disputedBlackRaw.objects.disputed_dotted_black
    ).features;

    const disputedWhite = topojson.feature(
        disputedWhiteRaw, 
        disputedWhiteRaw.objects.disputed_dotted_white
    ).features;

    const data = dataRaw.map(d => ({ 
        year: d.year,
        cause: d.cause, 
        n: +d.n, 
        coordinates: [d.lon, d.lat] 
    }));

    drawGlobe(map, disputedBlack, disputedWhite, data); 
});

function drawGlobe(map, disputedBlack, disputedWhite, dataAll) {

    const params = {
        width: 900,
        height: 700,
        maxcount: d3.max(dataAll, d => d.n),
        sensitivity: 75
    };

    let rotationOn = false;

    d3.selectAll(".form-year input").on("input", update);
    d3.select(".form-cause select").on("input", update);
    d3.select(".form-region select").on("input", focus);

    const container = d3.select(".panel");

    const svg = container.append("svg")
        .attr("class", "svg-panel")
        .attr("viewBox", [0, 0, params.width, params.height]);

    let projection = d3.geoOrthographic()
        .scale(300)
        .center([0, 0])
        .rotate([0, -10])
        .translate([params.width / 2, params.height / 2]);

    let path = d3.geoPath().projection(projection);

    const graticule = d3.geoGraticule();

    let currentScale = projection.scale();
    let rotate = projection.rotate();

    let globe = svg.append("circle")
        .attr("class", "globe")
        .attr("cx", params.width / 2)
        .attr("cy", params.height / 2)
        .attr("r", projection.scale());

    let graticules = svg.append("path")
        .datum(graticule())
        .attr("class", "graticule")
        .attr("d", path);

    let country = svg.selectAll("country")
        .data(map)
        .enter().append("path")
        .attr("class", "border")
        .attr("d", path);

    // Spikes

    const color = d3.scaleOrdinal()
        .domain(util.causes.slice(1))
        .range([
            util.color.blue, 
            util.color.yellow, 
            util.color.green, 
            util.color.red, 
            util.color.gray
        ]);

    const spikeheight = d3.scaleLinear()
        .domain([1, params.maxcount])
        .range([1, 200]);

    const spikewidth = d => 2 * Math.pow(1.3, Math.log2(d / 300));

    const spikes = svg.append("g");

    // Pan and zoom
  
    const drag = d3.drag().on("drag", dragged);
    const zoom = d3.zoom().scaleExtent([1, 10]).on("zoom", zoomed);

    svg.call(drag);
    svg.call(zoom);

    // Control panel

    const controlPanel = svg.append("g")
        .attr("transform", `translate(${ params.width - 100 }, ${ 10 })`)
        .call(zoompanel, 60, 0);

    controlPanel.select("#buttonplus")
        .on("click", () => {
            rotationOn = false;
            svg.transition().duration(300).call(zoom.scaleBy, 1.5);
            updateSpinButton();
        });
    
    controlPanel.select("#buttonminus")
        .on("click", () => {
            rotationOn = false;
            svg.transition().duration(300).call(zoom.scaleBy, 1 / 1.5);
            updateSpinButton();
        });

    controlPanel.select("#buttonreset")
        .on("click", () => {
            rotationOn = false;
            svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity);
            updateSpinButton();
        });

    const spinButton = controlPanel.append("g")
        .attr("class", "spin-button")
        .attr("transform", "translate(0, 5)");

    spinButton.append("rect")
        .attr("x", 0).attr("y", 0)
        .attr("height", 20)
        .attr("width", 50)
        .attr("ry", 2);
        
    const spinText = spinButton.append("text")
        .attr("x", 50 / 2).attr("y", 14)
        .attr("text-anchor", "middle")
        .text("Spin");
    
    spinButton.append("rect")
        .attr("x", 0).attr("y", 0)
        .attr("height", 20)
        .attr("width", 50)
        .attr("opacity", 0)
        .style("cursor", d => "pointer")
        .on("click", () => {
            rotationOn = !rotationOn;
            updateSpinButton();
        });

    update();

    // Spin
    
    const revolutionDuration = 30000;
    let t1, dt, steps, xPos, yPos, t0, oldPos;
    t0 = 0;
    oldPos = 0;
    
    d3.timer((elapsed) => {
        
        if (rotationOn) {
        
            t1 = elapsed;
            steps = (t0 - elapsed) * 360 / revolutionDuration;
            xPos = rotate[0] - steps
            if (xPos <= -180) {xPos = xPos + 360};

            const scale = projection.scale();
            projection.rotate(rotate);
            
            svg.selectAll("path.border").attr("d", path);    
            svg.selectAll("path.graticule").attr("d", path);

            update();
            
            t0 = t1;
            rotate[0] = xPos;

        } else t0 = elapsed;
    });

    // Functions

    function focus() {        
        region = d3.select(".form-region select")
            .property("value").split(",").map(Number);

        d3.transition()
        .duration(1000)
        .tween("rotate", () => {
            let r = d3.interpolate(projection.rotate(), region.slice(0, 2));
            return t => {
                projection.rotate(r(t));
                
                path.projection(projection);
                globe.attr("r", projection.scale());
                svg.selectAll("path.border").attr("d", path);
                svg.selectAll("path.graticule").attr("d", path);

                update();
            }})
        .on("end", () => rotate = projection.rotate());
    };

    function dragged(event) {

        rotationOn = false;
        updateSpinButton();
        
        rotate = projection.rotate();
        const scale = projection.scale();
        const k = params.sensitivity / projection.scale();
        
        projection.rotate([rotate[0] + event.dx * k, rotate[1] - event.dy * k]);
        path = d3.geoPath().projection(projection);
        
        svg.selectAll("path.border").attr("d", path);
        svg.selectAll("path.graticule").attr("d", path);
        update();
    };
      
    function zoomed(event) {

        rotationOn = false;
        updateSpinButton();
        
        projection.scale(currentScale * event.transform.k);
        const newScale = projection.scale();
        path = d3.geoPath().projection(projection);
        
        svg.selectAll("path.border").attr("d", path);
        svg.selectAll("path.graticule").attr("d", path);
        globe.attr("r", newScale);
        update();
    };

    function updateSpinButton() {
        d3.select(".spin-button text").text(rotationOn ? "Pause" : "Spin");
    };

    function update() {

        let year = d3.select(".form-year input:checked").property("value");
        let cause = d3.select(".form-cause select").property("value");
        
        let data = dataAll.filter(d => d.n > 10);
        if (year != "All years") { data = data.filter(d => d.year == year) };
        if (cause != "All causes") { data = data.filter(d => d.cause == cause) };
        if (year == "All years" && cause == "All causes") { 
            data = data.filter(d => d.n > 10) 
        };
        
        spikes.selectAll(".spike").remove();
        spikes.selectAll(".spike")
            .data(data)
            .join("polyline")
            .attr("class", "spike")
            .attr("fill", d => color(d.cause))
            .classed("hide", d => !path({ type: "Point", coordinates: d.coordinates }))
            .attr("points", d => {
                const p = projection(d.coordinates);
                const a = geometric.lineAngle([[params.width / 2, params.height / 2], p]);
                return spike()
                    .x(p[0]).y(p[1])
                    .angle(a)
                    .width(spikewidth(projection.scale()))
                    .height(spikeheight(d.n))();
            });
    };
    





};