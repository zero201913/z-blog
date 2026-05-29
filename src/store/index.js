import { reactive } from 'vue'

const defaultHue = 340

export const store = reactive({
  darkMode: localStorage.getItem('dark-mode') === 'true',
  hue: parseInt(localStorage.getItem('theme-hue'), 10) || defaultHue,

  setHue(value) {
    this.hue = value
    localStorage.setItem('theme-hue', value)
    document.documentElement.style.setProperty('--hue', value)
  },

  toggleDarkMode() {
    this.darkMode = !this.darkMode
    localStorage.setItem('dark-mode', this.darkMode)
    document.body.classList.toggle('dark-mode', this.darkMode)
    this.setHue(this.hue)
  },

  initTheme() {
    if (this.darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
    document.documentElement.style.setProperty('--hue', this.hue)
  },
})
