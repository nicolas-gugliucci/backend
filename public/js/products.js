let cart

const addToCartButtons = document.querySelectorAll('.add-to-cart');

const addToCartHandler = (event) => {
    event.preventDefault();
    const productId = event.target.dataset.productId;
    console.log('Product ID:', productId);
};

addToCartButtons.forEach((button) => {
    button.addEventListener('click', addToCartHandler);
});