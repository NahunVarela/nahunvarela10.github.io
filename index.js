document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.querySelector('.container-cart-icon');
    const cart = document.querySelector('.container-cart-products');
    const addCartButtons = document.querySelectorAll('.btn-add-cart');
    const cartProductsList = document.getElementById('cart-products-list');
    const totalPagar = document.querySelector('.total-pagar');
    const contadorProductos = document.getElementById('contador-productos');
    let cartItems = [];

    cartIcon.addEventListener('click', () => {
        cart.classList.toggle('hidden-cart');
    });

    addCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    function addToCart(event) {
        const button = event.target;
        const item = button.closest('.item');
        const title = item.querySelector('h2').textContent;
        const price = parseFloat(item.querySelector('.price').textContent.replace('$', ''));

        const existingItem = cartItems.find(product => product.title === title);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({
                title,
                price,
                quantity: 1
            });
        }

        renderCart();
    }

    function renderCart() {
        cartProductsList.innerHTML = '';

        cartItems.forEach(item => {
            const cartProduct = document.createElement('div');
            cartProduct.classList.add('cart-product');
            cartProduct.innerHTML = `
                <div class="info-cart-product">
                    <span class="cantidad-producto-carrito">${item.quantity}</span>
                    <p class="titulo-producto-carrito">${item.title}</p>
                    <span class="precio-producto-carrito">$${item.price * item.quantity}</span>
                </div>
                <button class="btn-decrease">-</button>
                <button class="btn-increase">+</button>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-close">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            `;

            cartProductsList.appendChild(cartProduct);

            cartProduct.querySelector('.btn-increase').addEventListener('click', () => {
                item.quantity++;
                renderCart();
            });

            cartProduct.querySelector('.btn-decrease').addEventListener('click', () => {
                item.quantity--;
                if (item.quantity === 0) {
                    cartItems = cartItems.filter(product => product.title !== item.title);
                }
                renderCart();
            });

            cartProduct.querySelector('.icon-close').addEventListener('click', () => {
                cartItems = cartItems.filter(product => product.title !== item.title);
                renderCart();
            });
        });

        updateCartSummary();
    }

    function updateCartSummary() {
        const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        totalPagar.textContent = `$${total.toFixed(2)}`;

        const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        contadorProductos.textContent = totalCount;

        if (cartItems.length === 0) {
            document.querySelector('.cart-empty').classList.remove('hidden');
            document.querySelector('.cart-total').classList.add('hidden');
        } else {
            document.querySelector('.cart-empty').classList.add('hidden');
            document.querySelector('.cart-total').classList.remove('hidden');
        }
    }
});
