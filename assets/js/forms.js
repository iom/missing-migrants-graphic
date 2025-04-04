import * as util from "./util.js";

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
        
    options.call(addOption, "All years")
    d3.select(".form-year input[value='All years']").attr("checked", true)
        
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

    const form = d3.select(".form-cause");

    form.append("label")
        .attr("class", "form-label")
        .text("Cause of death");

    form.append("select")
        .selectAll("option")
        .data(util.causes)
        .join("option")
        .attr("value", d => d)
        .text(d => d);
};

export function addFormRegion() {

    const form = d3.select(".form-region");

    form.append("label")
        .attr("class", "form-label")
        .text("Fly to region");

    form.append("select")
        .selectAll("option")
        .data(util.regions)
        .join("option")
        .attr("value", d => d[1])
        .text(d => d[0]);    
};