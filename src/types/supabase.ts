import type { Database } from './database.types'

// Aliases for Tables
export type User = Database['public']['Tables']['Users']['Row']
export type Location = Database['public']['Tables']['Locations']['Row']