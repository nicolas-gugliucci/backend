const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartButton = document.getElementById('cart');
const cartId = cartButton.value

cartButton.addEventListener('mouseup', (e) => {
    e.preventDefault();
    window.location.replace(`/carts/${cartId}`)
})

const addToCartHandler = (event) => {
    event.preventDefault();
    const productId = event.target.dataset.productId;
    fetch(`/api/carts/${cartId}/product/${productId}`,{
        method:'POST',
    }).then(result=>{
        if(result.status===200){
            console.log('added to cart')
        }
    })
    
};

addToCartButtons.forEach((button) => {
    button.addEventListener('click', addToCartHandler);
});

const out = document.getElementById('logout')

out.addEventListener('mouseup', (e) => {
    e.preventDefault();
    fetch('/api/sessions/logout',{
        method:'GET'
    }).then(result=>{
        if(result.status===200){
            window.location.replace('/login')
        }
    })
})

const userButton = document.getElementById('userIcon');

userButton.addEventListener('mouseup', (e) => {
    e.preventDefault();
    window.location.replace(`/profile`)
})
