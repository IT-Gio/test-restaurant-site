// Existing fetch and rendering functions

const apiUrl = 'https://restaurant.stepprojects.ge/api/Products/GetAll';   
let objects = [];
let filteredObjects = [];  // This will hold the filtered results

fetch(apiUrl)
  .then(response => response.json()) 
  .then(fetchedData => {
    objects.push(...fetchedData); 
    filteredObjects = [...objects];  // Initialize filteredObjects with all products
    renderCartItems(filteredObjects);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

// Retrieve cached delivery fee from localStorage or set to null
let cachedDeliveryFee = localStorage.getItem('cachedDeliveryFee');
cachedDeliveryFee = cachedDeliveryFee ? parseFloat(cachedDeliveryFee) : null;

function renderCartItems(products) {
  const checkoutContainer = document.getElementById('checkout-container');
  checkoutContainer.innerHTML = ''; 

  let cart = JSON.parse(localStorage.getItem('cartDetails')) || [];
  let totalPrice = 0;
  let renderedItems = new Set();
  const DELIVERY_FEE_PERCENT = 0.15; // 15% delivery fee
  const FREE_DELIVERY_THRESHOLD = 50; // Free delivery if total >= $50

  const cartWrapper = document.createElement('div');
  cartWrapper.classList.add('cart-wrapper');

  cart.forEach(cartItem => {
    const product = products.find(item => item.name === cartItem.name);
    
    if (product && !renderedItems.has(product.name)) {
      renderedItems.add(product.name);
      totalPrice += product.price * cartItem.quantity;

      const imageUrl = product.image ? product.image : 'default-image.jpg';

      const card = document.createElement('div');
      card.classList.add('product-card');

      card.innerHTML = ` 
        <img src="${imageUrl}" alt="${product.name}" class="product-image"/>
        <h3>${product.name}</h3>
        <p>Spiciness: ${product.spiciness}</p>
        <p>Vegetarian: ${product.vegeterian ? 'Yes' : 'No'}</p>
        <p>Nuts: ${product.nuts ? 'Yes' : 'No'}</p>
        <div class="price-container">
          <p>Price: $${product.price} x ${cartItem.quantity} = $${(product.price * cartItem.quantity).toFixed(2)}</p>
        </div>
      `;

      cartWrapper.appendChild(card);
    }
  });
  // Function to POST data to the server
// Function to POST data to the server
function postOrderData(orderDetails) {
  fetch('https://your-api-endpoint.com/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderDetails), // Send order details as JSON
  })
    .then(response => response.json())
    .then(data => {
      
      // Clear localStorage after successful order
      localStorage.removeItem('dataPOST');
      localStorage.removeItem('cartDetails');

      // Redirect to order confirmation page
      window.location.href = 'orderValid.html';
    })
    .catch(error => {
      console.error('Error posting order:', error);
      alert("Failed to place order. Please try again.");
    });
}

// Form Submission Handling

// Show the success popup
function showSuccessPopup() {
  const popup = document.createElement('div');
  popup.classList.add('popup');
  popup.innerHTML = `
      <div class="popup-content">
          <h2>Transaction Successful!</h2>
          <p>Your order has been placed successfully.</p>
          <button onclick="window.location.href='index.html';">Go to Home</button>
      </div>
  `;
  document.body.appendChild(popup);
}

// Show the invalid input popup
function showInvalidPopup() {
  const popup = document.createElement('div');
  popup.classList.add('popup');
  popup.innerHTML = `
      <div class="popup-content">
          <h2>Invalid Input</h2>
          <p>Please make sure all fields are filled correctly.</p>
          <button class="go-back-btn">Back to Form</button>
      </div>
  `;
  document.body.appendChild(popup);

  // Add event listener to the "Back to Form" button
  const goBackButton = document.querySelector('.go-back-btn');
  goBackButton.addEventListener('click', closeInvalidPopup);
}

// Close the invalid input popup and reset form
function closeInvalidPopup() {
  const popups = document.querySelectorAll('.popup');
  popups.forEach(popup => popup.remove());  // Remove all popups
}

// Handle form submission
document.getElementById('confirmButton').addEventListener("click", function(event) {
  event.preventDefault();  // Prevent form submission

  // Get form values
  const ccInfo = document.getElementById("ccInfo").value.trim();
  const city = document.getElementById("city").value.trim();
  const location = document.getElementById("location").value.trim();
  const phone = document.getElementById("phone").value.trim();

  // Check if all fields are filled
  if (!ccInfo || !city || !location || !phone) {
      showInvalidPopup();
      return;
  }

  // Security check: Only numbers, spaces, or "-" allowed for credit card and phone
  const numberSpaceDashRegex = /^[0-9\s-]+$/;

  if (!numberSpaceDashRegex.test(ccInfo)) {
      showInvalidPopup();
      return;
  }

  // Phone number validation: Only numbers and a "+" sign at the start if present
  const phoneRegex = /^\+?[0-9]+([\s-]?[0-9]+)*$/; // Allows "+" at the beginning and numbers with optional spaces or dashes between digits
  
  if (!phoneRegex.test(phone)) {
      showInvalidPopup();
      return;
  }

  // Create order details object
  const orderDetails = {
      creditCard: ccInfo,
      city: city,
      location: location,
      phone: phone
  };

  // Simulate a successful transaction
  setTimeout(() => {
      // On success, clear localStorage and show success popup
      localStorage.removeItem('dataPOST');
      localStorage.removeItem('cartDetails');
      showSuccessPopup();
  }, 1000); // Simulate a delay for the transaction
});


// Calculate total amount for the order
function calculateTotalAmount() {
  let totalPrice = 0;
  let cart = JSON.parse(localStorage.getItem('cartDetails')) || [];
  cart.forEach(cartItem => {
    const product = objects.find(item => item.name === cartItem.name);
    if (product) {
      totalPrice += product.price * cartItem.quantity;
    }
  });
  const cachedDeliveryFee = localStorage.getItem('cachedDeliveryFee') || 0;
  return totalPrice + parseFloat(cachedDeliveryFee);
}

  checkoutContainer.appendChild(cartWrapper);

  if (totalPrice > 0) {
    if (totalPrice >= FREE_DELIVERY_THRESHOLD) {
      cachedDeliveryFee = 0; // Free delivery
    } else if (cachedDeliveryFee === null || isNaN(cachedDeliveryFee)) {
      cachedDeliveryFee = totalPrice * DELIVERY_FEE_PERCENT;
      localStorage.setItem('cachedDeliveryFee', cachedDeliveryFee.toFixed(2)); // Store in localStorage
    }

    let grandTotal = totalPrice + cachedDeliveryFee;

    const summaryContainer = document.createElement('div');
    summaryContainer.classList.add('summary-container');

    summaryContainer.innerHTML = `
      <p>Subtotal: $${totalPrice.toFixed(2)}</p>
      <p>Delivery Fee: ${cachedDeliveryFee === 0 ? '<span style="color: green;">FREE</span>' : `$${cachedDeliveryFee.toFixed(2)}`}</p>
      <p><strong>Total: $${grandTotal.toFixed(2)}</strong></p>
    `;

    const button = document.createElement('button');
    button.classList.add('checkout-button');
    button.textContent = `Buy for $${grandTotal.toFixed(2)}`;

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    buttonContainer.appendChild(button);

    checkoutContainer.appendChild(summaryContainer);
    checkoutContainer.appendChild(buttonContainer);

    // Show modal when "Buy" button is clicked
    button.addEventListener('click', () => {
      modal.style.display = "block"; // Show the modal
    });
  }
}

// Modal Handling
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const checkoutForm = document.getElementById("checkoutForm");

closeModal.addEventListener("click", () => {
  modal.style.display = "none"; // Close the modal
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none"; // Close the modal if clicked outside
  }
});

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent form submission

  const ccInfo = document.getElementById("ccInfo").value;
  const location = document.getElementById("location").value;
  const phone = document.getElementById("phone").value;

  if (!ccInfo || !location || !phone) {
    alert("Please fill in all the required fields.");
    return;
  }


  modal.style.display = "none"; // Close the modal

  // Optionally, perform additional actions, such as sending data to a server
  alert("Your purchase is complete! your driver will contact you soon!.");
});


