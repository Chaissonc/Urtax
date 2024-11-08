// Function to select all text when input is clicked
function selectText(element) {
    element.select();
}

// Function to update and display the total and remaining percentages in real-time
function updateTotalPercentage() {
    var percentages = document.querySelectorAll('.percentage');
    var total = Array.from(percentages).reduce((sum, input) => sum + parseFloat(input.value || 0), 0);
    var totalPercentageElement = document.getElementById('total-percentage');
    var remainingPercentageElement = document.getElementById('remaining-percentage');

    totalPercentageElement.textContent = "Current Total: " + total.toFixed(2) + "%";
    if (total < 100) {
        totalPercentageElement.style.color = 'orange';
        remainingPercentageElement.textContent = "Percentage Left: " + (100 - total).toFixed(2) + "%";
        remainingPercentageElement.style.color = 'orange';
    } else if (total === 100) {
        totalPercentageElement.style.color = 'green';
        remainingPercentageElement.textContent = "Perfect! No Percentage Left.";
        remainingPercentageElement.style.color = 'green';
    } else {
        totalPercentageElement.style.color = 'red';
        remainingPercentageElement.textContent = "Exceeded by: " + (total - 100).toFixed(2) + "%";
        remainingPercentageElement.style.color = 'red';
    }
}

function calculate() {
    var moneyInput = parseFloat(document.getElementById("money-input").value);
    if (isNaN(moneyInput) || moneyInput <= 0) {
        alert("Please enter a valid number greater than 0");
        return;
    }

    // Get percentages and validate if they add up to 100
    var percentages = [
        parseFloat(document.getElementById("category1-percentage").value),
        parseFloat(document.getElementById("category2-percentage").value),
        parseFloat(document.getElementById("category3-percentage").value),
        parseFloat(document.getElementById("category4-percentage").value),
        parseFloat(document.getElementById("category5-percentage").value),
        parseFloat(document.getElementById("category6-percentage").value)
    ];

    var totalPercentage = percentages.reduce((sum, current) => sum + current, 0);

    if (totalPercentage !== 100) {
        alert("The total percentage must add up to 100%. Your total is currently " + totalPercentage + "%.");
        return;
    }

    // Calculate the amounts for each category and display them
    for (var i = 0; i < percentages.length; i++) {
        var amount = moneyInput * (percentages[i] / 100);
        document.getElementById(`category${i + 1}-amount`).textContent = "$" + amount.toFixed(2);
    }
}
