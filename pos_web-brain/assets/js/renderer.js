// Fetch products from the API
let allProducts = []; 

fetch('https://dummyjson.com/products')
  .then(res => res.json())
  .then(data => {
    allProducts = data.products; 
    renderProducts(allProducts); 
    renderProductListTable(allProducts); 
  })
  .catch(error => console.error('Error fetching products:', error));

// Function to render products based on category
function renderProducts(products, category = 'all') {
  const productContainer = document.querySelector(`#${category} .row-cols-8`);
  if (!productContainer) {
    console.warn(`Product container for category "${category}" not found in the DOM.`);
    return;
  }

  // Clear existing content
  productContainer.innerHTML = '';

  // Filter products by category if not "all"
  const filteredProducts = category === 'all'
    ? products
    : products.filter(product => product.category.toLowerCase() === category.toLowerCase());

  // Loop through the filtered products and create cards
  filteredProducts.forEach(product => {
    const fullStars = Math.floor(product.rating);
    const halfStar = product.rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<i class="bx bxs-star" style="color: #FED03C;"></i>';
    }
    if (halfStar) {
      starsHTML += '<i class="bx bxs-star-half" style="color: #FED03C;"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += '<i class="bx bx-star" style="color: gray;"></i>';
    }

    const productCard = `
      <article class="card product-card" data-target="modal1">
        <div class="card-head">
          <div class="card-image">
            <img
              src="${product.thumbnail}"
              alt="${product.title}"
              class="image"
            />
            <div class="card-badge">
              <span class="badge">${product.discountPercentage}% Off</span>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="card-title">
            <h1 class="text-ellipsis text-ellipsis-2">
              ${product.title}
            </h1>
          </div>
        </div>
        <div class="card-foot d-flex">
          <div class="footer-content">
            <div class="type">
              <i class="bx bx-leaf icon-green"></i>
              <span>${product.category}</span>
            </div>
            <div class="price">
              <p>$${product.price.toFixed(2)}</p>
            </div>
            <div class="rating">
              ${starsHTML}
            </div>
          </div>
        </div>
      </article>
    `;

    // Append the card to the container
    productContainer.innerHTML += productCard;
  });

  // Add click listeners to the newly rendered product cards
  addProductCardListeners(); 
}

// Function to show product details in the modal
function showProductDetails(product) {
  const modalOverlay = document.querySelector('#modal1Overlay');
  const modal = document.querySelector('#modal1');

  if (!modalOverlay || !modal) {
    console.warn("Modal elements not found in the DOM.");
    return;
  }

  // Populate modal with product details
  modal.querySelector('.card-image img').src = product.thumbnail;
  modal.querySelector('.card-image img').alt = product.title;
  modal.querySelector('.card-title').textContent = product.title;
  modal.querySelector('.card-price').textContent = `$${product.price.toFixed(2)}`;
  modal.querySelector('.card-desc').textContent = product.description;

  // Update the brand in the modal
  const brandElement = modal.querySelector('.product-choice h2');
  if (brandElement) {
    brandElement.textContent = product.brand ? product.brand : "Local Product";
  }

  // Show the modal
  modalOverlay.classList.add('active');
  modal.classList.add('active');
}

// Add event listener to product cards
function addProductCardListeners() {
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach((card) => {
    card.addEventListener('click', () => {
      // Get the product title from the card
      const productTitle = card.querySelector('.card-title h1').textContent.trim();

      // Find the product in the filtered list
      const product = allProducts.find(p => p.title === productTitle);

      if (product) {
        showProductDetails(product);
      } else {
        console.warn('Product not found for the clicked card.');
      }
    });
  });
}

// Function to filter products based on search query
function filterProductsBySearch(query) {
  const filteredProducts = allProducts.filter(product =>
    product.title.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  );
  renderProductListTable(filteredProducts); 
}

// Add event listener to the search input
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.input-group input[type="search"]');
  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      const query = event.target.value;
      filterProductsBySearch(query); 
    });
  } else {
    console.warn("Search input not found in the DOM.");
  }

  // Close modal functionality
  const modalOverlay = document.querySelector('#modal1Overlay');
  const closeModal = document.querySelector('.close-modal');

  if (closeModal) {
    closeModal.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      modalOverlay.querySelector('.modal').classList.remove('active');
    });
  }
});

let takeAwayCart = [];
let deliveryCart = [];


const taxRate = 5; 

// Function to calculate and update totals for a specific cart
function updateCartTotals(cart, containerId) {
  let subtotal = 0;

  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
  });

  const tax = (subtotal * taxRate) / 100;

  const total = subtotal + tax;

  // Update the UI for the specific cart
  const offcanvasFoot = document.querySelector(`#${containerId}`).closest('.offcanvas').querySelector('.offcanvas-foot');
  if (offcanvasFoot) {
    offcanvasFoot.querySelector('.subtotal-price').textContent = `$${subtotal.toFixed(2)}`;
    offcanvasFoot.querySelector('.tax-price').textContent = `$${tax.toFixed(2)}`;
    offcanvasFoot.querySelector('.total-price .subtotal-price').textContent = `$${total.toFixed(2)}`;
  }
}

// Function to render cart items in the offcanvas
function renderCart(cart, containerId) {
  const cartContainer = document.querySelector(`#${containerId}`);
  if (!cartContainer) {
    console.warn(`Cart container with ID ${containerId} not found in the DOM.`);
    return;
  }

  // Clear existing cart items
  cartContainer.innerHTML = '';

  // Loop through cart items and render them
  cart.forEach((item, index) => {
    const cartItem = `
      <div class="card bucket-card">
        <div class="card-head">
          <div class="card-image">
            <div class="close-card">
              <button class="close-card-btn" data-index="${index}" data-container="${containerId}">
                <i class="bx bxs-trash-alt"></i>
              </button>
            </div>
            <img
              src="${item.thumbnail}"
              alt="${item.title}"
              class="image"
            />
          </div>
        </div>
        <div class="card-body">
          <div class="card-title">${item.title}</div>
          <div class="qty-price">
            <div class="qty">${item.quantity}x</div>
            <div class="price text-primary">$${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        </div>
        <div class="card-foot">
          <p class="user-name">Added by: ${item.userName || 'Unknown'}</p>
        </div>
      </div>
    `;

    cartContainer.innerHTML += cartItem;
  });

  
  addRemoveButtonListeners(containerId);

  updateCartTotals(cart, containerId);
}

function addToCart(product, quantity, userName, cartType) {
  const cart = cartType === 'take-away' ? takeAwayCart : deliveryCart;
  const existingProductIndex = cart.findIndex(item => item.id === product.id);

  if (existingProductIndex > -1) {
    cart[existingProductIndex].quantity += quantity;
  } else {
    cart.push({ ...product, quantity, userName });
  }

  const containerId = cartType === 'take-away' ? 'take-away' : 'delivery';
  renderCart(cart, containerId);
}

// Function to remove a product from the cart
function removeFromCart(index, containerId) {
  
  const cart = containerId === 'take-away' ? takeAwayCart : deliveryCart;

  
  cart.splice(index, 1);
  renderCart(cart, containerId);
}

// Add event listeners to "Remove from Cart" buttons
function addRemoveButtonListeners(containerId) {
  const cartContainer = document.querySelector(`#${containerId}`);
  if (!cartContainer) {
    console.warn(`Cart container with ID ${containerId} not found in the DOM.`);
    return;
  }

  const removeButtons = cartContainer.querySelectorAll('.close-card-btn');
  removeButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = parseInt(button.dataset.index, 10);
      const container = button.dataset.container;

      // Call the removeFromCart function
      removeFromCart(index, container);
    });
  });
}

// Add event listener to "Add to Bucket" button in the modal
document.addEventListener('DOMContentLoaded', () => {
  const addToBucketButton = document.querySelector('#addToBucket');
  if (addToBucketButton) {
    addToBucketButton.addEventListener('click', () => {
      const modal = document.querySelector('#modal1');
      const quantityInput = modal.querySelector('#quantity');
      const quantity = parseInt(quantityInput.value, 10) || 1;

      const productId = modal.querySelector('.card-title').textContent;
      const product = allProducts.find(p => p.title === productId);

      const userNameInput = modal.querySelector('.form-field input');
      const userName = userNameInput ? userNameInput.value.trim() : 'Unknown';

      const cartTypeSelect = modal.querySelector('#cartType');
      const cartType = cartTypeSelect ? cartTypeSelect.value : 'take-away';

      if (product) {
        addToCart(product, quantity, userName, cartType);
      }

      const modalOverlay = document.querySelector('#modal1Overlay');
      modalOverlay.classList.remove('active');
      modal.classList.remove('active');
    });
  }

  // Add event listeners to category tabs
  const categoryTabs = document.querySelectorAll('.categories-card.tab');
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.getAttribute('data-nxt-toggle');
      renderProducts(allProducts, category);
    });
  });

  // Render all products by default
  renderProducts(allProducts, 'all');
});

// Function to update the payment modal with price details
function updatePaymentModal() {
  const offcanvasFoot = document.querySelector('.offcanvas-foot');
  const paymentModal = document.querySelector('.payment-modal');

  if (!offcanvasFoot || !paymentModal) {
    console.warn('Offcanvas footer or payment modal not found in the DOM.');
    return;
  }

  // Get price details from the offcanvas footer
  const subtotal = offcanvasFoot.querySelector('.subtotal-price').textContent;
  const tax = offcanvasFoot.querySelector('.tax-price').textContent;
  const total = offcanvasFoot.querySelector('.total-price .subtotal-price').textContent;

  // Update the payment modal with the same price details
  paymentModal.querySelector('.price').textContent = total;
  const paymentBody = paymentModal.querySelector('.card-body');
  paymentBody.innerHTML = `
    <div class="d-flex">
      <div class="card-desc">Sub Total</div>
      <div class="card-desc">${subtotal}</div>
    </div>
    <div class="d-flex">
      <div class="card-desc">Tax 5%</div>
      <div class="card-desc">${tax}</div>
    </div>
    <div class="d-flex">
      <div class="card-desc">Total</div>
      <div class="card-desc">${total}</div>
    </div>
  `;
}

// Add event listener to the "Place Order" button
document.addEventListener('DOMContentLoaded', () => {
  const placeOrderButton = document.querySelector('.place-order .btn-primary');
  if (placeOrderButton) {
    placeOrderButton.addEventListener('click', () => {
      updatePaymentModal();

      // Show the payment modal
      const paymentOverlay = document.querySelector('#paymentOverlay');
      const paymentModal = document.querySelector('#payment');
      paymentOverlay.classList.add('active');
      paymentModal.classList.add('active');
    });
  }
});

// Function to reset the cart and UI for a new order
function resetOrder() {
  // Clear the take-away and delivery carts
  takeAwayCart = [];
  deliveryCart = [];

  // Clear the cart UI
  renderCart(takeAwayCart, 'take-away');
  renderCart(deliveryCart, 'delivery');

  // Reset the offcanvas footer totals
  const offcanvasFooters = document.querySelectorAll('.offcanvas-foot');
  offcanvasFooters.forEach(footer => {
    footer.querySelector('.subtotal-price').textContent = '$0.00';
    footer.querySelector('.tax-price').textContent = '$0.00';
    footer.querySelector('.total-price .subtotal-price').textContent = '$0.00';
  });

  // Close the payment modal
  const paymentOverlay = document.querySelector('#paymentOverlay');
  const paymentModal = document.querySelector('#payment');
  if (paymentOverlay && paymentModal) {
    paymentOverlay.classList.remove('active');
    paymentModal.classList.remove('active');
  }
}

// Add event listener to the "New Order" button
document.addEventListener('DOMContentLoaded', () => {
  const newOrderButton = document.querySelector('.payment-modal .btn-primary');
  if (newOrderButton) {
    newOrderButton.addEventListener('click', () => {
      resetOrder();
    });
  }
});

// Function to render products in the product list table
function renderProductListTable(products) {
  const tableBody = document.querySelector('.product-table tbody');
  
  if (!tableBody) {
    console.warn('Table body not found in the DOM.');
    return;
  }

  // Clear existing rows
  tableBody.innerHTML = '';

  // Loop through products and create table rows
  products.forEach(product => {
    const row = `
      <tr>
        <td>
          <label class="check check-primary list-check">
            <input type="checkbox" />
          </label>
        </td>
        <td>
          <div class="product-images">
            <img src="${product.thumbnail}" class="image" alt="${product.title}" />
          </div>
        </td>
        <td>
          <div class="product-desc">
            <h1>${product.title}</h1>
            <p class="text-ellipsis text-ellipsis-3">${product.description}</p>
          </div>
        </td>
        <td>${product.category}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td>
          <span class="badge ${product.stock > 0 ? 'badge-primary' : 'badge-dark'}">
            ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </td>
        <td>${product.stock}</td>
        <td>${product.discountPercentage}%</td>
        <td>
          <div class="edit-del">
            <i class="bx bx-edit-alt edit"></i>
            <i class="bx bxs-trash-alt del"></i>
          </div>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });

  // Re-bind the "select all" functionality after rendering
  const selectAllCheckbox = document.getElementById('selectAllCheckbox');
  if (selectAllCheckbox) {
    selectAllCheckbox.dispatchEvent(new Event('change'));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const selectAllCheckbox = document.getElementById('selectAllCheckbox');

  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', () => {
      const checkboxes = document.querySelectorAll('.product-table tbody input[type="checkbox"]');
      const isChecked = selectAllCheckbox.checked;

      checkboxes.forEach((checkbox) => {
        checkbox.checked = isChecked;
      });
    });
  }
});

