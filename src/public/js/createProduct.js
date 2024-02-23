const newProductForm = document.getElementById('addNewProductForm');
const title = document.getElementById('title');
const description = document.getElementById('description');
const code = document.getElementById('code');
const price = document.getElementById('price');
const stock = document.getElementById('stock');
const category = document.getElementById('category');
const owner = document.getElementById('owner');

newProductForm.onsubmit = async (e) => {
    e.preventDefault();

    const newProductData = {
        title: title.value,
        description: description.value,
        code: code.value,
        price: price.value,
        stock: stock.value,
        category: category.value,
        owner: owner.value,
    }
    await createNewProduct(newProductData)
}

async function createNewProduct(newProductData) {
    try {
        const result = await fetch(`http://localhost:8080/api/products/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify(newProductData)
        });
        if (result.status == 200) {
            alert(`Producto creado correctamente`);
        } else {
            alert(`Producto no creado, hubo un error`);
        }
    } catch (error) {
        alert(`Error: ${error}`)
    }
}
