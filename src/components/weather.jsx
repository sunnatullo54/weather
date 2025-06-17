import React, { useState, useEffect } from 'react';

function Weather() {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [city, setCity] = useState('');
  const [coords, setCoords] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);

  const getCoordinates = () => {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setCoords({ lat: data[0].lat, lon: data[0].lon });
          setError(null);
        } else {
          setError('Shahar topilmadi!');
          setForecast(null);
        }
      })
      .catch(() => setError('xatolik yuz berdi!'));
  };

  useEffect(() => {
    if (!coords) return;

    setError(null);
    setForecast(null);

    fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=hourly,minutely,current,alerts&units=metric&appid=${API_KEY}`)
      .then(res => res.json())
      .then(data => setForecast(data))
      .catch(() => setError("xatolik yuz berdi!"));
  }, [coords]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <input
        value={city}
        onChange={e => setCity(e.target.value)}
        placeholder="Shahar nomini kiriting"
        className="border px-3 py-2 rounded mr-2"
      />
      <button onClick={getCoordinates} className="bg-blue-500 text-white px-4 py-2 rounded">
        Qidirish
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {forecast && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">
            {city} uchun 7 kunlik ob-havo
          </h2>
          <ul className="space-y-2">
            {forecast.daily.map(item => {
              const date = new Date(item.dt * 1000).toLocaleDateString();
              return (
                <li key={item.dt} className="border-b pb-2">
                  <strong>{date}</strong>: {item.temp.day}°C, {item.weather[0].description}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Weather;
