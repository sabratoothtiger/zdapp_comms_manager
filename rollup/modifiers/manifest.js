const JS_INDENT = 2

export function changeLocation(content, filename) {
  const manifest = JSON.parse(content)

  // For local Zendesk apps, just pass through the manifest as-is
  // The URL should already be set to "assets/index.html" in the source

  const manifestOutput = {
    _warning: `AUTOMATICALLY GENERATED FROM $/src/${filename} - DO NOT MODIFY THIS FILE DIRECTLY`,
    ...manifest
  }

  return JSON.stringify(manifestOutput, null, JS_INDENT)
}
