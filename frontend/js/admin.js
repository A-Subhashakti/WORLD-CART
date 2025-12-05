console.log("admin.js loaded");


function getAdmin() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role === "admin") return user;
  } catch {}
  return null;
}

function saveAdmin(user) {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", user.token);
}

function adminLogout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.location = "admin-login.html";
}


async function handleAdminLogin(e) {
  e.preventDefault();

  const email = document.getElementById("adminLoginEmail").value.trim();
  const password = document.getElementById("adminLoginPassword").value;

  try {
    const data = await API.auth.login({ email, password });

    if (data.user.role !== "admin") {
      alert("Not an admin account");
      return;
    }

    saveAdmin({ ...data.user, token: data.token });

    window.location = "add-product.html";

  } catch (err) {
    alert("Login failed");
  }
}


async function handleAdminSignup(e) {
  e.preventDefault();

  const name = document.getElementById("adminSignupName").value.trim();
  const email = document.getElementById("adminSignupEmail").value.trim();
  const password = document.getElementById("adminSignupPassword").value;

  try {
    const data = await API.auth.signup({
      name,
      email,
      password,
      role: "admin",
    });

    saveAdmin({ ...data.user, token: data.token });

    window.location = "add-product.html";

  } catch (err) {
   console.error("ERR:", err);
   alert(err.message);
}

}


async function addProduct(e) {
  e.preventDefault();

  const admin = getAdmin();
  if (!admin) {
    alert("Not authorized");
    window.location = "admin-login.html";
    return;
  }

  const newProduct = {
  name: document.getElementById("pName").value,
  imageUrl: document.getElementById("pImage").value,
  price: document.getElementById("pPrice").value,
  description: document.getElementById("pDesc").value,
};


  try {
    const res = await fetch(`${API_BASE}/admin/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(newProduct),
    });

    if (!res.ok) throw new Error("Failed");

    alert("Product added!");
    document.getElementById("productForm").reset();

  } catch (err) {
    alert("Error adding product");
  }
}
