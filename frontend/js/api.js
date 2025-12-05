const BASE_URL = "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request(url, method = "GET", body = null) {
  const headers = { "Content-Type": "application/json" };

  const token = getToken();
  if (token) {
    headers["Authorization"] = "Bearer " + token;
    console.log("TOKEN SENT:", token); 
  }

  const options = { method, headers };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(BASE_URL + url, options);
  const json = await res.json();

  if (!res.ok) throw new Error(json.message || "Request failed");

  return json;
}


const get = (url) => request(url, "GET");
const post = (url, body) => request(url, "POST", body);
const del = (url) => request(url, "DELETE");
const put = (url, body) => request(url, "PUT", body);



const API = {
  auth: {
    login: (data) => post("/auth/login", data),
    register: (data) => post("/auth/register", data),
  },
products: {
  getAll: () => get("/products"),
  list: () => get("/products"), 
  get: (id) => get(`/products/${id}`),
  create: (data) => post("/products", data),
}
,

  cart: {
    
    add: (data) => post("/cart/add", data),

    get: () => get("/cart"),

    remove: (id) => del(`/cart/remove/${id}`),

    updateQty: (data) => put("/cart/update", data),
  },


};

window.API = API;
