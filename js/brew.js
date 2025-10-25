//AOS init
AOS.init({duration: 1000, once:true});
//menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () =>{
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
  });
}

//drop down menu
const searchIcon = document.getElementById('searchIcon');
const cartIcon = document.getElementById('cartIcon');
const watchIcon = document.getElementById('watchIcon');
const userIcon = document.getElementById('userIcon');

const searchBar = document.getElementById('searchBar');
const cartDropdown = document.getElementById('cartDropdown');
const watchDropdown = document.getElementById('watchDropdown');
const userDropdown = document.getElementById('userDropdown');

function hideAllDropdowns(){
  if (searchBar) searchBar.style.display = 'none';
  if (cartDropdown) cartDropdown.style.display = 'none';
  if (watchDropdown) watchDropdown.style.display = 'none';
  if (userDropdown) userDropdown.style.display = 'none';
}

if (searchIcon) {
  searchIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    hideAllDropdowns();
    if (searchBar) searchBar.style.display = "block";
  });
}
if (cartIcon) {
  cartIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    hideAllDropdowns();
    if (cartDropdown) cartDropdown.style.display = "block";
  });
}
if (watchIcon) {
  watchIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    hideAllDropdowns();
    if (watchDropdown) watchDropdown.style.display = "block";
  });
}
if (userIcon) {
  userIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    hideAllDropdowns();
    if (userDropdown) userDropdown.style.display = "block";
  });
}

//hide on outside click function
document.addEventListener("click", (e) => {
  if(!e.target.closest('.icons')){
    hideAllDropdowns();
  }
});


//video play Handler?////////////////////////////////////////////
const playBtn = document.getElementById("playBtn"),
      video = document.getElementById('workVideo'),
      thumbnail =  document.getElementById('videoThumb');

playBtn?.addEventListener('click', () =>{
    playBtn.style.display = thumbnail.style.display = "none";
    video.style.display = "block";
    video.play();
})

document.addEventListener("DOMContentLoaded", function() {
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    counter.innerText = '0';
    const updateCounter = () => {
      const target = +counter.getAttribute('data-target');
      const current = +counter.innerText;
      const increment = Math.ceil(target / 100);

      if (current < target) {
        counter.innerText = `${Math.min(current + increment, target)}`;
        setTimeout(updateCounter, 30);
      } else {
        counter.innerText = target;
      }
    };
    updateCounter();
  });
});


//for time running at shopping cart////////////////////////////////////////////
function parseTimeString(str) {
    const match = str.match(/(\d+)d\s*(\d+)h\s*(\d+)m\s*(\d+)s/i);
    if (!match) return null;
    return {
        days: parseInt(match[1], 10),
        hours: parseInt(match[2], 10),
        minutes: parseInt(match[3], 10),
        seconds: parseInt(match[4], 10)
    };
}

// Convert time object to total seconds
function toSeconds(t) {
    return t.days * 86400 + t.hours * 3600 + t.minutes * 60 + t.seconds;
}

// Convert total seconds back to time object
function fromSeconds(s) {
    const days = Math.floor(s / 86400);
    s %= 86400;
    const hours = Math.floor(s / 3600);
    s %= 3600;
    const minutes = Math.floor(s / 60);
    const seconds = s % 60;
    return {days, hours, minutes, seconds};
}

// Update all timers
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.product-card[data-time]').forEach(function(card) {
        const timerDiv = card.querySelector('.timer');
        if (!timerDiv) return;
        const timeStr = card.getAttribute('data-time');
        let timeObj = parseTimeString(timeStr);
        if (!timeObj) return;
        let totalSeconds = toSeconds(timeObj);

        function updateDisplay(t) {
            const values = timerDiv.querySelectorAll('.time-value');
            if (values.length >= 4) {
                values[0].textContent = String(t.days).padStart(2, '0');
                values[1].textContent = String(t.hours).padStart(2, '0');
                values[2].textContent = String(t.minutes).padStart(2, '0');
                values[3].textContent = String(t.seconds).padStart(2, '0');
            }
        }

        updateDisplay(timeObj);

        const interval = setInterval(function() {
            if (totalSeconds > 0) {
                totalSeconds--;
                updateDisplay(fromSeconds(totalSeconds));
            } else {
                clearInterval(interval);
            }
        }, 1000);
    });
});

// Customer feedback btn js
document.addEventListener("DOMContentLoaded", function() {
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let current = 0;

function showCard(index) {
  cards.forEach((card, i) => {
    // Show cards at index and index+1
    if (i === index || i === (index + 1) % cards.length) {
      card.classList.add('active');
      card.style.display = 'block';
    } else {
      card.classList.remove('active');
      card.style.display = 'none';
    }
  });
}


  showCard(current);

  prevBtn.addEventListener('click', function() {
    current = (current - 1 + cards.length) % cards.length;
    showCard(current);
  });

  nextBtn.addEventListener('click', function() {
    current = (current + 1) % cards.length;
    showCard(current);
  });
});
// End line


// Backtotop button /////////////////////////////////////////////////

window.addEventListener('scroll', function() {
    const btn = document.getElementById('backToTop');
    if (window.scrollY > 300) {
        btn.style.display = 'block';
    } else {
        btn.style.display = 'none';
    }
});
document.getElementById('backToTop').onclick = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};


//connect wishlist with heart icon toggle
// --- Wishlist Logic ---
let wishlist = [];

document.querySelectorAll('.iconsProduct .fa-heart').forEach(function(heart) {
  heart.addEventListener('click', function() {
    const productId = heart.dataset.productId;
    heart.classList.toggle('active');

    if (heart.classList.contains('active')) {
      if (!wishlist.includes(productId)) {
        wishlist.push(productId);
      }
    } else {
      wishlist = wishlist.filter(id => id !== productId);
    }
    updateWishlistDropdown();
  });
});

function updateWishlistDropdown() {
  const dropdown = document.getElementById('watchDropdown');
  if (wishlist.length === 0) {
    dropdown.innerHTML = '<div class="watch-item">Wishlist is empty</div>';
  } else {
    dropdown.innerHTML = wishlist.map(id =>
      `<div class="watch-item">Product ID: ${id} added to wishlist</div>`
    ).join('');
  }
}



document.querySelectorAll('.iconsProduct .fa-eye').forEach(function(eye) {
  eye.addEventListener('click', function() {
    // Get product data from data attributes
    const name = eye.getAttribute('data-product-name');
    const price = eye.getAttribute('data-product-price');
    const image = eye.getAttribute('data-product-image');
    const category = eye.getAttribute('data-product-category');
    
    const usage = eye.getAttribute('data-product-usage');

    // Build modal content
    const content = `
      <div style="text-align:center;">
        <img src="${image}" alt="${name}" style="max-width:180px; border-radius:12px; margin-bottom:16px;">
        <h4>${name}</h4>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Price:</strong> ${price}</p>
    
        <p><strong>Usage:</strong> ${usage}</p> 
      </div>
    `;

    // Inject content and show modal
    document.getElementById('productDetailContent').innerHTML = content;
    const modal = new bootstrap.Modal(document.getElementById('productDetailModal'));
    modal.show();
  });
});