/* ==========================================================================
   Abokichi Landing Page Interaction Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Sticky Header scroll behavior ---
  const header = document.querySelector('.main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }


  // --- 2. Mobile Drawer Navigation ---
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const closeDrawer = document.querySelector('.close-drawer');
  const drawerOverlay = document.querySelector('.drawer-overlay');
  const drawerLinks = document.querySelectorAll('.drawer-links a');

  function openMobileMenu() {
    if (mobileDrawer && drawerOverlay) {
      mobileDrawer.classList.add('open');
      drawerOverlay.classList.add('open');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  }

  function closeMobileMenu() {
    if (mobileDrawer && drawerOverlay) {
      mobileDrawer.classList.remove('open');
      drawerOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (mobileToggle && mobileDrawer && closeDrawer && drawerOverlay) {
    mobileToggle.addEventListener('click', openMobileMenu);
    closeDrawer.addEventListener('click', closeMobileMenu);
    drawerOverlay.addEventListener('click', closeMobileMenu);

    // Close drawer if any mobile link is clicked
    drawerLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }


  // --- 3. Mock Search Overlay ---
  const searchBtn = document.getElementById('search-btn');
  const searchOverlay = document.getElementById('search-overlay');
  const closeSearch = document.querySelector('.close-search');
  const searchInput = document.getElementById('search-input');

  if (searchBtn && searchOverlay && closeSearch && searchInput) {
    searchBtn.addEventListener('click', () => {
      searchOverlay.classList.add('open');
      setTimeout(() => searchInput.focus(), 300); // Focus input after transition
    });

    closeSearch.addEventListener('click', () => {
      searchOverlay.classList.remove('open');
      searchInput.value = ''; // Reset input
    });

    // Close search on ESC keypress
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchOverlay.classList.contains('open')) {
        searchOverlay.classList.remove('open');
        searchInput.value = '';
      }
    });
  }


  // --- 4. Interactive Toast System ---
  let toastTimeout;

  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    const toastMessage = toast.querySelector('.toast-message');
    if (!toastMessage) return;

    // Clear existing timer if triggered repeatedly
    clearTimeout(toastTimeout);
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }


  // --- 5. Add to Cart Logic ---
  const cartCountBadge = document.querySelector('.cart-count');
  const addToCartButtons = document.querySelectorAll('.add-to-cart-action');
  let cartCount = 0;

  addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Get the product title
      const productCard = button.closest('.product-card');
      if (!productCard) return;
      const titleEl = productCard.querySelector('.product-title');
      const title = titleEl ? titleEl.textContent : 'Product';
      
      // Increment count
      cartCount++;
      if (cartCountBadge) {
        cartCountBadge.textContent = cartCount;
        
        // Scale animation on badge
        cartCountBadge.style.transform = 'scale(1.3)';
        setTimeout(() => {
          cartCountBadge.style.transform = '';
        }, 300);
      }

      // Trigger success notification
      showToast(`Added: ${title.split(' - ')[0]} to your cart!`);
    });
  });


  // --- 6. Add to Wishlist Logic ---
  const wishlistButtons = document.querySelectorAll('.add-to-wishlist-action');
  
  wishlistButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      const productCard = button.closest('.product-card');
      const title = productCard.querySelector('.product-title').textContent;
      
      showToast(`Saved to Wishlist: ${title.split(' - ')[0]}`);
    });
  });


  // --- 7. Video Player Modal ---
  const playVideoBtn = document.getElementById('play-video-btn');
  const videoModal = document.getElementById('video-modal');
  const closeVideoModal = document.getElementById('close-video-modal');
  const modalOverlay = document.getElementById('modal-overlay');

  if (playVideoBtn && videoModal && closeVideoModal && modalOverlay) {
    function openVideo() {
      videoModal.classList.add('open');
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeVideo() {
      videoModal.classList.remove('open');
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    playVideoBtn.addEventListener('click', openVideo);
    closeVideoModal.addEventListener('click', closeVideo);
    modalOverlay.addEventListener('click', closeVideo);

    // Close modal on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoModal.classList.contains('open')) {
        closeVideo();
      }
    });
  }


  // --- 8. Newsletter Signup Form ---
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmail = document.getElementById('newsletter-email');

  if (newsletterForm && newsletterEmail) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent standard page reload
      
      const email = newsletterEmail.value.trim();
      if (email) {
        showToast(`Thank you! Successfully subscribed ${email} to Abokichi newsletters.`);
        newsletterForm.reset();
      }
    });
  }


  // --- 9. Product Listing Filter & Sort ---
  const filterBtn = document.querySelector('.filter-btn');
  const filterPanel = document.getElementById('filter-panel');
  const grid = document.querySelector('.products-grid');
  const sortDropdown = document.querySelector('.sort-dropdown');
  const countTitle = document.querySelector('.catalog-title-main');

  // Toggle filter panel
  if (filterBtn && filterPanel) {
    filterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      filterPanel.classList.toggle('open');
    });
  }

  // Filter & Sort logic
  if (grid) {
    const cards = Array.from(grid.querySelectorAll('.product-card'));
    const checkboxes = Array.from(document.querySelectorAll('.filter-checkbox'));

    // Apply filters
    function applyFilters() {
      const activeFilters = {
        category: [],
        type: [],
        rating: [],
        flavour: []
      };

      checkboxes.forEach(cb => {
        if (cb.checked) {
          activeFilters[cb.name].push(cb.value);
        }
      });

      let visibleCount = 0;

      cards.forEach(card => {
        const cat = card.dataset.category || '';
        const type = card.dataset.type || '';
        const rating = parseInt(card.dataset.rating) || 5;
        const flavour = card.dataset.flavour || '';

        // Match Category (OR inside category group)
        const matchCat = activeFilters.category.length === 0 || activeFilters.category.includes(cat);
        // Match Type
        const matchType = activeFilters.type.length === 0 || activeFilters.type.includes(type);
        // Match Rating (matches any checked star ratings, OR logic within group)
        const matchRating = activeFilters.rating.length === 0 || activeFilters.rating.includes(rating.toString());
        // Match Flavour
        const matchFlavour = activeFilters.flavour.length === 0 || activeFilters.flavour.includes(flavour);

        // AND across groups
        if (matchCat && matchType && matchRating && matchFlavour) {
          card.classList.remove('hidden');
          visibleCount++;
        } else {
          card.classList.add('hidden');
        }
      });

      // Update count text in real-time
      if (countTitle) {
        countTitle.textContent = `Products (${visibleCount})`;
      }
    }

    // Sort products
    function applySorting() {
      if (!sortDropdown) return;
      const criterion = sortDropdown.value;
      const sortedCards = Array.from(grid.querySelectorAll('.product-card'));

      sortedCards.sort((a, b) => {
        const titleA = a.querySelector('.product-title').textContent.trim().toLowerCase();
        const titleB = b.querySelector('.product-title').textContent.trim().toLowerCase();
        const priceA = parseFloat(a.dataset.price) || 0;
        const priceB = parseFloat(b.dataset.price) || 0;

        if (criterion === 'az') {
          return titleA.localeCompare(titleB);
        } else if (criterion === 'za') {
          return titleB.localeCompare(titleA);
        } else if (criterion === 'lh') {
          return priceA - priceB;
        } else if (criterion === 'hl') {
          return priceB - priceA;
        }
        return 0;
      });

      // Re-append sorted cards in DOM
      sortedCards.forEach(card => grid.appendChild(card));
    }

    // Attach listeners for filter checkboxes
    checkboxes.forEach(cb => {
      cb.addEventListener('change', applyFilters);
    });

    // Attach listener for sorting dropdown
    if (sortDropdown) {
      sortDropdown.addEventListener('change', applySorting);
    }
  }

  // --- 10. Product Detail Page (PDP) Dynamic Content ---
  const pdpTitle = document.getElementById('pdp-title');
  if (pdpTitle) {
    const productsDB = {
      'okazu-lovers-set': {
        title: "OKAZU Lovers Set (230ml/12 jars)",
        price: "$135.00",
        oldPrice: "$167.88",
        stars: "★★★★★",
        reviews: "32 Reviews",
        description: "Your new cooking BFF! You can add this to virtually everything. Try it on rice, on meat or tofu, in your burger, ramen and pretty much anything.",
        image1: "https://www.abokichi.com/cdn/shop/files/OKAZU_Spicy_Chili_12_Pack_8351e171-99f4-47d9-ad76-a57396cff59c.png?crop=center&height=420&v=1783415669&width=420",
        thumbnails: [
          "https://www.abokichi.com/cdn/shop/files/OKAZU_Spicy_Chili_12_Pack_8351e171-99f4-47d9-ad76-a57396cff59c.png?crop=center&height=420&v=1783415669&width=420",
          "https://www.abokichi.com/cdn/shop/files/20260409_Silo_OKAZU_Chili_front_2.png?v=1780569253&width=840",
          "https://www.abokichi.com/cdn/shop/files/OKAZU_Spicy_Chili_12_Pack_8351e171-99f4-47d9-ad76-a57396cff59c.png?crop=center&height=420&v=1783415669&width=420"
        ]
      },
      'chili-miso': {
        title: "OKAZU - CHILI MISO - Japanese miso chili oil condiment (230ml)",
        price: "$13.99",
        oldPrice: "",
        stars: "★★★★☆",
        reviews: "24 Reviews",
        description: "Chili OKAZU is an umami-rich chili, miso, and sesame oil based condiment often eaten with rice in Japan, which can also be used to top chicken, burgers, fish, eggs, potatoes, and more.",
        image1: "https://www.abokichi.com/cdn/shop/files/20260409_Silo_OKAZU_Chili_front_2.png?v=1780569253&width=840",
        thumbnails: [
          "https://www.abokichi.com/cdn/shop/files/20260409_Silo_OKAZU_Chili_front_2.png?v=1780569253&width=840",
          "https://www.abokichi.com/cdn/shop/files/OKAZU_Spicy_Chili_12_Pack_8351e171-99f4-47d9-ad76-a57396cff59c.png?crop=center&height=420&v=1783415669&width=420",
          "https://www.abokichi.com/cdn/shop/files/20260409_Silo_OKAZU_Chili_front_2.png?v=1780569253&width=840"
        ]
      },
      'miso-soup': {
        title: "Instant Miso Soup Tasting Set",
        price: "$19.99",
        oldPrice: "$24.00",
        stars: "★★★☆☆",
        reviews: "24 Reviews",
        description: "Enjoy the authentic taste of Abokichi's organic instant miso soup tasting set. Packed with rich nutrients and dynamic umami flavors.",
        image1: "https://www.abokichi.com/cdn/shop/files/ABO_Miso_Soup_Set_54b0a9bb-441c-4a26-8bd0-7e7ae4b50d91.png?v=1783415669&width=840",
        thumbnails: [
          "https://www.abokichi.com/cdn/shop/files/ABO_Miso_Soup_Set_54b0a9bb-441c-4a26-8bd0-7e7ae4b50d91.png?v=1783415669&width=840",
          "https://www.abokichi.com/cdn/shop/products/IMG_8015_d7c3e1db-3b5a-47ed-9290-017d59c93a7a.png?crop=center&height=420&v=1675184532&width=420",
          "https://www.abokichi.com/cdn/shop/files/ABO_Miso_Soup_Set_54b0a9bb-441c-4a26-8bd0-7e7ae4b50d91.png?v=1783415669&width=840"
        ]
      },
      'matcha': {
        title: "ABO Matcha: Uji matcha, Organic, Ceremonial grade",
        price: "$34.00",
        oldPrice: "",
        stars: "★☆☆☆☆",
        reviews: "24 Reviews",
        description: "Vibrant green organic ceremonial-grade Uji matcha. Hand-harvested and stone-ground to preserve the richest aroma and health benefits.",
        image1: "https://www.abokichi.com/cdn/shop/products/IMG_8015_d7c3e1db-3b5a-47ed-9290-017d59c93a7a.png?crop=center&height=420&v=1675184532&width=420",
        thumbnails: [
          "https://www.abokichi.com/cdn/shop/products/IMG_8015_d7c3e1db-3b5a-47ed-9290-017d59c93a7a.png?crop=center&height=420&v=1675184532&width=420",
          "https://www.abokichi.com/cdn/shop/files/ABO_Miso_Soup_Set_54b0a9bb-441c-4a26-8bd0-7e7ae4b50d91.png?v=1783415669&width=840",
          "https://www.abokichi.com/cdn/shop/products/IMG_8015_d7c3e1db-3b5a-47ed-9290-017d59c93a7a.png?crop=center&height=420&v=1675184532&width=420"
        ]
      },
      'coffee': {
        title: "ABO Organic Coffee Beans (250g)",
        price: "$16.99",
        oldPrice: "",
        stars: "★★★★☆",
        reviews: "15 Reviews",
        description: "Richly roasted organic coffee beans sourced responsibly and roasted to perfection for a balanced, full-bodied morning cup.",
        image1: "https://www.abokichi.com/cdn/shop/products/IMG_8015_d7c3e1db-3b5a-47ed-9290-017d59c93a7a.png?crop=center&height=420&v=1675184532&width=420",
        style: "filter: hue-rotate(120deg) brightness(0.85);",
        thumbnails: [
          "https://www.abokichi.com/cdn/shop/products/IMG_8015_d7c3e1db-3b5a-47ed-9290-017d59c93a7a.png?crop=center&height=420&v=1675184532&width=420",
          "https://www.abokichi.com/cdn/shop/files/ABO_Miso_Soup_Set_54b0a9bb-441c-4a26-8bd0-7e7ae4b50d91.png?v=1783415669&width=840",
          "https://www.abokichi.com/cdn/shop/products/IMG_8015_d7c3e1db-3b5a-47ed-9290-017d59c93a7a.png?crop=center&height=420&v=1675184532&width=420"
        ]
      },
      'gift-card': {
        title: "Abokichi Greeting & E-Gift Card",
        price: "$5.00",
        oldPrice: "",
        stars: "★★★★★",
        reviews: "10 Reviews",
        description: "The perfect gift for OKAZU and matcha lovers! Abokichi E-Gift Card is delivered instantly and fits any special occasion.",
        image1: "https://www.abokichi.com/cdn/shop/files/ABO_Miso_Soup_Set_54b0a9bb-441c-4a26-8bd0-7e7ae4b50d91.png?v=1783415669&width=840",
        style: "filter: sepia(0.8) hue-rotate(200deg);",
        thumbnails: [
          "https://www.abokichi.com/cdn/shop/files/ABO_Miso_Soup_Set_54b0a9bb-441c-4a26-8bd0-7e7ae4b50d91.png?v=1783415669&width=840",
          "https://www.abokichi.com/cdn/shop/products/IMG_8015_d7c3e1db-3b5a-47ed-9290-017d59c93a7a.png?crop=center&height=420&v=1675184532&width=420",
          "https://www.abokichi.com/cdn/shop/files/ABO_Miso_Soup_Set_54b0a9bb-441c-4a26-8bd0-7e7ae4b50d91.png?v=1783415669&width=840"
        ]
      }
    };

    // Parse URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || 'okazu-lovers-set';
    const product = productsDB[productId] || productsDB['okazu-lovers-set'];

    // Fill DOM elements
    pdpTitle.textContent = product.title;
    
    const pdpCrumb = document.getElementById('pdp-crumb');
    if (pdpCrumb) pdpCrumb.textContent = product.title;

    const pdpPrice = document.getElementById('pdp-price');
    if (pdpPrice) pdpPrice.textContent = product.price;

    const pdpOldPrice = document.getElementById('pdp-old-price');
    if (pdpOldPrice) {
      if (product.oldPrice) {
        pdpOldPrice.textContent = product.oldPrice;
        pdpOldPrice.style.display = 'inline';
      } else {
        pdpOldPrice.style.display = 'none';
      }
    }

    const pdpMainImg = document.getElementById('pdp-main-img');
    if (pdpMainImg) {
      pdpMainImg.src = product.image1;
      pdpMainImg.alt = product.title;
      if (product.style) {
        pdpMainImg.style.cssText = product.style;
      } else {
        pdpMainImg.style.cssText = '';
      }
    }

    const pdpReviews = document.getElementById('pdp-reviews');
    if (pdpReviews) pdpReviews.textContent = product.reviews;

    const pdpStars = document.querySelector('.pdp-rating .stars');
    if (pdpStars) pdpStars.textContent = product.stars;

    const pdpShortDesc = document.querySelector('.pdp-short-desc');
    if (pdpShortDesc) pdpShortDesc.textContent = product.description;

    // Render thumbnails
    const thumbnailsContainer = document.querySelector('.thumbnails');
    if (thumbnailsContainer) {
      thumbnailsContainer.innerHTML = '';
      product.thumbnails.forEach((thumbSrc, index) => {
        const thumbBox = document.createElement('div');
        thumbBox.className = `thumb-box${index === 0 ? ' active' : ''}`;
        
        const img = document.createElement('img');
        img.src = thumbSrc;
        img.alt = `${product.title} Thumb ${index + 1}`;
        if (product.style) {
          img.style.cssText = product.style;
        }

        thumbBox.appendChild(img);
        thumbnailsContainer.appendChild(thumbBox);

        // Click interaction
        thumbBox.addEventListener('click', () => {
          document.querySelectorAll('.thumb-box').forEach(b => b.classList.remove('active'));
          thumbBox.classList.add('active');
          if (pdpMainImg) {
            pdpMainImg.src = thumbSrc;
          }
        });
      });
    }

    // Thumbnail slider buttons
    const prevBtn = document.querySelector('.thumb-nav:first-of-type');
    const nextBtn = document.querySelector('.thumb-nav:last-of-type');
    if (prevBtn && nextBtn && thumbnailsContainer) {
      prevBtn.addEventListener('click', () => {
        thumbnailsContainer.scrollBy({ left: -100, behavior: 'smooth' });
      });
      nextBtn.addEventListener('click', () => {
        thumbnailsContainer.scrollBy({ left: 100, behavior: 'smooth' });
      });
    }

    // Tabs functionality
    const tabsNav = document.querySelectorAll('.pdp-tabs-nav li');
    const tabContent = document.querySelector('.pdp-tab-content');
    if (tabsNav.length > 0 && tabContent) {
      const tabsDB = {
        0: [
          `<p>${product.description}</p>`,
          `<p>Chili OKAZU is an umami-rich chili, miso, and sesame oil based condiment often eaten with rice in Japan, which can also be used to top chicken, burgers, fish, eggs, potatoes, and more. Use it as a marinade or as an ingredient in your own homemade salad dressing, this condiment is versatile and we encourage you to experiment.</p>`,
          `<p>OKAZU gained an initial following at farmers' markets in Toronto and has been featured in The Toronto Star, The National Post, Toronto Life, FoodiePages and a winner of the Foodie Pick Awards.</p>`,
          `<p>HEAT LEVEL: MILD-MEDIUM</p>`,
          `<p>INGREDIENTS: SUNFLOWER OIL, SESAME OIL, GARLIC, MISO PASTE (ORGANIC SOYBEANS, RICE, SALT), TAMARI SOY SAUCE (NON-GMO SOYBEANS, SALT, SUGAR), SUGAR, CHILI POWDER, WHITE SESAME SEEDS.<br>CHILI & SPICY OKAZU CONTAINS: SESAME, SOYBEANS. MAY CONTAIN: MUSTARD.</p>`,
          `<p>CURRY OKAZU CONTAINS: SESAME, SOYBEANS, MUSTARD.</p>`,
          `<p>INGREDIENTS:<br>PRODUCT SEPARATION IS NORMAL. REFRIGERATE AFTER OPENING</p>`
        ].join(''),
        1: [
          `<h4>Customer Reviews</h4>`,
          `<div style="margin: 15px 0; color: #ff8c3a; font-size: 20px;">${product.stars}</div>`,
          `<p>Based on ${product.reviews}</p>`,
          `<div style="text-align: left; background-color: #f7f9fa; padding: 15px; border-radius: 4px; margin-top: 15px;">`,
          `  <strong>Highly Recommended!</strong> <span style="color:#ff8c3a;">★★★★★</span>`,
          `  <p style="margin: 5px 0 0 0; font-size: 13px; color:#555;">"Outstanding product. It adds a delicious savory crunch and miso flavor to everything. We have gone through three jars already!"</p>`,
          `</div>`
        ].join(''),
        2: [
          `<h4>Recipe & Promo Videos</h4>`,
          `<p>Learn how to use Abokichi products in your daily recipes with our quick tutorial guides.</p>`,
          `<div style="margin-top: 20px;"><img src="https://www.abokichi.com/cdn/shop/files/Mask_Group_5_2x_2f03333c-9bde-425e-97f0-6d9fc89ee313.png?v=1665558879&width=480" alt="Video cover" style="max-width: 350px; border: 1px solid #ddd; border-radius: 4px;"></div>`
        ].join(''),
        3: [
          `<h4>Community Comments</h4>`,
          `<p>Have questions about ingredients or allergen information? Post a comment below or email customer support.</p>`,
          `<div style="margin-top: 15px;"><textarea placeholder="Add a comment..." style="width:100%; max-width: 500px; height: 80px; padding: 10px; font-family:var(--font-primary); font-size:13px; border: 1px solid #cbd5e0;"></textarea><br><button class="btn" style="margin-top: 10px; background-color:var(--color-primary); color:white; padding:8px 15px; font-size:12px; border:none; cursor:pointer;">Post Comment</button></div>`
        ].join('')
      };

      // Set initial tab content
      tabContent.innerHTML = tabsDB[0];

      tabsNav.forEach((tab, index) => {
        tab.addEventListener('click', () => {
          tabsNav.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          tabContent.innerHTML = tabsDB[index] || '';
        });
      });
    }

    // Connect PDP Add to Cart and Buy Now button toasts
    const pdpAddCartBtn = document.querySelector('.btn-add-cart');
    const pdpBuyNowBtn = document.querySelector('.btn-buy-now');
    
    if (pdpAddCartBtn) {
      pdpAddCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        cartCount++;
        cartCountBadge.textContent = cartCount;
        
        // Scale animation on badge
        cartCountBadge.style.transform = 'scale(1.3)';
        setTimeout(() => {
          cartCountBadge.style.transform = '';
        }, 300);

        showToast(`Added: ${product.title.split(' - ')[0]} to your cart!`);
      });
    }
    if (pdpBuyNowBtn) {
      pdpBuyNowBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `order-placed.html?product=${encodeURIComponent(product.title)}`;
      });
    }
  }

});
