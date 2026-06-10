
function initNav() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
  }

  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
  });
}

function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}

function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const emailInput = document.getElementById('newsletter-email');
    const email = emailInput.value.trim();

    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    let emails = JSON.parse(localStorage.getItem('newsletter_emails') || '[]');
    if (!emails.includes(email)) {
      emails.push(email);
      localStorage.setItem('newsletter_emails', JSON.stringify(emails));
    }

    emailInput.value = '';
    alert('Thanks for subscribing!');
  });
}

function showMessage(containerId, message, isSuccess = true) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.textContent = message;
  container.className = isSuccess ? 'success-msg' : 'error-msg';
  container.style.display = 'block';

  setTimeout(() => {
    container.style.display = 'none';
  }, 4000);
}

function getWishlist() {
  return JSON.parse(localStorage.getItem('wishlist') || '[]');
}

function saveWishlist(list) {
  localStorage.setItem('wishlist', JSON.stringify(list));
}

function addToWishlist(destName) {
  const list = getWishlist();
  if (!list.includes(destName)) {
    list.push(destName);
    saveWishlist(list);
    alert(`${destName} added to your wishlist!`);
  } else {
    alert(`${destName} is already in your wishlist.`);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  initNav();
  initScrollReveal();
  initNewsletter();
});
