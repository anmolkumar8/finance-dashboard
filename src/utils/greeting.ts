export function greetingForTime(date = new Date()): string {
  const h = date.getHours()
  if (h < 5) return 'Hello'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export function displayGreetingName(displayName: string): string {
  const t = displayName.trim()
  if (!t) return 'there'
  return t.split(/\s+/)[0] ?? 'there'
}
