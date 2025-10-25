

(function(){
	const CART_KEY = 'bb_cart';

	function loadCart(){
		try{ return JSON.parse(sessionStorage.getItem(CART_KEY)) || []; }
		catch(e){ return []; }
	}

	function saveCart(cart){
		try{ sessionStorage.setItem(CART_KEY, JSON.stringify(cart)); }
		catch(e){ console.error('Failed to save cart', e); }
	}

	function getPriceFromCard(card){
		const priceEl = card.querySelector('.price');
		if(!priceEl) return 0;
		// find first $number in the text
		const match = priceEl.textContent.match(/\$\s*([\d,]+(?:\.\d{1,2})?)/);
		return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
	}

	function getNameFromCard(card){
		return (card.querySelector('.name')?.textContent || card.querySelector('h3')?.textContent || 'Product').trim();
	}

	function getImageFromCard(card){
		return card.querySelector('img')?.getAttribute('src') || '';
	}

	function getIdFromCard(card){
		// prefer existing data-product-id, otherwise build id from name
		const iconHeart = card.querySelector('.iconsProduct .fa-heart');
		const pid = iconHeart?.dataset?.productId;
		if(pid) return pid;
		return getNameFromCard(card).toLowerCase().replace(/[^a-z0-9]+/g,'_');
	}

	function addToCart(item){
		const cart = loadCart();
		const idx = cart.findIndex(i => i.id === item.id);
		if(idx > -1){ cart[idx].qty = (cart[idx].qty || 1) + 1; }
		else { item.qty = 1; cart.push(item); }
		saveCart(cart);
		renderCart();
	}

	function removeItem(id){
		if(!id) return;
		const cart = loadCart();
		const idx = cart.findIndex(i => i.id === id);
		if(idx > -1){
			cart.splice(idx,1);
			saveCart(cart);
			renderCart();
		}
	}

	function changeQty(id, delta){
		if(!id || !delta) return;
		const cart = loadCart();
		const idx = cart.findIndex(i => i.id === id);
		if(idx === -1) return;
		cart[idx].qty = Math.max(0, (cart[idx].qty || 1) + delta);
		if(cart[idx].qty <= 0){
			cart.splice(idx,1);
		}
		saveCart(cart);
		renderCart();
	}

	function updateCartCount(count){
		const cartIcon = document.getElementById('cartIcon');
		if(!cartIcon) return;
		const parent = cartIcon.parentElement;
		if(!parent) return;
		let badge = parent.querySelector('#cartCount');
		// If there are no items, remove/hide badge and return
		if(!count || count <= 0){
			if(badge){
				badge.remove();
			}
			return;
		}
		// Ensure badge exists when we have a positive count
		if(!badge){
			badge = document.createElement('span');
			badge.id = 'cartCount';
			// simple inline style so it works without CSS changes
			badge.style.position = 'absolute';
			badge.style.top = '4px';
			badge.style.right = '4px';
			badge.style.background = '#e74c3c';
			badge.style.color = '#fff';
			badge.style.padding = '2px 6px';
			badge.style.borderRadius = '12px';
			badge.style.fontSize = '12px';
			parent.style.position = parent.style.position || 'relative';
			parent.appendChild(badge);
		}
		badge.textContent = String(count);
	}

	function renderCart(){
		const cart = loadCart();
		const dropdown = document.getElementById('cartDropdown');
		if(!dropdown) return;
		if(cart.length === 0){
			dropdown.innerHTML = '<div class="cart-item">Cart is empty</div>';
			updateCartCount(0);
			return;
		}
		let total = 0;
			const itemsHtml = cart.map(it => {
				const line = (it.price || 0) * (it.qty || 1);
				total += line;
				return `
					<div class="cart-item" data-id="${escapeHtml(it.id)}">
						<div class="thumb"><img src="${escapeHtml(it.image)}" alt=""></div>
						<div class="meta">
							<div class="name">${escapeHtml(it.name)}</div>
							<div class="price">$${(it.price||0).toFixed(2)} each</div>
						</div>
						<div class="controls">
							<button class="cart-decrease" data-id="${escapeHtml(it.id)}">-</button>
							<div class="qty">${it.qty}</div>
							<button class="cart-increase" data-id="${escapeHtml(it.id)}">+</button>
							<div class="line-total">$${line.toFixed(2)}</div>
							<button class="cart-remove remove" data-id="${escapeHtml(it.id)}">✕</button>
						</div>
					</div>`;
			}).join('');

			dropdown.innerHTML = itemsHtml + `
				<div class="cart-total">Total : $${total.toFixed(2)}</div>
				<div class="cart-actions">
					<a href="beanProduct.html" class="btn-primary">View Products</a>
					<button id="clearCartBtn" class="btn-primary btn-clear">Clear Cart</button>
				</div>`;

			
			const clearBtn = dropdown.querySelector('#clearCartBtn');
			if (clearBtn) {
				
			}
		updateCartCount(cart.reduce((s,i)=>s + (i.qty||0), 0));
	}

	// Event delegation for cart dropdown buttons
	function ensureDropdownDelegation(){
		const dropdown = document.getElementById('cartDropdown');
		if(!dropdown) return;
		if(dropdown.__bb_delegation_attached) return;
		dropdown.__bb_delegation_attached = true;
		dropdown.addEventListener('click', function(e){
			// prevent the global document click handler from hiding the dropdown
			e.stopPropagation();
			const removeBtn = e.target.closest('.cart-remove');
			if(removeBtn){
				e.preventDefault();
				const id = removeBtn.dataset.id;
				console.log('cart: remove', id);
				removeItem(id);
				return;
			}
			const dec = e.target.closest('.cart-decrease');
			if(dec){
				e.preventDefault();
				changeQty(dec.dataset.id, -1);
				return;
			}
			const inc = e.target.closest('.cart-increase');
			if(inc){
				e.preventDefault();
				changeQty(inc.dataset.id, +1);
				return;
			}
			const clearBtn = e.target.closest('#clearCartBtn');
			if(clearBtn){
				e.preventDefault();
				saveCart([]); renderCart();
				return;
			}
		});
	}

	function escapeHtml(str){
		return String(str).replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]; });
	}

	document.addEventListener('DOMContentLoaded', function(){
		// initialize existing cart from session
		renderCart();

		// ensure we have delegated handlers for dropdown buttons
		ensureDropdownDelegation();

		
		document.querySelectorAll('.product-card .btn-primary').forEach(btn => {
			btn.addEventListener('click', function(e){
				
				const href = btn.getAttribute('href');
				if(href && href.trim() !== ''){
					
					return;
				}
				e.preventDefault();
				const card = btn.closest('.product-card');
				if(!card) return;
				const item = {
					id: getIdFromCard(card),
					name: getNameFromCard(card),
					price: getPriceFromCard(card),
					image: getImageFromCard(card)
				};
				addToCart(item);

				// tiny UI feedback
				const old = btn.textContent;
				btn.textContent = 'Added';
				setTimeout(()=>{ btn.textContent = old; }, 900);
			});
		});

		// Initialize search behavior
		function initSearch(){
			const searchBar = document.getElementById('searchBar');
			const input = searchBar?.querySelector('input');
			if(!input) return;

			// small result message inside searchBar
			let resultsMsg = searchBar.querySelector('.search-results-msg');
			if(!resultsMsg){
				resultsMsg = document.createElement('div');
				resultsMsg.className = 'search-results-msg';
				resultsMsg.style.marginTop = '6px';
				resultsMsg.style.fontSize = '12px';
				resultsMsg.style.color = '#fff';
				searchBar.appendChild(resultsMsg);
			}

			function resetVisibility(){
				document.querySelectorAll('.product-card, .deals-cards .card').forEach(el=>{
					el.style.display = '';
					el.classList.remove('search-highlight');
				});
				resultsMsg.textContent = '';
			}

			function performSearch(q){
				q = (q||'').trim().toLowerCase();
				if(!q){ resetVisibility(); return; }

				// Determine scope: on homepage limit to #topSeller and #bestSeller
				const isHome = !!(document.getElementById('topSeller') || document.getElementById('bestSeller') || window.location.pathname.endsWith('home.html'));
				let candidates = [];
				if(isHome){
					candidates = Array.from(document.querySelectorAll('#topSeller .product-card, #bestSeller .deals-cards .card'));
				} else {
					// product pages: search all product cards and generic cards
					candidates = Array.from(document.querySelectorAll('.product-card, .deals-cards .card, .card'));
				}

				let matched = 0;
				candidates.forEach(el => {
					const text = (el.innerText || '').toLowerCase();
					if(text.includes(q)){
						el.style.display = '';
						el.classList.add('search-highlight');
						matched++;
					} else {
						el.style.display = 'none';
						el.classList.remove('search-highlight');
					}
				});

				resultsMsg.textContent = matched ? `${matched} item(s) found` : 'No results';
				if(matched>0){
					const first = candidates.find(c=> c.style.display !== 'none');
					first?.scrollIntoView({behavior: 'smooth', block: 'center'});
				}
			}

			input.addEventListener('input', function(e){ performSearch(e.target.value); });
			input.addEventListener('keydown', function(e){ if(e.key === 'Escape'){ input.value = ''; resetVisibility(); input.blur(); } });
		}

		initSearch();

		
		window.__bb_cart = {
			load: loadCart,
			save: saveCart,
			render: renderCart,
			add: (it)=> addToCart(it),
			remove: (id)=> removeItem(id),
			changeQty: (id,delta)=> changeQty(id,delta),
			clear: ()=> { saveCart([]); renderCart(); }
		};
	});
})();

