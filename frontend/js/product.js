

document.addEventListener("DOMContentLoaded", async () => {
  const root = document.getElementById("productRoot");
  if (!root) return;

  const id = new URLSearchParams(location.search).get("id");

  if (!id) {
    root.innerHTML = `<p class="small">Product ID missing</p>`;
    return;
  }

  try {
    
    const p = await API.products.get(id);

    root.innerHTML = `
      <div class="card product-details">
        
        <!-- LEFT SIDE IMAGE -->
        <div>
          <img 
            src="${p.imageUrl || "https://via.placeholder.com/900x600?text=Product"}"
            style="width:100%;height:var(--max-img-height);object-fit:cover;border-radius:8px"
          />
        </div>

        <!-- RIGHT SIDE DETAILS -->
        <div>
          <h2>${p.name}</h2>

          <div class="small meta">
            Added ${new Date(p.createdAt).toLocaleDateString()}
          </div>

          <p style="margin-top:12px">${p.description || ""}</p>

          <div style="margin-top:14px" class="flex-between">
            <div class="price">
              ${formatRupee(p.salePrice || p.price)}
            </div>
            <div class="small">Stock: Available</div>
          </div>

          <!-- Quantity + Buttons -->
          <div style="margin-top:14px;display:flex;gap:8px;align-items:center">
            <input 
              id="qtyInput" 
              type="number" 
              value="1" 
              min="1"
              style="width:80px;padding:8px;border-radius:8px;border:1px solid #e6e9ee"
            >
            
            <button id="addCart" class="btn btn-primary">Add to Cart</button>
            <button id="buyNow" class="btn btn-success">Buy Now</button>
          </div>
        </div>

      </div>
    `;

    
    document.getElementById("addCart").addEventListener("click", async () => {
      const qty = Number(document.getElementById("qtyInput").value) || 1;

      try {
        await API.cart.add({
          productId: id,
          quantity: qty
        });

        window.location = "cart.html";
      } catch (err) {
        alert(err.message || "Error adding to cart");
      }
    });

    
    document.getElementById("buyNow").addEventListener("click", async () => {
      const qty = Number(document.getElementById("qtyInput").value) || 1;

      try {
        await API.cart.add({
          productId: id,
          quantity: qty
        });

        window.location = "checkout.html";
      } catch (err) {
        alert(err.message || "Error");
      }
    });

  } catch (err) {
    root.innerHTML = `
      <p class="small">Error loading product: ${err.message}</p>
    `;
  }
});
