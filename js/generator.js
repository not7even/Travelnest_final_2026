
const tripData = [
  { name: "Bali", emoji: "Bali", type: "relaxation", budget: "low",
    desc: "Tropical paradise with rice terraces, temples, and stunning beaches." },
  { name: "Tokyo", emoji: "Tokyo", type: "cultural", budget: "medium",
    desc: "A fascinating blend of ancient traditions and ultra-modern city life." },
  { name: "Paris", emoji: "Paris", type: "cultural", budget: "high",
    desc: "The city of love, art, world-class cuisine, and iconic landmarks." },
  { name: "New York", emoji: "New York", type: "adventure", budget: "high",
    desc: "The most populous city in the US. Famous for its iconic skyline, Broadway shows, and diverse culture." },
  { name: "Sydney", emoji: "Sydney", type: "adventure", budget: "high",
    desc: "Australia's largest city, famous for its harbour, beaches, and the iconic Opera House." },
  { name: "Rome", emoji: "Rome", type: "cultural", budget: "high",
    desc: "Italy's capital with nearly 3,000 years of globally influential art, architecture and culture." },
  { name: "Bangkok", emoji: "Bangkok", type: "relaxation", budget: "low",
    desc: "Thailand's vibrant capital, famous for ornate temples, street markets, and flavorful cuisine." },
  { name: "Rio de Janeiro", emoji: "Rio", type: "relaxation", budget: "medium",
    desc: "A vibrant city on Brazil's Atlantic coast known for its Carnival festival, samba and stunning beaches." },
  { name: "Cape Town", emoji: "Cape Town", type: "nature", budget: "medium",
    desc: "A port city on South Africa's southwest coast dominated by Table Mountain and incredible wildlife nearby." }
];

let lastResult = null;

function generateTrip() {
  const travelType = document.getElementById('travel-type').value;
  const budgetRange = document.getElementById('budget-range').value;

  let filtered = tripData.filter(function (t) {
    const typeMatch = travelType === 'all' || t.type === travelType;
    const budgetMatch = budgetRange === 'all' || t.budget === budgetRange;
    return typeMatch && budgetMatch;
  });

  if (filtered.length === 0) {
    alert('No destinations match your filters. Showing a random pick instead!');
    filtered = tripData;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const result = filtered[randomIndex];
  lastResult = result;

  showResult(result);
}

function showResult(dest) {
  document.getElementById('result-emoji').textContent = dest.emoji;
  document.getElementById('result-name').textContent = dest.name;
  document.getElementById('result-desc').textContent = dest.desc;
  document.getElementById('result-type-tag').textContent = capitalise(dest.type);
  document.getElementById('result-budget-tag').textContent = capitalise(dest.budget) + ' budget';

  const matchedDest = destinationData.find(function (d) {
    return d.name === dest.name;
  });

  if (matchedDest) {
    const resultImage = document.getElementById('result-image');
    resultImage.src = matchedDest.image;
    resultImage.alt = dest.name;
    resultImage.style.display = 'block';
  }

  const section = document.getElementById('result-section');
  section.style.display = 'block';

  section.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderWishlist() {
  const list = getWishlist();
  const container = document.getElementById('wishlist-list');

  if (list.length === 0) {
    container.innerHTML = '<p style="color:var(--grey);">Your wishlist is empty. Save some destinations!</p>';
    return;
  }

  container.innerHTML = '';
  list.forEach(function (item, index) {
    const div = document.createElement('div');
    div.className = 'wishlist-item';
    div.innerHTML = `
      <span>${item}</span>
      <button onclick="removeFromWishlist(${index})" aria-label="Remove ${item}">Remove</button>
    `;
    container.appendChild(div);
  });
}

function removeFromWishlist(index) {
  const list = getWishlist();
  list.splice(index, 1);
  saveWishlist(list);
  renderWishlist();
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('generate-btn').addEventListener('click', generateTrip);

  document.getElementById('surprise-btn').addEventListener('click', generateTrip);

  document.getElementById('wishlist-btn').addEventListener('click', function () {
    if (lastResult) {
      addToWishlist(lastResult.name);
      renderWishlist();
    }
  });

  document.getElementById('clear-wishlist-btn').addEventListener('click', function () {
    if (confirm('Clear your entire wishlist?')) {
      saveWishlist([]);
      renderWishlist();
    }
  });

  renderWishlist();
});
