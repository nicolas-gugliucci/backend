const backButton = document.getElementById('back');

backButton.addEventListener('mouseup', (e) => {
    e.preventDefault();
    window.location.replace(`/products`)
})

const cleanButton = document.getElementById('cleanCart');
const currentUrl = window.location.href;

const url = new URL(currentUrl);

const cid = url.pathname.split('/').pop();

cleanButton.addEventListener('mouseup', (e) => {
    e.preventDefault();
    fetch(`/api/carts/${cid}`,{
        method:'DELETE',
    }).then(result=>{
        if(result.status===200){
            window.location.replace(`/carts/${cid}`)
        }
    })
})

const deleteButtons = document.querySelectorAll('.delateButton');


deleteButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        const pid = this.value;
        e.preventDefault();
        fetch(`/api/carts/${cid}/product/${pid}`, {
            method: 'DELETE',
        }).then(result => {
            if (result.status === 200) {
                window.location.replace(`/carts/${cid}`);
            }
        })
    });
});


const purchaseButton = document.getElementById('purchase');

purchaseButton.addEventListener('mouseup', (e) => {
    e.preventDefault();
    fetch(`/api/carts/${cid}/purchase`,{
        method:'POST',
    }).then(result=>{
        if (result.status === 200) {
            return result.json();
        }
    }).then(data => {
        if (data) {
            if (data.not_processed && data.not_processed.length > 0) {
                Swal.fire({
                    icon: 'warning',
                    title: "Ordered",
                    text: "We regret to inform you that some products were unavailable. However, the purchase has been completed with the available products.\n\tAn E-mail has been sent to you with the purchase sum\n\tPlease check it!",
                }).then(()=>{
                    window.location.replace(`/carts/${cid}`)
                })
            } else {
                Swal.fire({
                    icon: 'success',
                    title: "Ordered",
                    text: "An E-mail has been sent to you with the purchase sum\n\tPlease check it!",
                }).then(()=>{
                    window.location.replace(`/carts/${cid}`)
                })
            }
        } else {
            console.error("Error: No data received from the server");
        }
    }).catch(error => {
        console.error("Error:", error);
    });
})

