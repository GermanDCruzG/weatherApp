import { getWeatherByCity } from "./api.js";
import { renderWeather, renderError, showLoading } from "./ui.js";

const button = document.getElementById("search-btn");
const input = document.getElementById("city-input");

if (!button || !input) {
  console.error("❌ No se encontraron los elementos del DOM");
}

button.addEventListener("click", async () => {
  console.log("🔥 CLICK DETECTADO");

  const city = input.value.trim();
  console.log("🖨️ Ciudad:", city);

  if (!city) {
    alert("Escribe una ciudad");
    return;
  }

  showLoading();

  try {
    const data = await getWeatherByCity(city);
    console.log("✅ DATA RECIBIDA:", data);
    renderWeather(data);
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    renderError(error.message);
  }
});

const toggle = document.getElementById("theme-toggle");

toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggle.textContent = document.body.classList.contains("dark") ? "Modo light" : "Modo oscuro";
});
