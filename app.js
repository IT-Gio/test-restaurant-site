const apiUrl = 'https://restaurant.stepprojects.ge/api/Products/GetAll';
let objects = [];
let filteredObjects = [];  // This will hold the filtered results

fetch(apiUrl)
  .then(response => response.json()) 
  .then(fetchedData => {
    objects.push(...fetchedData); 
    filteredObjects = [...objects];  // Initialize filteredObjects with all products
    renderProducts(filteredObjects);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

// Initialize cartDetails from localStorage or as an empty array
let cartDetails = JSON.parse(localStorage.getItem('cartDetails')) || []; // Load cart details or initialize an empty array

// Function to store product details in the cart
function storeProductDetails(product, quantity) {
    const productDetails = {
        id: product.id,
        name: product.name,
        price: product.price,
        categoryId: product.categoryId,
        quantity: quantity,
    };


    // Check if the product already exists in the cart
    const existingProductIndex = cartDetails.findIndex(item => item.id === product.id);

    if (existingProductIndex !== -1) {
        cartDetails[existingProductIndex].quantity += quantity;
    } else {
        cartDetails.push(productDetails);
    }

    // Save the cart details locally
    localStorage.setItem('cartDetails', JSON.stringify(cartDetails));

    // Create the dataPOST variable to store locally
    const dataPOST = cartDetails.map(item => ({
        quantity: item.quantity,
        price: item.price,
        productId: item.id,
    }));

    // Save dataPOST locally
    localStorage.setItem('dataPOST', JSON.stringify(dataPOST));

    // Render cart immediately after adding an item
    renderCartDetails();
}

// Function to render the cart from cartDetails
function renderCartDetails() {
    const cartContainer = document.querySelector('.cart-container');
    cartContainer.innerHTML = ''; // Clear any existing items

    if (cartDetails.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty!</p>';
        return;
    }

    cartDetails.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        const itemName = document.createElement('span');
        itemName.textContent = `${item.name} - $${item.price} x ${item.quantity}`;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'X';
        removeBtn.classList.add('remove-btn');
        removeBtn.addEventListener('click', () => removeFromCartDetails(item.id));

        cartItem.appendChild(itemName);
        cartItem.appendChild(removeBtn);
        cartContainer.appendChild(cartItem);
    });

    updateCheckoutButton();
}

// Function to remove an item from the cart
function removeFromCartDetails(productId) {
    cartDetails = cartDetails.filter(item => item.id !== productId);
    localStorage.setItem('cartDetails', JSON.stringify(cartDetails));

    // Create the dataPOST variable to store locally after removal
    const dataPOST = cartDetails.map(item => ({
        quantity: item.quantity,
        price: item.price,
        productId: item.id,
    }));

    // Save dataPOST locally after removal
    localStorage.setItem('dataPOST', JSON.stringify(dataPOST));

    // Update the checkout button state
    updateCheckoutButton();

    // Render the cart details (if needed)
    renderCartDetails();
}

// Function to update the checkout button based on cart details
function updateCheckoutButton() {
    const checkoutButton = document.querySelector('.seeCart');
    
    // Fetch the latest cart details from localStorage
    const cartDetails = JSON.parse(localStorage.getItem('cartDetails')) || [];

    if (!checkoutButton) return;
    if (cartDetails.length === 0) {
        checkoutButton.disabled = true;
    }
    else if(cartDetails.length > 0) {
        checkoutButton.disabled = false;
    }

    // Ensure event listener is added only once
    checkoutButton.removeEventListener('click', goToCheckout);
    if (cartDetails.length > 0) {
        checkoutButton.addEventListener('click', goToCheckout);
    }
}

// Function to navigate to checkout page
function goToCheckout() {
    window.location.href = 'checkout.html';
}

// Ensure the cart is rendered on page load
document.addEventListener('DOMContentLoaded', () => {
    renderCartDetails();
});

// Attach event listeners to "Add to Cart" buttons
document.querySelectorAll('.add-cart-btn').forEach((button, index) => {
    button.addEventListener('click', () => {
        const product = objects[index];
        const quantity = 1;

        storeProductDetails(product, quantity);
        renderCartDetails(); // Re-render the cart immediately after adding an item
    });
});

// Initialize the cart display on page load
document.addEventListener('DOMContentLoaded', () => {
    renderCartDetails(); // Load and render saved cart details from localStorage
});

// Create cart container and checkout button in the DOM
document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.createElement('div');
    cartContainer.classList.add('cart-container');
    document.body.appendChild(cartContainer);

    // Ensure the "Check out" button starts disabled
    const checkoutButton = document.querySelector('.seeCart');
    checkoutButton.disabled = true;

    renderCartDetails(); // Render saved cart on page load
});


// Product rendering
function renderProducts(objects) {
  const container = document.querySelector('.container');
  container.innerHTML = '';

  if (objects.length === 0) {
      const message = document.createElement('p');
      message.textContent = "No products found matching the selected criteria.";
      container.appendChild(message);
  } else {
      objects.forEach(object => {
          const card = document.createElement('div');
          card.classList.add('card');

          const image = document.createElement('img');
          image.src = object.image;
          image.alt = object.name;
          image.classList.add('card-image');
          card.appendChild(image);

          const description = document.createElement('div');
          description.classList.add('card-description');

          const title = document.createElement('h2');
          title.textContent = object.name;
          description.appendChild(title);

          const price = document.createElement('p');
          price.textContent = `Price: $${object.price}`;
          description.appendChild(price);

          const spiciness = document.createElement('p');
          spiciness.textContent = `Spiciness Level: ${object.spiciness}`;
          description.appendChild(spiciness);

          const vegetarian = document.createElement('p');
          vegetarian.textContent = object.vegeterian ? 'Vegetarian: Yes' : 'Vegetarian: No';
          description.appendChild(vegetarian);

          const nuts = document.createElement('p');
          nuts.textContent = object.nuts ? 'Contains Nuts: Yes' : 'Contains Nuts: No';
          description.appendChild(nuts);

          card.appendChild(description);

          const addCart = document.createElement('button');
          addCart.textContent = 'Add to Cart';
          addCart.classList.add('add-cart-btn');
          addCart.addEventListener('click', () => storeProductDetails(object, 1)); 
          card.appendChild(addCart);

          container.appendChild(card);
      });
  }
}

document.addEventListener('DOMContentLoaded', function () {
    const search = document.querySelector('#search');

    // Detect Firefox (because it doesn't show the "X")
    const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

    if (isFirefox) {
        // Add a custom "X" for Firefox users
        const clearBtn = document.createElement('span');
        clearBtn.textContent = '✖';
        clearBtn.style.cursor = 'pointer';
        clearBtn.style.marginLeft = '5px';
        clearBtn.style.fontSize = '16px';
        clearBtn.style.display = 'none'; // Hide initially
        search.parentNode.insertBefore(clearBtn, search.nextSibling);

        search.addEventListener('input', function () {
            clearBtn.style.display = search.value ? 'inline' : 'none';
        });

        clearBtn.addEventListener('click', function () {
            search.value = '';
            clearBtn.style.display = 'none';
            filteredObjects = [...objects];
            applyFilters();
        });
    } else {
        // Just use the built-in "X" for Chrome, Edge, Safari, etc.
        search.addEventListener('input', function () {
            if (this.value === '') {
                filteredObjects = [...objects];
                applyFilters();
            }
        });
    }
});

// Create cart container and checkout button in the DOM
document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.createElement('div');
    cartContainer.classList.add('cart-container');
    document.body.appendChild(cartContainer);

    // Ensure the "Check out" button starts disabled
    const checkoutButton = document.querySelector('.seeCart');
    checkoutButton.disabled = true;

    renderCartDetails(); // Render saved cart on page load
});

function searchItems() {
    let search = document.querySelector('#search');

    search.addEventListener('input', function () {  
        let value = search.value.toLowerCase(); 

        filteredObjects = objects.filter(object => {
            return object.name.toLowerCase().includes(value) ||  
                   (object.category && object.category.toLowerCase().includes(value)); 
        });

        applyFilters(); // Apply all active filters after search

        // Reset results if search is cleared (detects "X" button click)
        if (search.value === '') {
            filteredObjects = [...objects]; // Reset to all products
            applyFilters();
        }
        search.addEventListener('input', function () {
            if (this.value === '') {
                filteredObjects = [...objects]; // Reset product list
                applyFilters();
            }
        });
        
    });
}




// Sorting functions
function sortZtoA(objects) {
  return objects.slice().sort((a, b) => b.name.localeCompare(a.name));
}
function sortAtoZ(objects) {
  return objects.slice().sort((a, b) => a.name.localeCompare(b.name));
}
function priceLowToHigh(objects) {
  return objects.slice().sort((a, b) => a.price - b.price);
}
function priceHighToLow(objects) {
  return objects.slice().sort((a, b) => b.price - a.price);
}

// Category filters
function catVegan(objects) {
  return objects.filter(object => object.vegeterian === true);
}
function catNutFree(objects) {
  return objects.filter(object => object.nuts === false);
}

// Spice level filter
function filterBySpiciness(objects, level) {
  return objects.filter(object => object.spiciness === parseInt(level) && object.spiciness !== 0);
}
// Apply all filters and render the final filtered products
function applyFilters() {
    let filtered = [...objects];  // Start with the full list of items

    // Apply search filter
    const search = document.querySelector('#search').value.toLowerCase();
    if (search) {
        filtered = filtered.filter(object => object.name.toLowerCase().includes(search) ||  
                                              object.category && object.category.toLowerCase().includes(search));
    }

    // Apply category filter (if vegan, nut free, etc.)
    const categorySelect = document.querySelector("#searchByDish").value;
    if (categorySelect === "veg") {
        filtered = catVegan(filtered);
    } else if (categorySelect === "noNuts") {
        filtered = catNutFree(filtered);
    }

    // Apply spice level filter
    const spiceLevel = document.getElementById("spiceLevel").value;
    if (spiceLevel !== "-1") {  // If it's not -1, apply spice level filter
        if (spiceLevel === "0") {
            filtered = filtered.filter(object => object.spiciness === 0);  // Filter items with spice level 0
        } else {
            filtered = filterBySpiciness(filtered, spiceLevel);  // Apply spice level filter for other values
        }
    }

    const spiceLabel = document.getElementById("spiceLabel");

    // Apply sorting
    const sortSelect = document.querySelector("#searchBy").value;
    switch (sortSelect) {
        case "AtoZ":
            filtered = sortAtoZ(filtered);
            break;
        case "ZtoA":
            filtered = sortZtoA(filtered);
            break;
        case "priceLtoH":
            filtered = priceLowToHigh(filtered);
            break;
        case "priceHtoL":
            filtered = priceHighToLow(filtered);
            break;
        default:
            break;
    }

    renderProducts(filtered);  // Finally, render the filtered products
}

// Handle all input changes
function handleFilters() {
    const sortSelect = document.querySelector("#searchBy");
    const sortByCategory = document.querySelector("#searchByDish");
    const rangeInput = document.getElementById("spiceLevel");
    const rangeValue = document.getElementById("rangeValue");  // Get the element displaying the spice level value

    // display "not specified" when the value is -1
    
    // Update the spice level display when slider is moved
    rangeInput.addEventListener("input", function () {
        if (rangeInput.value == -1) {
            rangeValue.textContent = "Not Specified";  // Display "Not Specified" when the spice level is set to -1
        } else {
            rangeValue.textContent = rangeInput.value;  // Update the displayed spice level
        }
    
        applyFilters();  // Apply filters when the spice level changes
    });
    

    sortSelect.addEventListener("change", applyFilters);
    sortByCategory.addEventListener("change", applyFilters);
    rangeInput.addEventListener("input", applyFilters);  // Ensure this event listener is set up once
}

function  toggleSidebar() {
    document.querySelector('.asideCont').classList.toggle('open');
    document.querySelector('.asideCont').classList.toggle('closed');
}
window.addEventListener("scroll", function () {
    const aside = document.querySelector(".asideCont");
    const button = document.querySelector(".toggleSidebarBtn");
    const main = document.querySelector(".main");

    // Get the distance of the main tag from the top of the page
    const mainTop = main.offsetTop;
    const scrollY = window.scrollY;

    // Make aside and button sticky after scrolling past the main section
    if (scrollY >= mainTop) {
        aside.style.position = "fixed";
        aside.style.top = "60px";

        button.style.position = "fixed";
        button.style.top = "20px"; // Adjust as needed
    } else {
        aside.style.position = "absolute";
        aside.style.top = "40px";

        button.style.position = "absolute";
        button.style.top = "20px"; // Keeps it inside main initially
    }
});





handleFilters();  // Initialize the filters
searchItems();  // Initialize the search functionality
