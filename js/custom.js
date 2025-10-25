//AOS init
AOS.init({duration: 1000, once:true});

// Small toast/notification helper
(function(){
  function ensureContainer(){
    let c = document.getElementById('toastContainer');
    if(!c){
      c = document.createElement('div');
      c.id = 'toastContainer';
      c.setAttribute('aria-live','polite');
      document.body.appendChild(c);
    }
    return c;
  }

  function showToast(message, type='info', timeout=3200){
    const container = ensureContainer();
    const t = document.createElement('div');
    t.className = 'site-toast site-toast-' + type;
    t.role = 'status';
    t.innerText = message;
    container.appendChild(t);
    // animate in
    requestAnimationFrame(()=> t.classList.add('site-toast-show'));
    const id = setTimeout(()=>{
      t.classList.remove('site-toast-show');
      setTimeout(()=>{ t.remove(); }, 300);
    }, timeout);
    // allow click to dismiss early
    t.addEventListener('click', ()=>{ clearTimeout(id); t.classList.remove('site-toast-show'); setTimeout(()=> t.remove(), 150); });
    return t;
  }

  // expose globally
  window.showToast = showToast;
})();

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





  // Event registration handlers 
  function attachRegistrationHandler(formId, modalId, fieldPrefix, selectId){
    const formEl = document.getElementById(formId);
    if(!formEl) return;
    formEl.addEventListener('submit', function(e){
      e.preventDefault();
      const fname = (formEl.querySelector('#' + fieldPrefix + 'firstName')?.value || '').trim();
      const lname = (formEl.querySelector('#' + fieldPrefix + 'lastName')?.value || '').trim();
      const email = (formEl.querySelector('#' + fieldPrefix + 'emailAddress')?.value || '').trim();
      const phone = (formEl.querySelector('#' + fieldPrefix + 'phoneNumber')?.value || '').trim();
      const date = (formEl.querySelector('#' + fieldPrefix + 'sessionDate')?.value || '').trim();
      const selected = (formEl.querySelector('#' + selectId)?.value || '').trim();
      if(!email){ try{ window.showToast && window.showToast('Please enter your email.', 'info'); }catch(e){}; return; }

      const templateParams = {
        to_email: 'bhonemyat9167@gmail.com',
        first_name: fname,
        last_name: lname,
        email: email,
        phone: phone,
        preferred_date: date,
        selected_event: selected
      };

      if(window.emailjs && EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID' && EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID'){
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
          .then(function(response){
            try{ const bs = bootstrap.Modal.getInstance(document.getElementById(modalId)); if(bs) bs.hide(); }catch(err){}
            try{ window.showToast && window.showToast('Registration sent — thank you!', 'success'); }catch(e){}
            formEl.reset();
          }, function(error){
            console.error('EmailJS error', error);
            try{ window.showToast && window.showToast('Failed to send registration. Please try again later.', 'error'); }catch(e){}
          });
      } else {
        let body = `First Name: ${fname}\nLast Name: ${lname}\nEmail: ${email}\nPhone: ${phone}\nPreferred Date: ${date}\nEvent: ${selected}`;
        try{ window.showToast && window.showToast('Opening email client...', 'info'); }catch(e){}
        window.location.href = `mailto:bhonemyat9167@gmail.com?subject=${encodeURIComponent('Event Registration')}&body=${encodeURIComponent(body)}`;
        try{ const bs = bootstrap.Modal.getInstance(document.getElementById(modalId)); if(bs) bs.hide(); }catch(err){}
      }
    });
  }





  // Attach handlers for both modals we updated
  attachRegistrationHandler('registrationForm1', 'eventModal', 'event1_', 'eventSelection1');
  attachRegistrationHandler('registrationForm2', 'registerModal1', 'event2_', 'eventSelection2');
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
      // show toast for added to wishlist
      try{ window.showToast('Added to wishlist', 'success'); }catch(e){}
    } else {
      wishlist = wishlist.filter(id => id !== productId);
      try{ window.showToast('Removed from wishlist', 'info'); }catch(e){}
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
    const texture = eye.getAttribute('data-product-texture');
    const description = eye.getAttribute('data-product-description');
    const usage = eye.getAttribute('data-product-usage');

    // Build modal content
    const content = `
      <div style="text-align:center;">
        <img src="${image}" alt="${name}" style="max-width:180px; border-radius:12px; margin-bottom:16px;">
        <h4>${name}</h4>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Price:</strong> ${price}</p>
        <p><strong>Texture:</strong> ${texture}</p>
        <p><strong>Description:</strong> ${description}</p> 
        <p><strong>Usage:</strong> ${usage}</p> 
      </div>
    `;

    // Inject content and show modal
    document.getElementById('productDetailContent').innerHTML = content;
    const modal = new bootstrap.Modal(document.getElementById('productDetailModal'));
    modal.show();
  });
});

// Sticky navbar: add/remove 
(function(){
  const header = document.getElementById('mainHeader');
  if(!header) return;
  let placeholderAdded = false;
  const setSticky = () => {
    const offset = header.getBoundingClientRect().top + window.scrollY;
    const shouldFix = window.scrollY > (offset + 10) || window.scrollY > 80;
    if(shouldFix){
      if(!header.classList.contains('fixed')){
        header.classList.add('fixed');
        // add top padding to body to avoid content jump
        document.body.style.paddingTop = header.offsetHeight + 'px';
        placeholderAdded = true;
      }
    } else {
      if(header.classList.contains('fixed')){
        header.classList.remove('fixed');
        if(placeholderAdded){ document.body.style.paddingTop = '';} 
        placeholderAdded = false;
      }
    }
  };
  window.addEventListener('scroll', setSticky, {passive:true});
  // run once on load
  window.addEventListener('load', setSticky);
  // also run on resize since header height may change
  window.addEventListener('resize', setSticky);
})();






// EmailJS newsletter submit handler
(function(){
 
  const EMAILJS_USER_ID = 'YOUR_EMAILJS_USER_ID';
  const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; 
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; 

  // Init EmailJS if available
  if(window.emailjs && typeof window.emailjs.init === 'function'){
    try{ emailjs.init(EMAILJS_USER_ID); }catch(e){ console.warn('EmailJS init failed', e); }
  }

  const form = document.getElementById('newsletterForm');
  if(!form) return;

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const fname = (form.querySelector('#firstName')?.value || '').trim();
    const lname = (form.querySelector('#lastName')?.value || '').trim();
    const email = (form.querySelector('#emailAddress')?.value || '').trim();
    const message = (form.querySelector('#subscriptionMessage')?.value || '').trim();
    if(!email){ try{ window.showToast && window.showToast('Please enter your email.', 'info'); }catch(e){}; return; }

    // Prepare template params for EmailJS (includes optional message)
    const templateParams = {
      to_email: 'bhonemyat9167@gmail.com',
      first_name: fname,
      last_name: lname,
      email: email,
      message: message
    };

    if(window.emailjs && EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID' && EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID'){
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(function(response){
          // success
          try{ const bs = bootstrap.Modal.getInstance(document.getElementById('newsletterModal')); if(bs) bs.hide(); }catch(err){}
          try{ window.showToast && window.showToast('Subscription sent — thank you!', 'success'); }catch(e){}
          form.reset();
        }, function(error){
          console.error('EmailJS error', error);
          try{ window.showToast && window.showToast('Failed to send subscription. Please try again later.', 'error'); }catch(e){}
        });
    } else {
      // mailto fallback with message appended
      const subject = 'Newsletter Subscription';
      let body = `First Name: ${fname}\nLast Name: ${lname}\nEmail: ${email}`;
      if(message) body += `\n\nMessage / Request:\n${message}`;
      try{ window.showToast && window.showToast('Opening email client...', 'info'); }catch(e){}
      window.location.href = `mailto:bhonemyat9167@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      try{ const bs = bootstrap.Modal.getInstance(document.getElementById('newsletterModal')); if(bs) bs.hide(); }catch(err){}
    }
  });
})();