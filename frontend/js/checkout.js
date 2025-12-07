async function loadCartItems() {
  const cart = await API.cart.get();

  return cart.items.map(i => ({
    product: i.product._id,
    quantity: i.quantity
  }));
}

document.getElementById("payBtn").addEventListener("click", async () => {

  const fullname = document.getElementById("fullname").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!fullname || !phone || !address) {
    alert("Please fill all fields before proceeding.");
    return;
  }

  try {
    const cart = await API.cart.get();

    if (!cart.items.length) {
      alert("Your cart is empty.");
      return;
    }

    const items = cart.items.map(i => ({
      product: i.product._id,
      quantity: i.quantity
    }));

    const totalAmount = cart.items.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0
    );

    console.log("Creating order:", { fullname, phone, address, items, totalAmount });

    
    const order = await API.orders.create({
      fullname,
      phone,
      address,
      items,
      totalAmount
    });

    console.log("ORDER CREATED:", order);

    window.location = "orderCompleted.html";

  } catch (err) {
    console.error("Checkout Error:", err);
    alert(err.message || "Unable to process order. Try again.");
  }
});

document.getElementById("payCashBtn").addEventListener("click", async () => {

  const fullname = document.getElementById("fullname").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!fullname || !phone || !address) {
    alert("Please fill all fields before proceeding.");
    return;
  }

  try {
    const cart = await API.cart.get();

    if (!cart.items.length) {
      alert("Your cart is empty.");
      return;
    }

    const items = cart.items.map(i => ({
      product: i.product._id,
      quantity: i.quantity
    }));

    const totalAmount = cart.items.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0
    );

    console.log("Creating Cash order:", { fullname, phone, address, items, totalAmount });

    
    const order = await API.orders.create({
      fullname,
      phone,
      address,
      items,
      totalAmount
      
    });

    console.log("CASH ORDER CREATED:", order);
    alert("Order placed successfully! Pay cash on delivery.");
   window.location = "orderCompleted.html";

  } catch (err) {
    console.error("Cash Checkout Error:", err);
    alert(err.message || "Unable to process order. Try again.");
  }
});