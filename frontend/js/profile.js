console.log("profile.js loaded");

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location = "login.html";
}

function renderProfile() {
  const root = document.getElementById("profileRoot");
  const user = getCurrentUser();

  if (!user) {
    root.innerHTML = `
      <div class="card center">
        <p>You are not logged in.
          <a href="login.html">Login</a> or 
          <a href="signup.html">Sign Up</a>
        </p>
      </div>`;
    return;
  }

  root.innerHTML = `
    <div class="card" style="max-width:600px;margin:auto;">
      <h2>My Profile</h2>
      <hr>
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Role:</strong> ${user.role || "user"}</p>
      <p><strong>Phone:</strong> ${user.phone || "Not added"}</p>
      <p><strong>Address:</strong> ${user.address || "Not added"}</p>

      <h3 style="margin-top:20px;">Update Details</h3>

      <div class="form-row"><input id="profilePhone" type="text" placeholder="Phone number" value="${user.phone || ""}"></div>
      <div class="form-row"><input id="profileAddress" type="text" placeholder="Address" value="${user.address || ""}"></div>

      <button class="btn btn-primary" onclick="updateProfile()">Save Changes</button>
      <button class="btn btn-outline" style="margin-left:6px" onclick="logoutUser()">Logout</button>
    </div>
  `;
}

function updateProfile() {
  const user = getCurrentUser();
  if (!user) return;

  user.phone = document.getElementById("profilePhone").value.trim();
  user.address = document.getElementById("profileAddress").value.trim();

  saveUser(user);

  alert("Profile updated!");
  renderProfile(); 
}

document.addEventListener("DOMContentLoaded", renderProfile);
