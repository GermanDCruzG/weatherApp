function getWeatherDescription(code) {
  const map = {
    0: "☀️ Despejado",
    1: "🌤️ Mayormente despejado",
    2: "⛅ Parcialmente nublado",
    3: "☁️ Nublado",
    45: "🌫️ Niebla",
    48: "🌫️🌫️ Niebla densa",
    51: "🌧️ Llovizna ligera",
    53: "🌧️ Llovizna moderada",
    55: "🌧️🌧️ Llovizna intensa",
    61: "🌧️ Lluvia ligera",
    63: "🌧️ Lluvia moderada",
    65: "🌧️🌧️ Lluvia intensa",
    71: "❄️ Nieve ligera",
    73: "❄️ Nieve moderada",
    75: "❄️❄️ Nieve intensa",
    80: "🌦️ Lluvia de chubascos ligera",
    95: "⛈️ Tormenta",
    99: "⛈️⛈️ Tormenta fuerte"
  }  
  return map[code] || "Clima desconocido";
}
export async function getWeatherByCity(cityName) {
  if (!cityName || typeof cityName !== "string") {
    throw new Error("Nombre de ciudad inválido");
  }

  if (cityName.trim().length < 3) {
    throw new Error("Escribe al menos 3 letras");
  }

  // 🌍 1. Geocoding
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=es`
  );

  if (!geoRes.ok) throw new Error("Error en geocodificación");

  const geoData = await geoRes.json();
  if (!geoData.results?.length) throw new Error("Ciudad no encontrada");

  const {
    latitude,
    longitude,
    name,
    country,
    population,
    temperature,
    wind,
    description,
    humidity,
    precipitation,
    timezone
  } = geoData.results[0];

  // 🌦️ 2. Clima
  const weatherRes = await fetch(
    // `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&weathercode&timezone=${encodeURIComponent(timezone)}`
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m,precipitation,windspeed_10m,weathercode&timezone=${encodeURIComponent(timezone)}`
    
  );

  const weatherData = await weatherRes.json();
  const hourly = weatherData.hourly;

  const dateFormatter = new Intl.DateTimeFormat("es-ES", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const timeFormatter = new Intl.DateTimeFormat("es-ES", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const date = dateFormatter.format(new Date());
  const time = timeFormatter.format(new Date());

  return {
    city: name,
    country,
    population,
    temperature: weatherData.current_weather.temperature,
    wind: weatherData.current_weather.windspeed,
    date,
    time,
    description: getWeatherDescription(weatherData.current_weather.weathercode),
    humidity: hourly?.relativehumidity_2m?.[0] ?? null,
    precipitation: hourly?.precipitation?.[0] ?? null
  };

}
