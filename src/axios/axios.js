import axios from 'axios'

// Create axios instance for Open-Meteo API
const weatherAPI = axios.create({
  baseURL: 'https://api.open-meteo.com/v1',
  timeout: 10000,
})

// Create axios instance for Geocoding API
const geocodingAPI = axios.create({
  baseURL: 'https://geocoding-api.open-meteo.com/v1',
  timeout: 10000,
})

// Weather API methods
export const weatherService = {
  // Get weather data by coordinates
  async getWeatherData(latitude, longitude) {
    try {
      const response = await weatherAPI.get('/forecast', {
        params: {
          latitude,
          longitude,
          current: 'temperature_2m,relative_humidity_2m,apparent_temperature,surface_pressure,wind_speed_10m,weather_code',
          daily: 'sunrise,sunset,temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code',
          hourly : 'temperature_2m,precipitation,weather_code',
          timezone: 'auto'
        }
      })
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch weather data: ' + error.message)
    }
  },

  // Search location by name
  async searchLocation(query) {
    try {
      const response = await geocodingAPI.get('/search', {
        params: {
          name: query,
          count: 1,
          language: 'en',
          format: 'json'
        }
      })
      
      if (!response.data.results || response.data.results.length === 0) {
        throw new Error('Location not found')
      }
      
      return response.data.results[0]
    } catch (error) {
      throw new Error('Failed to search location: ' + error.message)
    }
  }
}

// Weather code mappings for icons
export const weatherCodes = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Fog', icon: '🌫️' },
  48: { description: 'Depositing rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌦️' },
  53: { description: 'Moderate drizzle', icon: '🌦️' },
  55: { description: 'Dense drizzle', icon: '🌧️' },
  61: { description: 'Slight rain', icon: '🌧️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '🌧️' },
  71: { description: 'Slight snow', icon: '🌨️' },
  73: { description: 'Moderate snow', icon: '❄️' },
  75: { description: 'Heavy snow', icon: '❄️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with hail', icon: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' }
}