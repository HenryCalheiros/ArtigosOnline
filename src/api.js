const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function apiGet(path, token) {
  const res = await fetch(API_URL + path, {
    headers: { Authorization: "Bearer " + token }
  });
  return res.json();
}

export async function apiPost(path, data, token) {
  const res = await fetch(API_URL + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {})
    },
    body: JSON.stringify(data)
  });

  return res.json();
}

export async function apiPut(path, data, token) {
  const res = await fetch(API_URL + path, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function apiDelete(path, token) {
  const res = await fetch(API_URL + path, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });
  return res.json();
}

export async function apiGetUsers(query, token) {
  const res = await fetch(`${API_URL}/users?q=${query}`, {
    headers: { Authorization: "Bearer " + token }
  });
  return res.json();
}

export async function apiGetUser(id, token) {
  const res = await fetch(`${API_URL}/users/${id}`, {
    headers: { Authorization: "Bearer " + token }
  });
  return res.json();
}