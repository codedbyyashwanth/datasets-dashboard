import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function parseCSV(csvText: string): Record<string, unknown>[] {
  const lines = csvText.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
    const row: Record<string, unknown> = {}
    
    headers.forEach((header, index) => {
      const value = values[index] || ''
      // Try to parse as number
      const numValue = parseFloat(value)
      row[header] = !isNaN(numValue) && value !== '' ? numValue : value
    })
    
    return row
  })
}