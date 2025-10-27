/**
 * Resize utilities for Zendesk apps
 */

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const resizeApp = (client, padding = 25, delay = 50) => {
  if (!client) return
  
  try {
    // Delay ensures DOM updates are complete before height calculation
    setTimeout(() => {
      const height = document.body.scrollHeight
      client.invoke('resize', { height: `${height + padding}px` })
    }, delay)
  } catch (error) {
    // Silently handle resize errors
  }
}

export const setupResizeListeners = (client, resizeCallback, debounceDelay = 200) => {
  if (!client || !resizeCallback) return () => {}

  const debouncedResize = debounce(resizeCallback, debounceDelay)
  
  window.addEventListener('resize', debouncedResize)
  client.on('app.activated', resizeCallback)

  return () => {
    window.removeEventListener('resize', debouncedResize)
    client.off('app.activated', resizeCallback)
  }
}

export const createResizeFunction = (client) => {
  return () => resizeApp(client)
}