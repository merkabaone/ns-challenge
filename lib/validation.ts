import { z } from 'zod'

// Profile validation schemas
export const profileUpdateSchema = z.object({
  display_name: z.string().min(1).max(50).trim(),
  profile_picture_url: z.string().url().nullable().optional(),
  interests: z.array(z.string()).min(1).max(5),
  connection_preference: z.enum(['Workout (The Burn)', 'Grab a Meal', 'Co-work Session', 'Just Chat']),
  availability: z.enum(['Mornings', 'Lunchtime', 'Afternoons', 'Evenings']),
  voice_intro: z.string().max(1000).optional()
})

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>

// Validation helper
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: true, data: T } | { success: false, error: string } {
  try {
    const validated = schema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: 'Invalid data' }
  }
}