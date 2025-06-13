import React, { useState, useEffect } from "react";
import img from './assets/img.jpg';

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
    <header style={{
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    className="h-screen flex items-center justify-center">
      <div className="container">
        <div className="div bg-white">
          <div className="flex gap-1">
            <input
              type="text"
              placeholder="qidiruv"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={getCoordinates}
              className="bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Qidirish
            </button>
          </div>

          <div className="mt-6">
            {loading && <p>Yuklanmoqda...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {forecast.length > 0 && (
              <div className="div2">
                <h2 className="text-xl font-semibold mb-4">
                  {city} uchun 5 kunlik ob-havo
                </h2>
                <ul className="flex space-y-2 max-h-96 overflow-y-auto gap-8">
                  {forecast.map((item) => (
                    <li key={item.dt} className="border-b border-gray-200 pb-2 border">
                      <strong>
                        {new Date(item.dt * 1000).toLocaleDateString()}
                      </strong>
                      : {item.main.temp}°C, {item.weather[0].description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default App;
