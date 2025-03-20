
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
        .attr("width", params.width)
        .attr("height", params.height)
        .attr("viewBox", [0, 0, params.width, params.height])

};