export function renderWeather(data) {
  const result = document.getElementById("result");
  if (!result) return;

result.innerHTML = `
    <h2>${data.city}, ${data.country}</h2>
    <p>👥 Población: ${data.population?.toLocaleString() ?? "N/D"}</p>
    <p>Fecha: ${data.date}</p>
    <p>🕒 Hora local: ${data.time}</p>
    <p>🌡️ ${data.temperature} °C</p>
    <p>${data.description}</p>
    <p>💨 Viento: ${data.wind} km/h</p>
    <p>💧 Humedad: ${data.humidity} (0-100%)</p>
    <p>🌧️ Precipitación: ${data.precipitation} mm/h</p>
  `;
}

export function renderError(message) {
  const result = document.getElementById("result");
  if (result) result.textContent = `❌ ${message}`;
}

export function showLoading() {
  document.getElementById("result").textContent = "⏳ Buscando información...";
}

export function saveFavorite(city) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.includes(city)) {
    favorites.push(city);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}

export function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}
9