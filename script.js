function toggleUnits() {
    var unitsSelect = document.getElementById("units");
    var selectedUnit = unitsSelect.value;

    var heightInput = document.getElementById("height");
    var widthInput = document.getElementById("width");
    var depthInput = document.getElementById("depth");

    if (selectedUnit === "in") {
        var heightValue = convertInchesToCentimeters(heightInput.value);
        var widthValue  = convertInchesToCentimeters(widthInput.value);
        var depthValue = convertInchesToCentimeters(depthInput.value);
    } else {
        var heightValue  = parseFloat(heightInput.value).toFixed(2);
        var widthValue = parseFloat(widthInput.value).toFixed(2);
        var depthValue = parseFloat(depthInput.value).toFixed(2);
    }

    calculateCompatibleAirlinesFromJSON(heightValue, widthValue, depthValue)
        .then(compatibleAirlines => renderAirlineList(compatibleAirlines, selectedUnit));
}

function convertInchesToCentimeters(inches) {
    return (inches * 2.54).toFixed(1);
}

function convertCentimetersToInches(centimeters) {
    return (centimeters / 2.54).toFixed(1);
}

function calculateCompatibleAirlinesFromJSON(height, width, depth) {
    return fetch('dimensions_lib.json')
        .then(response => response.json())
        .then(data => {
            var airlines = data;
            var compatibleAirlines = [];
            airlines.forEach(function(airline) {
                if (height <= airline.dimensions.height && width <= airline.dimensions.width && depth <= airline.dimensions.depth) {
                    compatibleAirlines.push(airline);
                }
            });
            return compatibleAirlines;
        })
        .catch(error => console.error(error));
}

function renderAirlineList(compatibleAirlines, selectedUnit) {
    var airlinesList = document.getElementById("airlines-list");
    airlinesList.innerHTML = "";
    compatibleAirlines.forEach(function(airline) {
        var airlineItem = document.createElement("li");
        if (selectedUnit === "in") {
            airlineItem.textContent = airline.airline + ": " + convertCentimetersToInches(airline.dimensions.height) + "in x " + convertCentimetersToInches(airline.dimensions.width) + "in x " + convertCentimetersToInches(airline.dimensions.depth) + "in";

        } else {
            airlineItem.textContent = airline.airline + ": " + airline.dimensions.height + "cm x " + airline.dimensions.width + "cm x " + airline.dimensions.depth + "cm";
        }
        airlinesList.appendChild(airlineItem);
    });
}