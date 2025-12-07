
document.addEventListener('DOMContentLoaded', async () => {
  const listEl = document.getElementById('productsList');
  if (!listEl) return;

  const q = new URLSearchParams(location.search).get('q') || '';
  const qInput = document.getElementById('qInput');
  if (qInput) qInput.value = q;

  try {
    const products = await API.products.list(q);

    if (!products || products.length === 0) {
      listEl.innerHTML = '<p class="small">No products found.</p>';
      return;
    }

    listEl.innerHTML = '';

    products.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';

      card.innerHTML = `
        <img src="${p.imageUrl || 'https://via.placeholder.com/800x600?text=Product'}" alt="${p.name}">
        <div class="card-body">
          <div class="flex-between">
            <h4 style="margin:0">${p.name}</h4>
            <div class="small meta">${new Date(p.createdAt).toLocaleDateString()}</div>
          </div>
          <p class="small">${(p.description || '').slice(0, 100)}</p>
          <div class="flex-between" style="margin-top:8px">
            <div class="price">${formatRupee(p.salePrice || p.price)}</div>
            <div>
              <!-- FIXED: View must always go to /product.html?id= -->
              <a class="btn btn-outline" href="product.html?id=${p._id}">View</a>

              <button class="btn btn-primary add-now" data-id="${p._id}">Add</button>
            </div>
          </div>
        </div>
      `;

      listEl.appendChild(card);
    });

    
    listEl.addEventListener('click', async (ev) => {
  if (ev.target && ev.target.matches('.add-now')) {
    const id = ev.target.dataset.id;

    try {
      
      await API.cart.add({ productId: id, quantity: 1 });

      alert('Added to cart');
      window.location = 'cart.html';
    } catch (err) {
      alert(err.message || 'Add failed');

      if (err.message?.toLowerCase().includes('token'))
        window.location = 'login.html';
    }
  }
});


  } catch (err) {
    listEl.innerHTML = `<p class="small">Error: ${err.message || JSON.stringify(err)}</p>`;
  }

  const searchBtnLocal = document.getElementById('searchBtnLocal');
  if (searchBtnLocal)
    searchBtnLocal.addEventListener('click', () => {
      const qv = (qInput.value || '').trim();
      location.search = qv ? '?q=' + encodeURIComponent(qv) : '';
    });
});
