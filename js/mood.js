// ===== TRAVEL MOOD JS =====

// Destinations for the tracker
const trackerDestinations = [
  { displayName: "Paris, France", searchName: "Paris" },
  { displayName: "Tokyo, Japan", searchName: "Tokyo" },
  { displayName: "Bali, Indonesia", searchName: "Bali" },
  { displayName: "New York, USA", searchName: "New York" },
  { displayName: "Cape Town", searchName: "Cape Town" },
  { displayName: "Sydney, Australia", searchName: "Sydney" },
  { displayName: "Rome, Italy", searchName: "Rome" },
  { displayName: "Bangkok, Thailand", searchName: "Bangkok" }
];

const sounds = {
  beach: new Audio("./audio/beach.mp3"),
  forest: new Audio("./audio/forest.mp3"),
  city: new Audio("./audio/city.mp3"),
  rain: new Audio("./audio/rain.mp3")
};

let activeSound = null;

// --- Handle sound toggle ---
function initSounds() {
  const buttons = document.querySelectorAll('.sound-btn');
  const status = document.getElementById('sound-status');

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const soundName = btn.dataset.sound;

      // Turn off if already active
      if (btn.classList.contains('active')) {
        btn.classList.remove('active');
        status.textContent = 'No sound playing';
        activeSound = null;
        sounds[soundName].pause();
        sounds[soundName].currentTime = 0;
        return;
      }

      if (activeSound && sounds[activeSound]) {
        sounds[activeSound].pause();
        sounds[activeSound].currentTime = 0;
      }

      // Remove active from all other buttons
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      status.textContent = `Now playing: ${btn.querySelector('span:last-child').textContent}`;
      sounds[soundName].loop = true;
      sounds[soundName].play();
      activeSound = soundName;
    });
  });
}

// --- Load tracker state from localStorage ---
function getTrackerState() {
  return JSON.parse(localStorage.getItem('tracker_state') || '{}');
}

function saveTrackerState(state) {
  localStorage.setItem('tracker_state', JSON.stringify(state));
}

function getDestinationData(dest) {
  if (typeof destinationData === 'undefined') return null;
  const searchName = (dest.searchName || dest.displayName.split(',')[0]).trim().toLowerCase();
  return destinationData.find(function (item) {
    return item.name.toLowerCase() === searchName;
  });
}

// --- Render the destination tracker ---
function renderTracker() {
  const container = document.getElementById('tracker-grid');
  const state = getTrackerState();
  container.innerHTML = '';

  trackerDestinations.forEach(function (dest) {
    const currentStatus = state[dest.displayName] || 'none';
    const matchedDest = getDestinationData(dest);
    const imageUrl = matchedDest ? matchedDest.image : '';

    const card = document.createElement('div');
    card.className = 'tracker-card';
    card.innerHTML = `
      ${imageUrl ? `<img class="dest-image" src="${imageUrl}" alt="${dest.displayName} photo" />` : `<div class="dest-placeholder">${dest.displayName}</div>`}
      <h4>${dest.displayName}</h4>
      <div class="tracker-buttons">
        <button class="tracker-btn ${currentStatus === 'visited' ? 'visited' : ''}"
          onclick="setTrackerStatus('${dest.displayName}', 'visited')" aria-label="Mark as visited">Visited</button>
        <button class="tracker-btn ${currentStatus === 'planned' ? 'planned' : ''}"
          onclick="setTrackerStatus('${dest.displayName}', 'planned')" aria-label="Mark as planned">Planned</button>
      </div>
    `;
    container.appendChild(card);
  });

  updateStats(state);
}

// --- Set status for a destination ---
function setTrackerStatus(destName, status) {
  const state = getTrackerState();

  // Toggle off if same status clicked again
  if (state[destName] === status) {
    delete state[destName];
  } else {
    state[destName] = status;
  }

  saveTrackerState(state);
  renderTracker();
}

// --- Update stats numbers ---
function updateStats(state) {
  let visited = 0;
  let planned = 0;

  Object.values(state).forEach(function (s) {
    if (s === 'visited') visited++;
    if (s === 'planned') planned++;
  });

  document.getElementById('stat-visited').textContent = visited;
  document.getElementById('stat-planned').textContent = planned;
  document.getElementById('stat-wishlist').textContent = getWishlist().length;
}

// --- Reset tracker ---
function resetTracker() {
  if (confirm('Reset all tracking data?')) {
    localStorage.removeItem('tracker_state');
    renderTracker();
  }
}

// --- Event listeners ---
document.addEventListener('DOMContentLoaded', function () {
  initSounds();
  renderTracker();
  document.getElementById('reset-tracker-btn').addEventListener('click', resetTracker);
});
