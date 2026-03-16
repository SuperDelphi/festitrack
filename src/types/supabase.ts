import type { Database, Tables } from './database.types'

// Aliases for Tables
export type User = Database['public']['Tables']['Users']['Row']
export type UserWithRelations = Database['public']['Tables']['Users']['Row'] & {
    Locations: Database['public']['Tables']['Locations']['Row'] | null
    Roles: Database['public']['Tables']['Roles']['Row'] | null
}
export type Location = Database['public']['Tables']['Locations']['Row']