console.log("auth.js loaded");


function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}


async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  try {
    const data = await API.auth.login({ email, password });

    
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    window.location = "profile.html";
  } catch (err) {
    alert(err.message || "Login failed");
  }
}


async function handleSignup(e) {
  e.preventDefault();

  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  try {
    const data = await API.auth.signup({ name, email, password });

    
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    window.location = "profile.html";
  } catch (err) {
    alert(err.message || "Signup failed");
  }
}


function renderProfile() {
  const root = document.getElementById("profileRoot");
  const user = getCurrentUser();
  if (!root) return;

  if (!user) {
    root.innerHTML = `
      <div class="card center">
        <p class="small">You are not logged in.
          <a href="login.html">Login</a> or
          <a href="signup.html">Sign up</a>
        </p>
      </div>`;
    return;
  }

  root.innerHTML = `
    <div class="card" style="max-width:600px;margin:auto;padding:20px;">
      <h2>My Profile</h2>
      <hr>

      <div class="profile-info">
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Role:</strong> ${user.role || "user"}</p>
        <p><strong>Phone:</strong> ${user.phone || "Not added"}</p>
        <p><strong>Address:</strong> ${user.address || "Not added"}</p>
      </div>

      <div style="margin-top:20px;">
        <a href="edit-profile.html" class="btn btn-primary">Edit Profile</a>
        <button class="btn btn-outline" onclick="logoutUser()">Logout</button>
      </div>
    </div>
  `;
}


function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location = "login.html";
}
