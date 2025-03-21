export const causes = [
    "All causes",
    "Drowning",
    "Sickness, accidents and harsh conditions",
    "Transport hazards",
    "Violence",
    "Mixed or unknown",
];

export const regions = new Map([
    ["Select...", [0, -10, 300]],
    ["Africa", [-15, -10, 600]],
    ["Americas", [90, -20, 600]], 
    ["Asia", [-100, -20, 600]], 
    ["Mediterranean", [-21, -36, 600]],
    ["Middle East", [-45, -25, 600]], 
  ]);

export const colors = {
    blue: "#003399",
    yellow: "#ebb447",
    green: "#00998c",
    red: "#d65c5c",
    gray: "#666666"
}

export const color = d3.scaleOrdinal()
    .domain(causes.slice(1))
    .range([
        colors.blue, 
        colors.yellow, 
        colors.green, 
        colors.red, 
        colors.gray
    ]);


export const spikeheight = d3.scaleLinear()
    .domain([1, 1022])
    .range([1, 200]);

export const spikewidth = d => 2 * Math.pow(1.3, Math.log2(d / 300));
