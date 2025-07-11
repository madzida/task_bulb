import { useState } from "react";
import './App.css';

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function App() {
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [weather, setWeather] = useState(null);
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [displayCity, setDisplayCity] = useState("");
  const [displayDate, setDisplayDate] = useState("");

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 4);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setWeather(null);
    setRecommendation("");

    try {
      const response = await fetch("http://localhost:8000/weather", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          city: city.trim(),
          date: date
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || 
                        data.details || 
                        (data.message && typeof data.message === 'string' ? data.message : "An error occurred.");
        throw new Error(errorMsg);
      }

      setWeather(data.weather);
      setRecommendation(data.recommendation);
      setDisplayCity(city.trim());
      setDisplayDate(date);
    } catch (err) {
      let errorMessage = err.message;
      
      if (err.message.includes("Failed to fetch")) {
        errorMessage = "Problem connecting to the server. Check if the backend is running.";
      }
      
      setError(errorMessage);
      console.error("Error details:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="main_container">
      <h1 className="title">Personal Weather Assistant</h1>
      <form onSubmit={handleSubmit}>
      <div className="form_row">
      <label htmlFor="city" className="form_label">City:</label>
      <input
        id="city"
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="select_box"
      />
    </div>
    
    <div className="form_row">
      <label htmlFor="date" className="form_label">Date:</label>
      <input
        id="date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        min={formatDate(today)}
        max={formatDate(maxDate)}
        className="select_box"
      />
    </div>
        
        <button 
          type="submit"
          disabled={loading}
          className="submit_button"
        >
          {loading ? "Loading..." : "Get the weather forecast"}
        </button>
      </form>

      {error && (
        <div className="error_message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {weather && (
        <div className="weather_output">
          <h2>Weather forecast for {displayCity} ({displayDate}):</h2>
          <div className="forecast_grid">
            {weather.map((w, index) => (
              <div className="forecast_item" key={index}>
                <strong>{w.time}</strong><br />
                Temp: {w.temperature}°C<br />
                {w.description}
              </div>
            ))}
          </div>
          
          <h3>Recommendations:</h3>
          <div className="recommendation_box">
            {recommendation}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;