
document.addEventListener("DOMContentLoaded", async () => {
  const root = document.getElementById("cartRoot");
  if (!root) return;

  try {
    const cart = await API.cart.get();

    if (!cart || !cart.items || cart.items.length === 0) {
      root.innerHTML = `
        <div class="card">
          <p class="small">Your cart is empty. <a href="products.html">Shop products</a></p>
        </div>`;
      return;
    }

    const container = document.createElement("div");
    container.className = "card";

    let subtotal = 0;

    cart.items.forEach((item) => {
      const p = item.product;
      const qty = item.quantity || 1;

      const line = (p.salePrice || p.price) * qty;
      subtotal += line;

      const itemEl = document.createElement("div");
      itemEl.className = "cart-item";

      itemEl.innerHTML = `
        <img src="${p.imageUrl || "https://via.placeholder.com/200"}" alt="">
        
        <div style="flex:1">
          <strong>${p.name}</strong>
          <div class="small">${(p.description || "").slice(0, 140)}</div>

          <!-- Quantity Controls -->
          <div class="qty-controls" 
               style="margin-top:10px; display:flex; align-items:center; gap:8px">
            <button class="qtyBtn" data-id="${p._id}" data-action="minus">−</button>
            <span class="qtyDisplay">${qty}</span>
            <button class="qtyBtn" data-id="${p._id}" data-action="plus">+</button>
          </div>

          <div class="small" style="margin-top:4px">
            ${formatRupee(p.salePrice || p.price)} x ${qty}
          </div>
        </div>

        <div>
          <button class="btn btn-outline removeBtn" data-id="${p._id}">
            Remove
          </button>
        </div>
      `;

      container.appendChild(itemEl);
    });

    
    const footer = document.createElement("div");
    footer.style.marginTop = "12px";

    footer.innerHTML = `
      <div class="flex-between">
        <div class="small">Subtotal</div>
        <div style="font-weight:700">${formatRupee(subtotal)}</div>
      </div>

      <div style="margin-top:12px">
        <button id="checkoutBtn" class="btn btn-primary">Proceed to Checkout</button>
      </div>
    `;

    container.appendChild(footer);
    root.appendChild(container);

    
    container.addEventListener("click", async (ev) => {
      if (ev.target && ev.target.matches(".removeBtn")) {
        ev.preventDefault();
        const id = ev.target.dataset.id;

        try {
          await API.cart.remove(id);
          location.reload();
        } catch (err) {
          alert(err.message || "Error removing item");
        }
      }
    });

    
    container.addEventListener("click", async (ev) => {
      if (ev.target.matches(".qtyBtn")) {
        const id = ev.target.dataset.id;
        const action = ev.target.dataset.action;

        let quantity = Number(
          ev.target.parentElement.querySelector(".qtyDisplay").innerText
        );

        if (action === "plus") quantity++;
        if (action === "minus" && quantity > 1) quantity--;

        try {
          await API.cart.update({ productId: id, quantity });

          
          ev.target.parentElement.querySelector(".qtyDisplay").innerText = quantity;

          location.reload();
        } catch (err) {
          alert("Error updating quantity");
        }
      }
    });

    
    document.getElementById("checkoutBtn")
            .addEventListener("click", () => (window.location = "checkout.html"));

  } catch (err) {
    root.innerHTML = `
      <div class="card"><p class="small">
        Please login to see cart or error: ${err.message || ""}
      </p></div>
    `;
  }
});
