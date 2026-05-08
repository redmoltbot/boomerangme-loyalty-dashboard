export function formatPhone(phone: string): string {
  if (!phone) return '—'
  const cleaned = phone.replace(/\s/g, '')
  if (cleaned.startsWith('+65') && cleaned.length === 11) {
    return `+65 ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`
  }
  return phone
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('65') && digits.length === 10) return `+${digits}`
  if (digits.length === 8) return `+65${digits}`
  return phone.startsWith('+') ? phone : `+${digits}`
}
