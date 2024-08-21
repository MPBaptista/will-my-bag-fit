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
    // Check if all input values are 0.0
    if (heightValue === "0.0" || widthValue === "0.0" || depthValue === "0.0") {
        return; // Exit the function if all input values are 0.0
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

    if (compatibleAirlines.length > 0) {
        var searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.id = "search";
        searchInput.placeholder = "Search airlines...";
        searchInput.className = "custom-input";
        searchInput.onkeyup = filterAirlines;
        
        var searchContainer = document.createElement("div");
        searchContainer.appendChild(searchInput);
        
        airlinesList.insertBefore(searchContainer, airlinesList.firstChild);
    }
}

function filterAirlines() {
    var searchInput = document.getElementById("search");
    var airlinesList = document.getElementById("airlines-list");
    var airlines = airlinesList.getElementsByTagName("li");

    for (var i = 0; i < airlines.length; i++) {
        var airlineName = airlines[i].textContent.toUpperCase();
        var searchTerm = searchInput.value.toUpperCase();

        if (airlineName.indexOf(searchTerm) > -1) {
            airlines[i].style.display = "";
        } else {
            airlines[i].style.display = "none";
        }
    }
}