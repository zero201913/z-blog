<template>
  <aside class="sidebar">
    <div class="sidebar__section">
      <h3 class="sidebar__title">每日一言</h3>
      <p v-if="saying" class="sidebar__saying">
        “{{ saying.text }}”
      </p>
      <p v-else-if="sayingLoading" class="sidebar__saying sidebar__saying--loading">
        获取中...
      </p>
    </div>

    <div class="sidebar__section">
      <h3 class="sidebar__title">热门标签</h3>
      <div class="sidebar__tags">
        <span class="tag tag--all" @click="navigateToAll">全部</span>
        <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>

    <div class="sidebar__section sidebar__location">
      <h3 class="sidebar__title">我的位置</h3>
      <div v-if="ipInfo" class="location">
        <div class="location__item">
          <span class="location__icon">🌐</span>
          <span class="location__label">IP 地址</span>
          <span class="location__value">{{ ipInfo.ip }}</span>
        </div>
        <div class="location__item">
          <span class="location__icon">📍</span>
          <span class="location__label">位置</span>
          <span class="location__value">{{ ipInfo.region }}</span>
        </div>
        <div class="location__item">
          <span class="location__icon">🏢</span>
          <span class="location__label">运营商</span>
          <span class="location__value">{{ ipInfo.isp }}</span>
        </div>
      </div>
      <div v-else-if="ipLoading" class="location location--loading">
        <span>检测位置中...</span>
      </div>
    </div>

    <div class="sidebar__section sidebar__weather">
      <h3 class="sidebar__title">
        今日天气 · {{ weather?.city || (ipInfo ? extractCity(ipInfo.region) : '') }}
      </h3>
      <div v-if="weather" class="weather">
        <div class="weather__main">
          <span class="weather__emoji">{{ weatherEmoji }}</span>
          <div class="weather__main-info">
            <span class="weather__temp">{{ weather.temperature }}°</span>
            <span class="weather__desc">{{ weather.weather }}</span>
            <span class="weather__feels">体感 {{ weather.feels_like }}°</span>
          </div>
          <div v-if="weather.temp_max" class="weather__range">
            <span class="weather__range-high">{{ weather.temp_max }}°</span>
            <span class="weather__range-sep">/</span>
            <span class="weather__range-low">{{ weather.temp_min }}°</span>
          </div>
        </div>

        <div class="weather__details">
          <div class="weather__detail-item">
            <span class="weather__detail-icon">💨</span>
            <span class="weather__detail-label">风力</span>
            <span class="weather__detail-value">{{ weather.wind_direction }} {{ weather.wind_power }}</span>
          </div>
          <div class="weather__detail-item">
            <span class="weather__detail-icon">💧</span>
            <span class="weather__detail-label">湿度</span>
            <span class="weather__detail-value">{{ weather.humidity }}%</span>
          </div>
          <div class="weather__detail-item">
            <span class="weather__detail-icon">👁️</span>
            <span class="weather__detail-label">能见度</span>
            <span class="weather__detail-value">{{ weather.visibility }}km</span>
          </div>
          <div class="weather__detail-item">
            <span class="weather__detail-icon">☀️</span>
            <span class="weather__detail-label">紫外线</span>
            <span class="weather__detail-value">{{ uvText }}</span>
          </div>
          <div v-if="weather.aqi" class="weather__detail-item">
            <span class="weather__detail-icon">🌬️</span>
            <span class="weather__detail-label">空气质量</span>
            <span class="weather__detail-value">{{ weather.aqi }} {{ weather.aqi_category }}</span>
          </div>
          <div class="weather__detail-item">
            <span class="weather__detail-icon">📊</span>
            <span class="weather__detail-label">气压</span>
            <span class="weather__detail-value">{{ weather.pressure }}hPa</span>
          </div>
        </div>

        <div v-if="weather.forecast && weather.forecast.length" class="weather__forecast">
          <div
            v-for="day in forecastDays"
            :key="day.date"
            class="weather__forecast-day"
          >
            <span class="weather__forecast-week">{{ day.week }}</span>
            <span class="weather__forecast-emoji">{{ forecastEmoji(day) }}</span>
            <div class="weather__forecast-temps">
              <span class="weather__forecast-high">{{ day.temp_max }}°</span>
              <span class="weather__forecast-low">{{ day.temp_min }}°</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="weatherLoading" class="weather weather--loading">
        <span>加载天气中...</span>
      </div>
      <div v-else-if="weatherError" class="weather weather--error">
        <span>天气获取失败</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { mockData } from '../data/index.js'

const router = useRouter()

const tags = mockData.tags

function navigateToAll() {
  router.push('/all')
}

const ipInfo = ref(null)
const ipLoading = ref(false)

const weather = ref(null)
const weatherLoading = ref(false)
const weatherError = ref(false)

const saying = ref(null)
const sayingLoading = ref(false)

function getTodayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function loadFromCache(key) {
  try {
    const cacheStr = localStorage.getItem(`sidebar_cache_${key}`)
    const dateStr = localStorage.getItem(`sidebar_cache_${key}_date`)
    if (cacheStr && dateStr === getTodayStr()) {
      return JSON.parse(cacheStr)
    }
  } catch {
    /* ignore */
  }
  return null
}

function saveToCache(key, data) {
  try {
    localStorage.setItem(`sidebar_cache_${key}`, JSON.stringify(data))
    localStorage.setItem(`sidebar_cache_${key}_date`, getTodayStr())
  } catch {
    /* ignore */
  }
}

const weatherEmojiMap = {
  '晴': '☀️',
  '晴间多云': '🌤️',
  '多云': '⛅',
  '阴': '☁️',
  '小雨': '🌦️',
  '中雨': '🌧️',
  '大雨': '🌧️',
  '暴雨': '🌊',
  '雷阵雨': '⛈️',
  '小雪': '🌨️',
  '中雪': '❄️',
  '大雪': '❄️',
  '暴雪': '❄️',
  '雨夹雪': '🌨️',
  '雾': '🌫️',
  '霾': '🌫️',
  '沙尘': '💨',
  '大风': '💨',
  '浮尘': '🌫️',
  '扬沙': '💨',
  '强对流': '⛈️',
}

const weatherEmoji = computed(() => {
  if (!weather.value) return '🌈'
  const w = weather.value.weather
  for (const [key, emoji] of Object.entries(weatherEmojiMap)) {
    if (w.includes(key)) return emoji
  }
  return '🌈'
})

const uvText = computed(() => {
  if (!weather.value || weather.value.uv == null) return '--'
  const uv = weather.value.uv
  if (uv <= 2) return `${uv} 低`
  if (uv <= 5) return `${uv} 中等`
  if (uv <= 7) return `${uv} 高`
  if (uv <= 10) return `${uv} 很高`
  return `${uv} 极高`
})

const forecastDays = computed(() => {
  if (!weather.value?.forecast) return []
  return weather.value.forecast.slice(0, 5)
})

function forecastEmoji(day) {
  const w = day.weather_day || day.weather_night || ''
  for (const [key, emoji] of Object.entries(weatherEmojiMap)) {
    if (w.includes(key)) return emoji
  }
  return '🌈'
}

function extractCity(region) {
  if (!region) return ''
  const parts = region.split(' ')
  const last = parts[parts.length - 1] || ''
  return last.replace(/[市县]$/, '')
}

async function fetchIpInfo() {
  const cached = loadFromCache('ip')
  if (cached) {
    ipInfo.value = cached
    return cached
  }

  ipLoading.value = true
  try {
    const res = await fetch('/api/v1/network/myip')
    if (!res.ok) throw new Error('IP fetch failed')
    const data = await res.json()
    ipInfo.value = data
    saveToCache('ip', data)
    return data
  } catch {
    return null
  } finally {
    ipLoading.value = false
  }
}

async function fetchWeather(city) {
  const cached = loadFromCache('weather')
  if (cached) {
    weather.value = cached
    return
  }

  weatherLoading.value = true
  weatherError.value = false
  try {
    const cityName = city || '上海'
    const res = await fetch(`/api/v1/misc/weather?city=${encodeURIComponent(cityName)}&lang=zh&extended=true&forecast=true`)
    if (!res.ok) throw new Error('Weather fetch failed')
    const data = await res.json()
    weather.value = data
    saveToCache('weather', data)
  } catch {
    weatherError.value = true
  } finally {
    weatherLoading.value = false
  }
}

async function fetchSaying() {
  const cached = loadFromCache('saying')
  if (cached) {
    saying.value = cached
    return
  }

  sayingLoading.value = true
  try {
    const res = await fetch('/api/v1/saying')
    if (!res.ok) throw new Error('Saying fetch failed')
    const data = await res.json()
    saying.value = data
    saveToCache('saying', data)
  } catch {
    /* ignore */
  } finally {
    sayingLoading.value = false
  }
}

async function init() {
  fetchSaying()
  const ipData = await fetchIpInfo()
  const city = ipData ? extractCity(ipData.region) : '上海'
  fetchWeather(city)
}

onMounted(init)
</script>

<style scoped>
.sidebar__saying {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  font-style: italic;
}

.sidebar__saying--loading {
  color: var(--color-text-muted);
  font-style: normal;
}

.tag--all {
  background-color: var(--color-primary);
  color: var(--color-text-on-primary);
  font-weight: var(--font-weight-semibold);
}

.tag--all:hover {
  background-color: var(--color-primary-hover);
  color: var(--color-text-on-primary);
}

.weather {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.weather--loading,
.weather--error {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  text-align: center;
  padding: var(--space-4) 0;
}

.weather__main {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.weather__emoji {
  font-size: 44px;
  line-height: 1;
}

.weather__main-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.weather__temp {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  line-height: 1.1;
}

.weather__desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.weather__feels {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.weather__range {
  display: flex;
  align-items: center;
  gap: 2px;
  align-self: flex-start;
  padding-top: 2px;
}

.weather__range-high {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.weather__range-sep {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.weather__range-low {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

.weather__details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
  padding: var(--space-3);
  background: var(--color-neutral-100);
  border-radius: var(--radius-lg);
}

.weather__detail-item {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-xs);
}

.weather__detail-icon {
  font-size: 14px;
  flex-shrink: 0;
}

.weather__detail-label {
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.weather__detail-value {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.weather__forecast {
  display: flex;
  justify-content: space-between;
  gap: var(--space-1);
  padding-top: var(--space-2);
  border-top: 1px solid var(--color-border);
}

.weather__forecast-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.weather__forecast-week {
  font-size: 11px;
  color: var(--color-text-muted);
}

.weather__forecast-emoji {
  font-size: 20px;
  line-height: 1;
}

.weather__forecast-temps {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 11px;
}

.weather__forecast-high {
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.weather__forecast-low {
  color: var(--color-text-muted);
}

.location {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.location--loading {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  text-align: center;
  padding: var(--space-2) 0;
}

.location__item {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-sm);
}

.location__icon {
  font-size: 14px;
  flex-shrink: 0;
}

.location__label {
  color: var(--color-text-muted);
  flex-shrink: 0;
  min-width: 48px;
}

.location__value {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
