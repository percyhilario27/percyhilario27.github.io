// Define cart array to store items
let cart = [];

// Function to add item to cart
function cambiarABotonContador(element) {
    const productContainer = element.closest('.product');
    const product = {
        id: Date.now(),
        name: productContainer.querySelector('h3').innerText,
        price: parseFloat(productContainer.querySelector('.precio').innerText.replace('S/', '')),
        image: productContainer.querySelector('img').src,
        quantity: 1
    };
    
    cart.push(product);
    updateCartDisplay();
    
    element.outerHTML = `
        <div class="contador" id="contador-container" data-product-id="${product.id}">
            <button onclick="actualizarContador(-1, this)">-</button>
            <span id="contador">1</span>
            <button onclick="actualizarContador(1, this)">+</button>
        </div>
    `;
}

// Function to update counter and cart
function actualizarContador(incremento, element) {
    const contadorContainer = element.closest('.contador');
    const productId = contadorContainer.dataset.productId;
    const contador = contadorContainer.querySelector("#contador");
    let valorActual = parseInt(contador.innerText);
    valorActual += incremento;

    const cartItem = cart.find(item => item.id.toString() === productId);
    if (cartItem) {
        if (valorActual <= 0) {
            cart = cart.filter(item => item.id.toString() !== productId);
            contadorContainer.outerHTML = `
                <button class="boton-anadir" onclick="cambiarABotonContador(this)"><h3>AÑADIR</h3></button>
            `;
        } else {
            cartItem.quantity = valorActual;
            contador.innerText = valorActual;
        }
        updateCartDisplay();
    }
}

// Function to update cart display
function updateCartDisplay() {
    const cartBody = document.querySelector("#lista-carrito tbody");
    
    // Create or get total element
    let totalContainer = document.querySelector("#cart-total-container");
    if (!totalContainer) {
        document.querySelector("#lista-carrito").insertAdjacentHTML('afterend', `
            <div id="cart-total-container" style="margin-top: 10px;">
                <strong>Total: </strong><span id="cart-total">S/0</span>
            </div>
        `);
    }
    
    // Clear current cart display
    cartBody.innerHTML = '';
    
    // Calculate total
    let total = 0;
    
    // Add each item to cart display
    cart.forEach(item => {
        total += item.price * item.quantity;
        
        cartBody.innerHTML += `
            <tr>
                <td><img src="${item.image}" width="50" alt="${item.name}"></td>
                <td>${item.name}</td>
                <td>S/${item.price}</td>
                <td>${item.quantity}</td>
                <td><button onclick="removeFromCart(${item.id})" class="remove-btn">X</button></td>
            </tr>
        `;
    });
    
    // Update total
    document.querySelector("#cart-total").textContent = `S/${total.toFixed(2)}`;
    
    // Show/hide checkout button
    let checkoutBtn = document.querySelector("#checkout-btn");
    if (cart.length > 0) {
        if (!checkoutBtn) {
            document.querySelector("#cart-total-container").insertAdjacentHTML('afterend', `
                <button id="checkout-btn" onclick="checkout()" class="btn-2" style="margin-top: 10px;">
                    <h3>Realizar Compra</h3>
                </button>
            `);
        }
    } else if (checkoutBtn) {
        checkoutBtn.remove();
    }
}

// Function to remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    const contador = document.querySelector(`.contador[data-product-id="${productId}"]`);
    if (contador) {
        contador.outerHTML = `
            <button class="boton-anadir" onclick="cambiarABotonContador(this)"><h3>AÑADIR</h3></button>
        `;
    }
    updateCartDisplay();
}

// Function to handle checkout
function checkout() {
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Compra realizada con éxito!\nTotal pagado: S/${total.toFixed(2)}`);
    
    // Clear cart and reset UI
    cart = [];
    document.querySelectorAll('.contador').forEach(contador => {
        contador.outerHTML = `
            <button class="boton-anadir" onclick="cambiarABotonContador(this)"><h3>AÑADIR</h3></button>
        `;
    });
    
    updateCartDisplay();
}

// Function to empty cart
document.querySelector("#vaciar-carrito").addEventListener('click', function(e) {
    e.preventDefault();
    cart = [];
    document.querySelectorAll('.contador').forEach(contador => {
        contador.outerHTML = `
            <button class="boton-anadir" onclick="cambiarABotonContador(this)"><h3>AÑADIR</h3></button>
        `;
    });
    updateCartDisplay();
});

// Initialize cart display
document.addEventListener('DOMContentLoaded', updateCartDisplay);











