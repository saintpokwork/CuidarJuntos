const { createClient } = require('@supabase/supabase-js');
const { json, requireSupabaseUser } = require('./_server-utils');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed.' });
  }

  const auth = await requireSupabaseUser(req);
  if (auth.error) return json(res, auth.status, { error: auth.error });

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return json(res, 500, { error: 'Care profile service is not configured.' });
  }

  const admin = createClient(auth.supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: memberships, error: membershipLookupError } = await admin
    .from('care_profile_members')
    .select('care_profile_id')
    .eq('user_id', auth.user.id)
    .eq('status', 'active')
    .limit(1);

  if (membershipLookupError) {
    console.error('[ensure-care-profile] membership lookup failed:', membershipLookupError);
    return json(res, 500, { error: 'Could not load care profile membership.' });
  }

  const existingId = memberships?.[0]?.care_profile_id;
  if (existingId) {
    return json(res, 200, { careProfileId: existingId, created: false });
  }

  const { data: profile, error: profileError } = await admin
    .from('care_profiles')
    .insert({
      full_name: 'Familiar cuidado',
      created_by: auth.user.id,
      date_of_birth: null,
      address: null,
      sns_number: null,
      allergies: null,
      conditions: null,
      doctor_name: null,
      pharmacy_name: null,
      notes: null,
    })
    .select('id')
    .single();

  if (profileError || !profile) {
    console.error('[ensure-care-profile] profile creation failed:', profileError);
    return json(res, 500, { error: 'Could not create care profile.' });
  }

  const { error: memberError } = await admin.from('care_profile_members').insert({
    care_profile_id: profile.id,
    user_id: auth.user.id,
    role: 'admin',
    status: 'active',
  });

  if (memberError) {
    console.error('[ensure-care-profile] membership creation failed:', memberError);
    await admin.from('care_profiles').delete().eq('id', profile.id);
    return json(res, 500, { error: 'Could not create care profile membership.' });
  }

  return json(res, 200, { careProfileId: profile.id, created: true });
};
