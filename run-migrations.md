# Running Database Migrations

To apply the database migrations and test the database functionality:

## Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/hfryneedsfosssgylhcz
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/003_create_friender_tables.sql`
4. Click "Run" to execute the migration
5. You should see a success message

## Option 2: Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your project
supabase link --project-ref hfryneedsfosssgylhcz

# Run migrations
supabase db push
```

## Testing the Database

After running the migration, test the database:

```bash
# Run the test script
node test-database.js
```

You should see output like:
- ✅ Profile creation: PASSED
- ✅ Profile retrieval: PASSED
- ✅ Profile update: PASSED
- ✅ Like operations: PASSED
- ✅ Match creation: PASSED

## Troubleshooting

If you encounter issues:

1. **Table already exists error**: The migration includes DROP TABLE statements, but if you get errors, you may need to manually drop the tables first
2. **Permission errors**: Make sure you're using the service role key for administrative operations
3. **Connection errors**: Verify your `.env.local` file has the correct Supabase URL and keys

## Important Notes

- The migration will DROP and recreate the tables, so any existing data will be lost
- The automatic match creation trigger will create matches when two users like each other
- Row Level Security is enabled to protect user data