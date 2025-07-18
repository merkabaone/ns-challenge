import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database connection test
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('_test')
      .select('*')
      .limit(1)
    
    if (error && error.code === 'PGRST116') {
      // Table doesn't exist, but connection works
      return { success: true, message: 'Database connected successfully!' }
    }
    
    if (error) {
      throw error
    }
    
    return { success: true, message: 'Database connected and tested!', data }
  } catch (error) {
    console.error('Database connection error:', error)
    return { 
      success: false, 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Example database operations
export async function createUser(email: string, name: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([
        { email, name, created_at: new Date().toISOString() }
      ])
      .select()
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error creating user:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function getUsers() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching users:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}