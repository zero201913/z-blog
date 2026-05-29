const DOG_EMOJIS = ['🐶', '🐕', '🐩', '🦮', '🐕‍🦺', '🐾']
const GRAVITY = 0.4
const PARTICLE_COUNT = 6

export function useDogExplosion() {
  function explode(e) {
    const x = e.clientX
    const y = e.clientY

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      createParticle(x, y)
    }
  }

  function createParticle(cx, cy) {
    const el = document.createElement('div')
    el.textContent = DOG_EMOJIS[Math.floor(Math.random() * DOG_EMOJIS.length)]
    el.style.cssText = `
      position: fixed;
      left: ${cx}px;
      top: ${cy}px;
      transform: translate(-50%, -50%);
      font-size: ${18 + Math.random() * 14}px;
      pointer-events: none;
      z-index: 99999;
      user-select: none;
      will-change: transform, opacity;
      opacity: 1;
    `
    document.body.appendChild(el)

    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.8
    const speed = 8 + Math.random() * 12
    let vx = Math.cos(angle) * speed
    let vy = Math.sin(angle) * speed
    let posX = cx
    let posY = cy
    let opacity = 1
    let rotation = Math.random() * 360
    const rotSpeed = (Math.random() - 0.5) * 12

    function animate() {
      vy += GRAVITY
      posX += vx
      posY += vy
      opacity -= 0.008
      rotation += rotSpeed

      el.style.left = `${posX}px`
      el.style.top = `${posY}px`
      el.style.opacity = Math.max(opacity, 0)
      el.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`

      if (opacity > 0 && posY < window.innerHeight + 100) {
        requestAnimationFrame(animate)
      } else {
        el.remove()
      }
    }

    requestAnimationFrame(animate)
  }

  function start() {
    document.addEventListener('click', explode)
  }

  function stop() {
    document.removeEventListener('click', explode)
  }

  return { start, stop }
}
