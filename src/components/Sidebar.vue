<template>
  <aside class="sidebar">
    <div class="sidebar__section">
      <h3 class="sidebar__title">关于作者</h3>
      <p class="sidebar__desc">
        MyBlog 是一个专注于优质内容阅读的平台，汇聚各领域优秀作者。
      </p>
    </div>

    <div class="sidebar__section">
      <h3 class="sidebar__title">热门标签</h3>
      <div class="sidebar__tags">
        <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>

    <div class="sidebar__section sidebar__weather">
      <h3 class="sidebar__title">
        今日天气 · {{ weather?.city || '' }}
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
      <div v-else-if="loading" class="weather weather--loading">
        <span>加载天气中...</span>
      </div>
      <div v-else-if="error" class="weather weather--error">
        <span>天气获取失败</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { mockData } from '../data/index.js'

const tags = mockData.tags

const weather = ref(null)
const loading = ref(false)
const error = ref(false)

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

async function fetchWeather() {
  loading.value = true
  error.value = false
  try {
    const res = await fetch('/api/v1/misc/weather?city=上海&lang=zh&extended=true&forecast=true')
    if (!res.ok) throw new Error('Weather fetch failed')
    const data = await res.json()
    weather.value = data
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchWeather)
</script>

<style scoped>
.sidebar__desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
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
</style>
