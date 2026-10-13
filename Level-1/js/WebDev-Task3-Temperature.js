const temperatureInput = document.getElementById("temperatureValue");
const unitSelect = document.getElementById("selectUnit");
const convertButton = document.getElementById("convertButton");
const errorMessage = document.getElementById("errorMessage");

const celsiusValue = document.getElementById("celsiusValue");
const fahrenheitValue = document.getElementById("fahrenheitValue");
const kelvinValue = document.getElementById("kelvinValue");

function convertTemperature() {
    const rawValue = temperatureInput.value.trim();
    const unit = unitSelect.value;

    // Clear previous error and results
    errorMessage.textContent = "";
    celsiusValue.textContent = "";
    fahrenheitValue.textContent = "";
    kelvinValue.textContent = "";

    // Validate input
    if (rawValue === "" || isNaN(rawValue)) {
        errorMessage.textContent = "Please enter a valid number.";
        return;
    }

    const value = parseFloat(rawValue);
    let celsius, fahrenheit, kelvin;

    // Convert everything via Celsius
    switch (unit) {
        case "celsius":
            celsius = value;
            break;
        case "fahrenheit":
            celsius = (value - 32) * 5 / 9;
            break;
        case "kelvin":
            celsius = value - 273.15;
            break;
    }

    // Absolute zero check (-273.15°C)
    if (celsius < -273.15) {
        errorMessage.textContent = "Temperature cannot be below absolute zero.";
        return;
    }

    fahrenheit = celsius * 9 / 5 + 32;
    kelvin = celsius + 273.15;

    // Display results (rounded to 2 decimal places)
    celsiusValue.textContent = celsius.toFixed(2) + " °C";
    fahrenheitValue.textContent = fahrenheit.toFixed(2) + " °F";
    kelvinValue.textContent = kelvin.toFixed(2) + " K";
}

convertButton.addEventListener("click", convertTemperature);

// Allow pressing Enter to convert
temperatureInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        convertTemperature();
    }
});