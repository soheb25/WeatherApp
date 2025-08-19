<template>
  <div class="min-h-screen bg-gradient-to-tr from-[#3E3F29] via-[#7D8D86] to-[#BCA88D] p-6">
    <div class="max-w-4xl mx-auto">

      <!-- Header -->
      <header class="text-center mb-10">
        <h1
          class="text-4xl md:text-6xl font-extrabold text-white mb-3 flex items-center justify-center gap-3 drop-shadow-xl">
          <span class="material-icons-outlined text-[3rem] text-[#3E3F29] animate-bounce">wb_sunny</span>
          <span
            class="tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-[#FAF7F3] via-[#F0E4D3] to-[#DCC5B2]">
            Weather Now
          </span>
        </h1>
        <p
          class="text-lg font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#FAF7F3] to-[#DCC5B2]">
          Real-time weather information
        </p>
      </header>

      <!-- Search Section -->
      <div
        class="relative bg-white/30 backdrop-blur-2xl rounded-[2.5rem] p-8 mb-12 border-2 border-cyan-500/30 shadow-2xl">
        <div class="flex flex-col sm:flex-row gap-4 mb-5">
          <div class="flex-1 flex gap-2 relative">
            <input v-model="searchQuery" @input="fetchSuggestions" @keyup.enter="searchLocation" type="text"
              placeholder="Enter city name..."
              class="flex-1 px-5 py-3 rounded-2xl border-0 bg-white/90 text-gray-700 placeholder-gray-400 shadow-md focus:outline-none focus:ring-4 focus:ring-fuchsia-300 transition-all" />
            <button @click="searchLocation" :disabled="loading"
              class="px-6 py-3 cursor-pointer bg-gradient-to-r from-[#3E3F29] via-[#7D8D86] to-[#BCA88D] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-2xl border border-cyan-500/30 transition-all hover:scale-110 shadow-lg focus:outline-none focus:ring-4 focus:ring-fuchsia-300">
              <span v-if="!loading" class="material-icons-outlined text-2xl">search</span>
              <span v-else class="material-icons-outlined text-2xl animate-spin">hourglass_top</span>
            </button>

            <!-- Suggestions Dropdown -->
            <ul v-if="suggestions.length"
              class="absolute z-50 top-full left-0 mt-2 w-full bg-white rounded-xl shadow-lg max-h-56 overflow-y-auto border border-gray-200">
              <li v-for="(city, index) in suggestions" :key="index" @click="selectSuggestion(city)"
                class="px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-700 flex justify-between items-center">
                <span>{{ city.name }}, {{ city.country }}</span>
                <span class="text-sm text-gray-400">{{ city.latitude.toFixed(2) }}, {{ city.longitude.toFixed(2)
                }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- <button
          @click="getCurrentLocation"
          :disabled="loading"
          class="w-full px-4 py-3 cursor-pointer bg-gradient-to-r from-[#3E3F29] via-[#7D8D86] to-[#BCA88D] text-white font-semibold rounded-2xl border border-fuchsia-600/40 transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed shadow-md focus:outline-none focus:ring-4 focus:ring-yellow-200"
        >
          <span class="material-icons-outlined mr-2 text-lg align-middle">my_location</span>
          Use Current Location
        </button> -->
      </div>

      <!-- Error -->
      <!-- <div v-if="error" class="text-white p-5 rounded-2xl mb-6 text-center font-semibold shadow-lg tracking-tight backdrop-blur-sm">
        {{ error }}
      </div> -->

      <!-- Loading -->
      <div v-if="loading" class="text-center text-white py-16">
        <span class="material-icons-outlined text-7xl animate-spin mb-4 text-yellow-200 drop-shadow-lg">autorenew</span>
        <p class="text-2xl tracking-wide font-bold">Loading weather data...</p>
      </div>

      <!-- Weather Data -->
      <div v-if="weatherData && !loading" class="space-y-12">
        <!-- Current Weather -->
        <div
          class="bg-white/90 rounded-[2.5rem] p-10 shadow-[0_8px_32px_0_rgba(31,38,135,0.25)] backdrop-blur-lg border-2 border-yellow-300/50">
          <div class="text-center mb-7">
            <h2 class="text-3xl font-bold text-fuchsia-800 mb-2 flex gap-2 items-center justify-center">
              <span class="material-icons-outlined text-cyan-500">place</span>
              {{ locationName }}
            </h2>
            <p class="text-cyan-600 text-sm">{{ weatherData.latitude }}°, {{ weatherData.longitude }}°</p>
          </div>
          <div class="text-center mb-10">
            <div class="flex items-center justify-center gap-8 mb-2">
              <span class="material-icons-outlined text-8xl text-yellow-400 drop-shadow-xl">{{ currentWeatherIcon
              }}</span>
              <div>
                <span class="text-8xl font-extralight text-fuchsia-600">{{
                  Math.round(weatherData.current.temperature_2m) }}°</span>
                <span class="text-2xl text-cyan-800 ml-1">{{ weatherData.current_units.temperature_2m }}</span>
              </div>
            </div>
            <p class="text-fuchsia-500 text-xl font-medium italic">{{ currentWeatherDescription }}</p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div class="text-center p-5 bg-gradient-to-br from-yellow-200 to-amber-100 rounded-xl shadow">
              <p class="text-xs text-fuchsia-700 mb-1">Feels like</p>
              <p class="text-lg font-extrabold text-fuchsia-600">{{ Math.round(weatherData.current.apparent_temperature)
              }}{{ weatherData.current_units.apparent_temperature }}</p>
            </div>
            <div class="text-center p-5 bg-gradient-to-br from-cyan-100 to-cyan-50 rounded-xl shadow">
              <p class="text-xs text-fuchsia-700 mb-1">Humidity</p>
              <p class="text-lg font-extrabold text-cyan-500">{{ weatherData.current.relative_humidity_2m }}{{
                weatherData.current_units.relative_humidity_2m }}</p>
            </div>
            <div class="text-center p-5 bg-gradient-to-br from-pink-200 to-pink-50 rounded-xl shadow">
              <p class="text-xs text-fuchsia-700 mb-1">Wind Speed</p>
              <p class="text-lg font-extrabold text-amber-700">{{ weatherData.current.wind_speed_10m }} {{
                weatherData.current_units.wind_speed_10m }}</p>
            </div>
            <div class="text-center p-5 bg-gradient-to-br from-fuchsia-100 to-fuchsia-50 rounded-xl shadow">
              <p class="text-xs text-fuchsia-700 mb-1">Pressure</p>
              <p class="text-lg font-extrabold text-fuchsia-600">{{ weatherData.current.surface_pressure }} {{
                weatherData.current_units.surface_pressure }}</p>
            </div>
          </div>
        </div>

        <!-- Sunrise & Sunset Times -->
        <div v-if="weatherData?.daily"
          class="grid grid-cols-2 gap-6 mt-8 bg-white/90 rounded-2xl p-6 shadow-md border border-yellow-300/50 backdrop-blur-md">
          <div class="text-center">
            <span class="material-icons-outlined text-yellow-500 text-4xl mb-2">light_mode</span>
            <p class="text-lg font-semibold text-yellow-700">Sunrise</p>
            <p class="text-md font-medium text-yellow-800">{{ formatTime(weatherData.daily.sunrise[0]) }}</p>
          </div>
          <div class="text-center">
            <span class="material-icons-outlined text-orange-600 text-4xl mb-2">nights_stay</span>
            <p class="text-lg font-semibold text-orange-700">Sunset</p>
            <p class="text-md font-medium text-orange-800">{{ formatTime(weatherData.daily.sunset[1]) }}</p>
          </div>
        </div>

        <!-- Hourly Forecast Carousel -->
        <div v-if="weatherData?.hourly" class="bg-white/90 rounded-2xl p-6 shadow-lg border mt-6 border-cyan-200/60">
          <h3 class="text-xl font-bold text-cyan-800 mb-4 flex gap-2 items-center justify-center">
            <span class="material-icons-outlined text-fuchsia-400">schedule</span>
            Hourly Forecast
          </h3>
          <div class="flex overflow-x-auto gap-4 py-2 scrollbar-thin scrollbar-thumb-cyan-200">
            <div v-for="(hour, i) in limitedHourly" :key="i"
              class="min-w-[95px] flex-shrink-0 bg-gradient-to-br from-yellow-50 to-fuchsia-50 rounded-xl shadow p-3 text-center border border-fuchsia-100">
              <p class="text-xs text-cyan-600 font-medium mb-1">{{ formatHour(hour.time) }}</p>
              <span class="material-icons-outlined text-2xl text-yellow-700 mb-1">{{ getWeatherIcon(hour.weather_code)
              }}</span>
              <div class="text-base font-bold text-fuchsia-800">{{ Math.round(hour.temperature) }}°</div>
              <p class="text-xs text-amber-700">{{ hour.precipitation }}mm</p>
            </div>
          </div>
        </div>

        <!-- Forecast -->
        <div
          class="bg-white/90 rounded-[2.5rem] p-10 shadow-[0_8px_32px_0_rgba(31,38,135,0.18)] backdrop-blur-lg border-2 border-fuchsia-300/40">
          <h3 class="text-2xl font-bold text-cyan-800 mb-7 tracking-wide flex items-center justify-center gap-2">
            <span class="material-icons-outlined text-fuchsia-400">calendar_today</span>
            7-Day Forecast
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            <div v-for="(day, index) in dailyForecast" :key="index"
              class="text-center py-4 bg-gradient-to-br from-white via-cyan-100 to-fuchsia-100 rounded-2xl hover:bg-yellow-50 transition-transform cursor-pointer shadow hover:scale-110">
              <p class="text-xs font-medium text-fuchsia-800 mb-2 uppercase tracking-wider">{{ formatDate(day.date) }}
              </p>
              <span class="material-icons-outlined text-4xl mb-2 text-yellow-600">{{ getWeatherIcon(day.weatherCode)
              }}</span>
              <div class="space-y-1">
                <p class="text-lg font-bold text-cyan-600">{{ Math.round(day.max) }}°</p>
                <p class="text-xs text-pink-600">{{ Math.round(day.min) }}°</p>
                <p class="text-xs text-amber-500">{{ day.precipitation }}mm</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { weatherService, weatherCodes } from '@/axios/axios.js'

export default {
  name: 'WeatherApp',
  data() {
    return {
      weatherData: null,
      locationName: '',
      searchQuery: '',
      suggestions: [],   // NEW: holds search suggestions
      loading: false,
      error: ''
    }
  },
  computed: {
    dailyForecast() {
      if (!this.weatherData?.daily) return []
      return this.weatherData.daily.time.map((date, index) => ({
        date,
        max: this.weatherData.daily.temperature_2m_max[index],
        min: this.weatherData.daily.temperature_2m_min[index],
        precipitation: this.weatherData.daily.precipitation_sum[index] || 0,
        weatherCode: this.weatherData.daily.weather_code[index]
      }))
    },
    currentWeatherIcon() {
      const code = this.weatherData?.current?.weather_code
      return weatherCodes[code]?.icon || 'wb_sunny'
    },
    currentWeatherDescription() {
      const code = this.weatherData?.current?.weather_code
      return weatherCodes[code]?.description || 'Unknown'
    },
    limitedHourly() {
      if (!this.weatherData?.hourly) return [];
      // Adjust "12" for more/less hours
      const arr = [];
      for (let i = 0; i < Math.min(24, this.weatherData.hourly.time.length); i++) {
        arr.push({
          time: this.weatherData.hourly.time[i],
          temperature: this.weatherData.hourly.temperature_2m[i],
          precipitation: this.weatherData.hourly.precipitation[i] || 0,
          weather_code: this.weatherData.hourly.weather_code[i]
        });
      }
      return arr;
    },
  },
  methods: {
    fetchSuggestions() {
      if (this.searchQuery.length < 2) {
        this.suggestions = []
        return
      }
      weatherService.searchLocation(this.searchQuery)
        .then(result => {
          // If API returns single city, wrap into array
          this.suggestions = Array.isArray(result) ? result.slice(0, 5) : [result]
        })
        .catch(() => { this.suggestions = [] })
    },
    selectSuggestion(city) {
      this.searchQuery = city.name
      this.suggestions = []
      this.locationName = `${city.name}, ${city.country}`
      this.fetchWeatherData(city.latitude, city.longitude)
    },
    searchLocation() {
      if (!this.searchQuery.trim()) return
      this.loading = true
      this.error = ''
      weatherService.searchLocation(this.searchQuery)
        .then(location => {
          this.locationName = `${location.name}, ${location.country}`
          return this.fetchWeatherData(location.latitude, location.longitude)
        })
        .catch(err => { this.error = err.message })
        .finally(() => { this.loading = false })
    },
    getCurrentLocation() {
      if (!navigator.geolocation) {
        this.error = 'Geolocation is not supported by this browser'
        return
      }
      this.loading = true
      this.error = ''
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords
          this.locationName = `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`
          this.fetchWeatherData(latitude, longitude).finally(() => { this.loading = false })
        },
        () => {
          this.error = 'Unable to retrieve your location'
          this.loading = false
        }
      )
    },
    fetchWeatherData(lat, lon) {
      return weatherService.getWeatherData(lat, lon)
        .then(data => { this.weatherData = data })
        .catch(err => { this.error = err.message })
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      if (date.toDateString() === today.toDateString()) return 'Today'
      if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    },
    getWeatherIcon(code) {
      return weatherCodes[code]?.icon || 'wb_sunny'
    },
    formatHour(hourStr) {
      const date = new Date(hourStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    formatTime(dateTimeString) {
      if (!dateTimeString) return '';
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
  },
  mounted() {
    if (navigator.geolocation) {
      this.getCurrentLocation()
    } else {
      this.searchQuery = 'London'
      this.searchLocation()
    }
  }
}
</script>
