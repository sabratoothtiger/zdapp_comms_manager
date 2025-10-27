// Debug configuration - set to true to enable console logging across the app
export const DEBUG = true

// Debug logging utilities
export const log = (...args) => {
  if (DEBUG) {
    console.log(...args)
  }
}

export const logError = (...args) => {
  if (DEBUG) {
    console.error(...args)
  }
}

// Grouped logging for clearer console output
export const logGroupStart = (groupName, ...args) => {
  if (DEBUG) {
    console.log(`╒ ${groupName} Start`, ...args)
  }
}

export const logGroupEnd = (groupName, ...args) => {
  if (DEBUG) {
    console.log(`╘ ${groupName} Finished`, ...args)
  }
}

// Convenience function for auto-grouped operations
export const logGroup = (groupName, operation) => {
  logGroupStart(groupName)
  const result = operation()
  logGroupEnd(groupName)
  return result
}

// Async version for promises
export const logGroupAsync = async (groupName, operation) => {
  logGroupStart(groupName)
  try {
    const result = await operation()
    logGroupEnd(groupName)
    return result
  } catch (error) {
    logError(`╘ ${groupName} Failed:`, error)
    throw error
  }
}