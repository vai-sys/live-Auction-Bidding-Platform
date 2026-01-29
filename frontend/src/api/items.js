import api from "./axios";

export async function fetchItems() {
  const res = await api.get("/items");
  return res.data;
}

export async function getServerTime() {
  const res = await api.get("/server-time");
  return res.data.serverTime;
}
