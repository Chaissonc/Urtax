var categories = [
    { name: 'Brokerage 1', percentage: 36 },
    { name: 'RothIRA', percentage: 24 },
    { name: 'Savings', percentage: 17 },
    { name: 'Brokerage 2', percentage: 11 },
    { name: 'Crypto', percentage: 4 },
    { name: 'Other', percentage: 8 }
];

function renderCategories() {
    var container = document.getElementById('categories');
    container.innerHTML = '';

    categories.forEach((cat, i) => {
        var div = document.createElement('div');
        div.className = 'category';
        div.innerHTML = `
            ${categories.length > 2 ? `<button class="remove-btn" onclick="removeCategory(${i})">−</button>` : ''}
            <input type="text" id="category${i+1}-name" class="name" oninput="saveToStorage()" value="${cat.name}" onclick="selectText(this)">
            <div class="pct-row">
                <input type="number" inputmode="decimal" id="category${i+1}-percentage" value="${cat.percentage}" class="percentage" onclick="selectText(this)" oninput="updateTotalPercentage(); saveToStorage()">
                <span class="pct-sign">%</span>
            </div>
            <span id="category${i+1}-amount" class="money">$0.00</span>
        `;
        container.appendChild(div);
    });

    if (categories.length < 6) {
        var addDiv = document.createElement('div');
        addDiv.className = 'category add-category';
        addDiv.onclick = addCategory;
        addDiv.innerHTML = '<span class="add-icon">+</span>';
        container.appendChild(addDiv);
    }

    updateTotalPercentage();
}

function addCategory() {
    if (categories.length >= 6) return;
    categories.push({ name: `Category ${categories.length + 1}`, percentage: 0 });
    renderCategories();
    saveToStorage();
}

function removeCategory(index) {
    if (categories.length <= 2) return;
    categories.splice(index, 1);
    renderCategories();
    saveToStorage();
}

function selectText(element) {
    element.select();
}

function updateTotalPercentage() {
    var percentages = document.querySelectorAll('.percentage');
    var total = Array.from(percentages).reduce((sum, input) => sum + parseFloat(input.value || 0), 0);
    var remainingPercentageElement = document.getElementById('remaining-percentage');

    if (total < 100) {
        remainingPercentageElement.textContent = "Percentage Remaining: " + (100 - total).toFixed(2) + "%";
        remainingPercentageElement.style.color = 'orange';
    } else if (total === 100) {
        remainingPercentageElement.textContent = "Perfect! No Percentage Remaining.";
        remainingPercentageElement.style.color = '#7fff7f';
    } else {
        remainingPercentageElement.textContent = "Exceeded by: " + (total - 100).toFixed(2) + "%";
        remainingPercentageElement.style.color = 'red';
    }
}

function saveToStorage() {
    var data = [];
    for (var i = 1; i <= categories.length; i++) {
        var nameEl = document.getElementById(`category${i}-name`);
        var pctEl = document.getElementById(`category${i}-percentage`);
        if (nameEl && pctEl) {
            data.push({ name: nameEl.value, percentage: parseFloat(pctEl.value) || 0 });
        }
    }
    categories = data;
    localStorage.setItem('categories', JSON.stringify(data));
}

function loadFromStorage() {
    var saved = localStorage.getItem('categories');
    if (saved) {
        categories = JSON.parse(saved);
    }
    renderCategories();
}

function resetToBlank() {
    categories = [
        { name: 'Category 1', percentage: 0 },
        { name: 'Category 2', percentage: 0 }
    ];
    document.getElementById("money-input").value = "";
    localStorage.clear();
    renderCategories();
}

function resetToExample() {
    categories = [
        { name: 'Brokerage 1', percentage: 36 },
        { name: 'RothIRA', percentage: 24 },
        { name: 'Savings', percentage: 17 },
        { name: 'Brokerage 2', percentage: 11 },
        { name: 'Crypto', percentage: 4 },
        { name: 'Other', percentage: 8 }
    ];
    document.getElementById("money-input").value = "";
    localStorage.clear();
    renderCategories();
}

function calculate() {
    var moneyInput = parseFloat(document.getElementById("money-input").value);
    if (isNaN(moneyInput) || moneyInput <= 0) {
        alert("Please enter a valid number greater than 0");
        return;
    }

    var percentageInputs = document.querySelectorAll('.percentage');
    var percentages = Array.from(percentageInputs).map(el => parseFloat(el.value) || 0);
    var totalPercentage = percentages.reduce((sum, current) => sum + current, 0);

    if (totalPercentage !== 100) {
        alert("The total percentage must add up to 100%. Your total is currently " + totalPercentage + "%.");
        return;
    }

    percentages.forEach((pct, i) => {
        var amount = moneyInput * (pct / 100);
        document.getElementById(`category${i + 1}-amount`).textContent = "$" + amount.toFixed(2);
    });
}

window.addEventListener('load', loadFromStorage);
