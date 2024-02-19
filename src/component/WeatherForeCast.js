import React, { useEffect, useState } from 'react';
import './WeatherForeCast.css'

const WeatherForeCast = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/weatherforecast');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}, ${response.statusText}`);
      }
      const result = await response.json();
      console.log("-----------line 17 in WFC", result);
      setData(result);
    } catch (error) {
      setError('Error fetching data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Weather Forecast</h1>
      <ul className='WFC'>
        {data.map((item) => (
          <div key={item.date} className='WFC-div'>
            <p>Date: {item.date}</p>
            <p>Temperature: {item.temperatureC}°C</p>
            <p>Summary: {item.summary}</p>
            <p>Temperature (F): {item.temperatureF}°F</p>
          </div >
        ))}
      </ul>
    </div>
  );
};

export default WeatherForeCast;
