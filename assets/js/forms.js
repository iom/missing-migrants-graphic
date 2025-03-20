export function addFormYears(start, end) {

    const form = d3.select(".form-year");

    form.append("label")
        .attr("class", "form-label")
        .text("Year");

    const options = form.append("div")
        .attr("class", "options");
      
    for (let t = +start; t <= +end; t++) {
        options.call(addOption, t);
    };
        
    options.call(addOption, "All years");
        
    function addOption(form, value) {
        
        const options = form.append("div")
            .attr("class", "option");
        
        options.append("input")
            .attr("type", "radio")
            .attr("name", "radio-year")
            .attr("value", value);
        
        options.append("label")
            .text(value);
    };
};

export function addFormCause() {

    const causes = [
        "All causes",
        "Drowning",
        "Sickness, accidents and harsh conditions",
        "Transport hazards",
        "Violence",
        "Mixed or unknown",
    ];

    const form = d3.select(".form-cause");

    form.append("label")
        .attr("class", "form-label")
        .text("Cause of death");

    form.append("select")
        .selectAll("option")
        .data(causes)
        .join("option")
        .attr("value", d => d)
        .text(d => d);
};

export function addFormRegion() {

    const regions = new Map([
        ["Select...", [0, -10, 300]],
        ["Africa", [-15, -10, 600]],
        ["Americas", [90, -20, 600]], 
        ["Asia", [-100, -20, 600]], 
        ["Mediterranean", [-21, -36, 600]],
        ["Middle East", [-45, -25, 600]], 
      ]);

    const form = d3.select(".form-region");

    form.append("label")
        .attr("class", "form-label")
        .text("Fly to region");

    form.append("select")
        .selectAll("option")
        .data(regions)
        .join("option")
        .attr("value", d => d[1])
        .text(d => d[0]);    
}