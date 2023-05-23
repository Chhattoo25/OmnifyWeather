import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/styles.css";
import errorImg from "../images/cloud.png";
import loadingImg from "../images/loading.png";

export const Weather = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {}, []);
  function getLocationData(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=4db79c80a0011b0ac1f770080f67bb2d`;

    fetch(url)
      .then(function (res) {
        return res.json();
      })
      .then(function (res) {
        console.log(res);
        setWeatherData(res);
        setError(false)
      })
      .catch(function (err) {
        console.log(err);
      });
  }
  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleWeatherSearch = async () => {
    try {
      setLoading(true);
      setWeatherData(null);

      const response = await axios.get(
        `https://weatherbackenda.onrender.com/api/getweather?location=${location}`
      );
      setWeatherData(response.data);
      setLocation("");
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  function getLocation() {
    navigator.geolocation.getCurrentPosition(success);

    function success(position) {
      var crd = position.coords;

      console.log("Your current position is:");
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
      console.log(`More or less ${crd.accuracy} meters.`);
      getLocationData(crd.latitude, crd.longitude);
    }
  }

  return (
    <div className="container">
      <div className="inputF">
        <input
          type="search"
          value={location}
          onChange={handleLocationChange}
          onKeyUp={(e) => {
            if (e.keyCode === 13) {
              handleWeatherSearch();
            }
          }}
          placeholder="Enter location"
        />
        <button onClick={getLocation}> Current Location</button>
      </div>

      {loading && (
        <div className="loadingContainer">
          <img src={loadingImg} width="100" height="100" alt="Loading..." />
          <p>Loading...</p>
        </div>
      )}

      {error && (
        <div className="errorContainer">
          <img src={errorImg} width="200" height="200" alt="Error" />
          <h3>No Data Found</h3>
        </div>
      )}

      {weatherData && (
        <div className="WeatherDetail">
          <div className="weatherCard">
            <h2>Weather Information</h2>
            <p className="location">Location: {weatherData.name}</p>
            <p className="temperature">
              Temperature: {weatherData.main.temp}°C
            </p>
            <p className="humidity">Humidity: {weatherData.main.humidity}%</p>
          </div>

          <div className="iframe">
            <iframe
              src={`https://maps.google.com/maps?q=${weatherData.name}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              frameborder="0"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};
