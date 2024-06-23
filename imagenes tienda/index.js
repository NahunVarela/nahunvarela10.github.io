document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.querySelector('.container-cart-icon');
    const cart = document.querySelector('.container-cart-products');
    const addCartButtons = document.querySelectorAll('.btn-add-cart');
    const cartProductsList = document.getElementById('cart-products-list');
    const totalPagar = document.querySelector('.total-pagar');
    const contadorProductos = document.getElementById('contador-productos');

    // Cargar los artículos del carrito desde localStorage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Función para guardar los artículos del carrito en localStorage
    function saveCartItems() {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    // Función para renderizar el contenido del carrito
    function renderCart() {
        // Limpia la lista actual de productos del carrito
        cartProductsList.innerHTML = '';

        // Añade cada producto del carrito al DOM
        cartItems.forEach(item => {
            const cartProduct = document.createElement('div');
            cartProduct.classList.add('cart-product');
            cartProduct.innerHTML = `
                <div class="info-cart-product">
                    <span class="cantidad-producto-carrito">${item.quantity}</span>
                    <p class="titulo-producto-carrito">${item.title}</p>
                    <span class="precio-producto-carrito">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <button class="btn-decrease">-</button>
                <button class="btn-increase">+</button>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-close">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            `;

            cartProductsList.appendChild(cartProduct);

            // Añade evento para incrementar la cantidad del producto
            cartProduct.querySelector('.btn-increase').addEventListener('click', () => {
                item.quantity++;
                saveCartItems();
                renderCart();
            });

            // Añade evento para decrementar la cantidad del producto
            cartProduct.querySelector('.btn-decrease').addEventListener('click', () => {
                item.quantity--;
                if (item.quantity === 0) {
                    cartItems = cartItems.filter(product => product.title !== item.title);
                }
                saveCartItems();
                renderCart();
            });

            // Añade evento para eliminar el producto del carrito
            cartProduct.querySelector('.icon-close').addEventListener('click', () => {
                cartItems = cartItems.filter(product => product.title !== item.title);
                saveCartItems();
                renderCart();
            });
        });

        // Actualiza el resumen del carrito
        updateCartSummary();
    }

    // Función para actualizar el resumen del carrito
    function updateCartSummary() {
        const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        totalPagar.textContent = `$${total.toFixed(2)}`;

        const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        contadorProductos.textContent = totalCount;

        // Muestra u oculta los mensajes de carrito vacío y el total del carrito
        if (cartItems.length === 0) {
            document.querySelector('.cart-empty').classList.remove('hidden');
            document.querySelector('.cart-total').classList.add('hidden');
        } else {
            document.querySelector('.cart-empty').classList.add('hidden');
            document.querySelector('.cart-total').classList.remove('hidden');
        }
    }

    // Añade un evento para mostrar/ocultar el carrito al hacer clic en el ícono del carrito
    cartIcon.addEventListener('click', () => {
        cart.classList.toggle('hidden-cart');
    });

    // Añade eventos a los botones de agregar al carrito
    addCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // Función para agregar productos al carrito
    function addToCart(event) {
        const button = event.target;
        const item = button.closest('.item');
        const title = item.querySelector('h2').textContent;
        const price = parseFloat(item.querySelector('.price').textContent.replace('$', ''));

        // Verifica si el producto ya está en el carrito
        const existingItem = cartItems.find(product => product.title === title);

        if (existingItem) {
            // Incrementa la cantidad si ya existe
            existingItem.quantity++;
        } else {
            // Añade el nuevo producto al carrito
            cartItems.push({
                title,
                price,
                quantity: 1
            });
        }

        // Guarda el estado actualizado del carrito en localStorage y vuelve a renderizar el carrito
        saveCartItems();
        renderCart();
    }

    // Carga y renderiza los datos del carrito desde localStorage al cargar la página
    renderCart();
});
