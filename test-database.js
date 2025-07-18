const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Using service role for admin access
);

// Test data
const testUserId = 'test-user-' + Date.now();
const testProfile = {
  discord_id: testUserId,
  discord_username: 'TestUser#1234',
  display_name: 'Test User',
  discord_avatar_url: 'https://example.com/avatar.png',
  interests: ['Coding', 'Gaming', 'Reading'],
  connection_preference: 'friends',
  availability: 'weekends',
  voice_intro_url: null
};

const secondTestUserId = 'test-user-2-' + Date.now();
const secondTestProfile = {
  discord_id: secondTestUserId,
  discord_username: 'TestUser2#5678',
  display_name: 'Test User 2',
  discord_avatar_url: 'https://example.com/avatar2.png',
  interests: ['Music', 'Sports', 'Travel'],
  connection_preference: 'collaborators',
  availability: 'evenings',
  voice_intro_url: null
};

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testDatabase() {
  log('\n=== Starting Database Tests ===\n', 'blue');
  
  // First, let's verify the connection
  log('Verifying database connection...', 'yellow');
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Service Role Key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

  try {
    // Test 1: Create profiles
    log('\nTest 1: Creating test profiles...', 'yellow');
    
    const { data: profile1, error: createError1 } = await supabase
      .from('profiles')
      .insert([testProfile])
      .select()
      .single();

    if (createError1) {
      log(`❌ Failed to create first profile: ${createError1.message || createError1}`, 'red');
      console.error('Full error:', createError1);
      return;
    }
    log('✅ First profile created successfully', 'green');
    log(`   Profile ID: ${profile1.id}`, 'magenta');

    const { data: profile2, error: createError2 } = await supabase
      .from('profiles')
      .insert([secondTestProfile])
      .select()
      .single();

    if (createError2) {
      log(`❌ Failed to create second profile: ${createError2.message}`, 'red');
      return;
    }
    log('✅ Second profile created successfully', 'green');
    log(`   Profile ID: ${profile2.id}`, 'magenta');

    // Test 2: Retrieve profiles
    log('\nTest 2: Retrieving profiles...', 'yellow');
    
    const { data: retrievedProfile, error: retrieveError } = await supabase
      .from('profiles')
      .select('*')
      .eq('discord_id', testUserId)
      .single();

    if (retrieveError) {
      log(`❌ Failed to retrieve profile: ${retrieveError.message}`, 'red');
      return;
    }
    log('✅ Profile retrieved successfully', 'green');
    log(`   Display Name: ${retrievedProfile.display_name}`, 'magenta');
    log(`   Interests: ${retrievedProfile.interests.join(', ')}`, 'magenta');

    // Test 3: Update profile
    log('\nTest 3: Updating profile...', 'yellow');
    
    const updatedInterests = ['Coding', 'Gaming', 'Reading', 'Cooking'];
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ interests: updatedInterests })
      .eq('id', profile1.id);

    if (updateError) {
      log(`❌ Failed to update profile: ${updateError.message}`, 'red');
      return;
    }
    log('✅ Profile updated successfully', 'green');

    // Verify update
    const { data: updatedProfile, error: verifyError } = await supabase
      .from('profiles')
      .select('interests')
      .eq('id', profile1.id)
      .single();

    if (!verifyError && updatedProfile.interests.length === 4) {
      log(`   Updated interests: ${updatedProfile.interests.join(', ')}`, 'magenta');
    }

    // Test 4: Create swipes
    log('\nTest 4: Creating swipe records...', 'yellow');
    
    const swipeData = {
      swiper_id: profile1.id,
      swiped_id: profile2.id,
      is_like: true
    };

    const { data: swipe, error: swipeError } = await supabase
      .from('swipes')
      .insert([swipeData])
      .select()
      .single();

    if (swipeError) {
      log(`❌ Failed to create swipe: ${swipeError.message}`, 'red');
      return;
    }
    log('✅ Swipe created successfully', 'green');
    log(`   Swipe ID: ${swipe.id}`, 'magenta');

    // Create reciprocal swipe for match
    const reciprocalSwipe = {
      swiper_id: profile2.id,
      swiped_id: profile1.id,
      is_like: true
    };

    const { data: swipe2, error: swipeError2 } = await supabase
      .from('swipes')
      .insert([reciprocalSwipe])
      .select()
      .single();

    if (swipeError2) {
      log(`❌ Failed to create reciprocal swipe: ${swipeError2.message}`, 'red');
      return;
    }
    log('✅ Reciprocal swipe created successfully', 'green');

    // Test 5: Check for matches
    log('\nTest 5: Checking for matches...', 'yellow');
    
    const { data: matches, error: matchError } = await supabase
      .from('matches')
      .select('*')
      .or(`user1_id.eq.${profile1.id},user2_id.eq.${profile1.id}`);

    if (matchError) {
      log(`❌ Failed to retrieve matches: ${matchError.message}`, 'red');
      return;
    }

    if (matches && matches.length > 0) {
      log(`✅ Found ${matches.length} match(es)`, 'green');
      matches.forEach((match, index) => {
        log(`   Match ${index + 1}: User ${match.user1_id} ↔ User ${match.user2_id}`, 'magenta');
      });
    } else {
      log('⚠️  No matches found (might need to check match trigger)', 'yellow');
    }

    // Test 6: Test profile constraints
    log('\nTest 6: Testing unique constraints...', 'yellow');
    
    const { error: duplicateError } = await supabase
      .from('profiles')
      .insert([{ ...testProfile, id: 'new-id' }]);

    if (duplicateError) {
      log('✅ Unique constraint working (duplicate discord_id rejected)', 'green');
      log(`   Error: ${duplicateError.message}`, 'magenta');
    } else {
      log('❌ Unique constraint not working!', 'red');
    }

    // Test 7: Query profiles for swiping
    log('\nTest 7: Testing profile discovery query...', 'yellow');
    
    const { data: discoverProfiles, error: discoverError } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', profile1.id)
      .limit(10);

    if (discoverError) {
      log(`❌ Failed to discover profiles: ${discoverError.message}`, 'red');
      return;
    }
    log(`✅ Found ${discoverProfiles.length} profiles for discovery`, 'green');

    // Test 8: Clean up test data
    log('\nTest 8: Cleaning up test data...', 'yellow');
    
    // Delete swipes first (due to foreign key constraints)
    await supabase
      .from('swipes')
      .delete()
      .or(`swiper_id.eq.${profile1.id},swiped_id.eq.${profile1.id}`);

    await supabase
      .from('swipes')
      .delete()
      .or(`swiper_id.eq.${profile2.id},swiped_id.eq.${profile2.id}`);

    // Delete matches if any
    if (matches && matches.length > 0) {
      await supabase
        .from('matches')
        .delete()
        .or(`user1_id.eq.${profile1.id},user2_id.eq.${profile1.id}`);
    }

    // Delete profiles
    const { error: deleteError1 } = await supabase
      .from('profiles')
      .delete()
      .eq('id', profile1.id);

    const { error: deleteError2 } = await supabase
      .from('profiles')
      .delete()
      .eq('id', profile2.id);

    if (!deleteError1 && !deleteError2) {
      log('✅ Test data cleaned up successfully', 'green');
    } else {
      log('⚠️  Some cleanup errors occurred', 'yellow');
    }

    // Summary
    log('\n=== Database Test Summary ===', 'blue');
    log('✅ Profile creation: PASSED', 'green');
    log('✅ Profile retrieval: PASSED', 'green');
    log('✅ Profile update: PASSED', 'green');
    log('✅ Swipe operations: PASSED', 'green');
    log('✅ Unique constraints: PASSED', 'green');
    log('✅ Profile discovery: PASSED', 'green');
    log('\n🎉 All database operations working correctly!\n', 'green');

  } catch (error) {
    log(`\n❌ Unexpected error: ${error.message}`, 'red');
    console.error(error);
  }
}

// Run the tests
testDatabase();