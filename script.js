let cart = [];

// Function to save cart to local storage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to add a product to the cart
function addToCart(product) {

    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartCounter();
    saveCartToLocalStorage();
    renderCart();
}

// Function to remove a product from the cart
function removeFromCart(productId) {
   
    cart = cart.filter(item => item.id !== productId);
   
    updateCartCounter();
    saveCartToLocalStorage();
    renderCart();
}

// Function to render the cart table
function renderCart() {
    
    const tableBody = document.getElementById('cart-table-body');
    if (tableBody) {
        
        tableBody.innerHTML = '';
        const productMap = new Map();
        
        cart.forEach(product => {
            
            if (productMap.has(product.id)) {
                const existingProduct = productMap.get(product.id);
                existingProduct.quantity += product.quantity;
                existingProduct.totalPrice += product.price * product.quantity;
            } else {
                
                productMap.set(product.id, {
                    ...product,
                    totalPrice: product.price * product.quantity
                });
            }
        });
        
        productMap.forEach(product => {
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${product.image}" alt="${product.title}" style="width: 50px;"></td>
                <td>${product.title}</td>
                <td>${product.description}</td>
                <td>$${product.price.toFixed(2)}</td>
                <!--<td>${product.quantity}</td>-->
                <!--<td>$${product.totalPrice.toFixed(2)}</td>-->
                <td>
                    <button onclick="removeFromCart(${product.id})">Remove</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
       
        const totalPrice = Array.from(productMap.values()).reduce((total, product) => total + product.totalPrice, 0);
        document.getElementById('total-price').textContent = `$${totalPrice.toFixed(2)}`;
    } else {
        console.error("Element with ID 'cart-table-body' not found.");
    }
}

// Function to update cart counter in the header
function updateCartCounter() {
    const cartCounter = document.querySelector('.cart-counter');
    cartCounter.textContent = cart.length;
}

const addToCartButton = document.getElementById('add-to-cart');

// Function to handle "ADD TO CART" button click
addToCartButton.addEventListener('click', () => {
    // Get the currently displayed product information
    const title = document.getElementById('product-title').textContent;
    const description = document.getElementById('product-description').textContent;
    const price = parseFloat(document.getElementById('product-price').textContent.replace('$', ''));
    const image = document.querySelector('.swiper-slide-active .swiper-image').src;
    const product = { id: cart.length + 1, title, description, price, image };

    addToCart(product);
});

// Function to display product information
function displayProductInfo(product) {
    const titleElem = document.getElementById('product-title');
    const descriptionElem = document.getElementById('product-description');
    const priceElem = document.getElementById('product-price');

    titleElem.textContent = product.title;
    descriptionElem.textContent = product.description;
    priceElem.textContent = `$${product.price}`;
}

// Fetch data from API and populate the carousel
fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(data => {
        // Populate the carousel with fetched images
        const swiperWrapper = document.querySelector('.swiper-wrapper');
        data.forEach(product => {
            const slide = document.createElement('div');
            slide.classList.add('swiper-slide');
            slide.innerHTML = `<img src="${product.image}" alt="${product.title}" class="swiper-image">`;
            swiperWrapper.appendChild(slide);
        });
        
        // Initialize Swiper after adding slides
        var swiper = new Swiper('.swiper-container', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 10,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true,
                dynamicMainBullets: 5,
            },
        });

        // Function to update product information based on current slide
        function updateProductInfo() {
            const activeSlideIndex = swiper.activeIndex;
            const currentProduct = data[activeSlideIndex];
            displayProductInfo(currentProduct);
        }

        swiper.on('slideChange', updateProductInfo);

        updateProductInfo();
        console.log(data);
    })
    .catch(error => console.error('Error fetching data:', error));
