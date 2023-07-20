const socket = io()

socket.on('lista_actualizada', products => {
    const productsDiv = document.getElementById('products');
    productsDiv.innerHTML = ''
    products.payload.forEach(e => {
        const div_registro = document.createElement('div');
        div_registro.setAttribute("id", `product_${e._id}`);
        div_registro.innerHTML = `
            <div>
                <p>Id: ${e._id}</p>
                <p>Title: ${e.title}</p>
                <p>Description: ${e.description}</p>
                <p>Code: ${e.code}</p>
                <p>Price: ${e.price}</p>
                <p>Status: ${e.status}</p>
                <p>Stock: ${e.stock}</p>
                <p>Category: ${e.category}</p>
                ${e.thumbnails ? `<p>Tumbnails:</p>` : ''}
                ${e.thumbnails ? e.thumbnails.map(e => `<p>${e}</p>`).join('') : ''}
            </div>
            <hr>
        `
        productsDiv.append(div_registro)
    });
})