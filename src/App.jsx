import React, { useState, useEffect } from "react";
import img from "./assets/img.jpg";

function App() {
  const [city, setCity] = useState("Toshkent");
  const [coords, setCoords] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_KEY = "b9b6cc04936d930de780b1049782003c";

  const getCoordinates = () => {
    setLoading(true);
    setError(null);
    setForecast([]);

    fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0) {
          setError("Shahar topilmadi");
          setLoading(false);
          return;
        }
        setCoords({ lat: data[0].lat, lon: data[0].lon });
      })
      .catch(() => {
        setError("Server bilan boglanib bolmadi");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!coords) return;

    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        const dailyAtNoon = data.list.filter((item) =>
          item.dt_txt.includes("12:00:00")
        );
        setForecast(dailyAtNoon);
        setLoading(false);
      })
      .catch(() => {
        setError("xatolik yuz berdi");
        setLoading(false);
      });
  }, [coords]);

  useEffect(() => {
    getCoordinates();
  }, []);

  return (
    <header
  style={{
    backgroundImage: `url(${img})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
  className="h-screen flex items-center justify-center px-4"
>
  <div className="max-w-6xl w-full bg-white/80 backdrop-blur-md rounded-xl p-8 shadow-2xl">
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <input
        type="text"
        placeholder="Shahar nomi..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white"
      />
      <button
        onClick={getCoordinates}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 shadow"
      >
        Qidirish
      </button>
    </div>
    {loading && <p className="text-center text-gray-600">Yuklanmoqda...</p>}
    {error && <p className="text-center text-red-600">{error}</p>}

    {forecast.length > 0 && (
      <>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {city} uchun 5 kunlik ob-havo
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {forecast.map((item) => (
            <div
              key={item.dt}
              className="bg-white rounded-xl p-5 text-center shadow hover:shadow-lg transition"
            >
              <p className="text-lg font-semibold text-gray-800 mb-2">
                {new Date(item.dt * 1000).toLocaleDateString()}
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {item.main.temp.toFixed(1)}°C
              </p>
              <p className="text-sm text-gray-500 capitalize mt-2">
                {item.weather[0].description}
              </p>
            </div>
          ))}
        </div>
      </>
    )}
  </div>
</header>

  );
}

export default App;
