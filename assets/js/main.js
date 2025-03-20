import * as forms from "./forms.js";

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

function drawGlobe(map, disputedBlack, disputedWhite, data) {

    const params = {
        width: 900,
        height: 700
    };

    const container = d3.select(".panel")

    const svg = container.append("svg")
        .attr("class", "svg-panel")
        .attr("viewBox", [0, 0, params.width, params.height]);

    let projection = d3.geoOrthographic()
        .scale(300)
        .center([0, 0])
        .rotate(0, -10)
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
        .attr("d", path)

    let country = svg.selectAll("country")
        .data(map)
        .enter().append("path")
        .attr("class", "border")
        .attr("d", path)


};