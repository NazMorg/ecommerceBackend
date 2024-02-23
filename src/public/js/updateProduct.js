const updateProductForm = document.getElementById('updateProductForm');
const updateProductId = document.getElementById('updateProductId');
const updateTitle = document.getElementById('updateTitle');
const updateDescription = document.getElementById('updateDescription');
const updateCode = document.getElementById('updateCode');
const updatePrice = document.getElementById('updatePrice');
const updateStock = document.getElementById('updateStock');
const updateCategory = document.getElementById('updateCategory');
const owner = document.getElementById('owner');

updateProductForm.onsubmit = async (e) => {
    e.preventDefault();
    if (updateProductId.value) {
        const updateProductData = {
            title: updateTitle.value,
            description: updateDescription.value,
            code: updateCode.value,
            price: updatePrice.value,
            stock: updateStock.value,
            category: updateCategory.value,
            owner: owner.value,
        }
        await updateProduct(updateProductId.value, updateProductData)
    } else {
        alert("Es necesario proveer el id del producto a actualizar")
    }
}

async function updateProduct(updateProductId, updateProductData) {
    try {
        const result = await fetch(`http://localhost:8080/api/products/${updateProductId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify(updateProductData)
        });
        if (result.status == 200) {
            alert(`Producto actualizado correctamente`);
        } else {
            alert(`No se pudo actualizar el producto`);
        }
    } catch (error) {
        alert(`Error: ${error}`)
    }
}

