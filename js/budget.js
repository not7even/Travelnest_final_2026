
function getBudgetStatus(dailyBudget) {
  if (dailyBudget < 5000) {
    return { label: " Low Budget", color: "#27ae60", level: "low" };
  } else if (dailyBudget < 15000) {
    return { label: " Moderate", color: "#f39c12", level: "moderate" };
  } else {
    return { label: " Luxury", color: "#e74c3c", level: "luxury" };
  }
}


function calculateBudget() {
  const dest = document.getElementById('destination').value.trim();
  const days = parseInt(document.getElementById('days').value);
  const daily = parseInt(document.getElementById('daily-budget').value);

  document.getElementById('dest-error').textContent = '';
  document.getElementById('days-error').textContent = '';
  document.getElementById('budget-error').textContent = '';

 
  let valid = true;

  if (!dest) {
    document.getElementById('dest-error').textContent = 'Please enter a destination.';
    valid = false;
  }

  if (!days || days < 1) {
    document.getElementById('days-error').textContent = 'Please enter a valid number of days.';
    valid = false;
  }

  if (!daily || daily < 1) {
    document.getElementById('budget-error').textContent = 'Please enter a valid daily budget.';
    valid = false;
  }

  if (!valid) return;


  const total = days * daily;
  const status = getBudgetStatus(daily);


  document.getElementById('result-dest').textContent = dest;
  document.getElementById('result-days').textContent = days + ' days';
  document.getElementById('result-daily').textContent = 'LKR ' + daily + '/day';
  document.getElementById('result-total').textContent = 'LKR ' + total;
  document.getElementById('result-status').textContent = status.label;
  document.getElementById('result-status').style.color = status.color;
  document.getElementById('progress-label').textContent = status.label;

  document.getElementById('budget-low').classList.remove('active');
  document.getElementById('budget-moderate').classList.remove('active');
  document.getElementById('budget-luxury').classList.remove('active');
  document.getElementById('budget-' + status.level).classList.add('active');

  const resultsSection = document.getElementById('results-section');
  resultsSection.style.display = 'block';
  resultsSection.classList.add('fade-in');

  window.currentBudget = { dest, days, daily, total, status: status.label };
}

function saveBudget() {
  if (!window.currentBudget) return;

  const budgets = JSON.parse(localStorage.getItem('saved_budgets') || '[]');
  budgets.push(window.currentBudget);
  localStorage.setItem('saved_budgets', JSON.stringify(budgets));

  alert('Budget saved!');
  renderSavedBudgets();
}

function renderSavedBudgets() {
  const budgets = JSON.parse(localStorage.getItem('saved_budgets') || '[]');
  const list = document.getElementById('saved-list');

  if (budgets.length === 0) {
    list.innerHTML = '<p style="color:var(--grey);">No saved budgets yet.</p>';
    return;
  }

  list.innerHTML = '';
  budgets.forEach(function (b) {
    const div = document.createElement('div');
    div.className = 'saved-item';
    div.innerHTML = `
      <span>${b.dest} - ${b.days} days @ LKR ${b.daily}/day</span>
      <span class="saved-total">LKR ${b.total} (${b.status})</span>
    `;
    list.appendChild(div);
  });
}


function clearBudgets() {
  if (confirm('Are you sure you want to clear all saved budgets?')) {
    localStorage.removeItem('saved_budgets');
    renderSavedBudgets();
  }
}


document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('calculate-btn').addEventListener('click', calculateBudget);
  document.getElementById('save-budget-btn').addEventListener('click', saveBudget);
  document.getElementById('clear-budgets-btn').addEventListener('click', clearBudgets);

  renderSavedBudgets();
});
