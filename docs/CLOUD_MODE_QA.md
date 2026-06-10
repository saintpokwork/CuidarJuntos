# Cloud Mode QA Checklist — CuidarJuntos

## A) Logged-out Demo Mode

| # | Test | Expected Result |
|---|---|---|
| 1 | Open app in incognito | No Supabase auth session |
| 2 | Go to `/dashboard` | Demo banner visible |
| 3 | Add medication | Appears in UI |
| 4 | Add task | Appears in UI |
| 5 | Refresh page | Data persists via localStorage |
| 6 | Sign-in and Create Account links visible | Both present in banner |
| 7 | Desktop sidebar shows avatar + caregiver name | Logged-out user card |
| 8 | PT/EN toggle works | Language changes correctly |
| 9 | Mobile bottom nav works | Navigation functional |
| 10 | Definicoes shows demo mode info | Local storage message |

## B) Signup / Login

| # | Test | Expected Result |
|---|---|---|
| 1 | Click Criar Conta | Sign up page loads |
| 2 | Create account | Redirected to dashboard |
| 3 | Confirm email if required | Account confirmed |
| 4 | Login with Entrar | Redirected to dashboard |
| 5 | Dashboard shows cloud sync active | Cloud sync banner |
| 6 | Sidebar shows email + sign-out | User card with email |
| 7 | Definicoes shows cloud mode | Cloud sync active info |

## C) Cloud Data CRUD

| # | Test | Expected Result |
|---|---|---|
| 1 | Add medication | Written to Supabase |
| 2 | Update medication | Updated in Supabase |
| 3 | Delete medication | Removed from Supabase |
| 4 | Add appointment | Written to Supabase |
| 5 | Update appointment | Updated in Supabase |
| 6 | Delete appointment | Removed from Supabase |
| 7 | Add task | Written to Supabase |
| 8 | Update task status | Status mapped correctly (por_fazer=todo, em_progresso=in_progress, concluido=done) |
| 9 | Delete task | Removed from Supabase |
| 10 | Add care note | Written to Supabase |
| 11 | Delete care note | Removed from Supabase |
| 12 | Add emergency contact | Written to Supabase |
| 13 | Delete emergency contact | Removed from Supabase |
| 14 | Update care profile | Updated in Supabase |
| 15 | Add document metadata | Written to Supabase |

## D) Persistence

| # | Test | Expected Result |
|---|---|---|
| 1 | Refresh page while logged in | Cloud data persists |
| 2 | Logout | Demo mode returns with localStorage data |
| 3 | Login again | Cloud data returns from Supabase |
| 4 | Toggle PT/EN while in cloud mode | Language works, data preserved |

## E) Supabase Table Checks

Verify rows exist in Supabase dashboard after first login:

| Table | Expected |
|---|---|
| profiles | 1 row with user ID |
| care_profiles | 1 row (Maria Fernandes default) |
| care_profile_members | 1 row (user as admin) |
| medications | 3 rows (Metformina, Aspirina, Losartan) |
| appointments | 1 row (Consulta de cardiologia) |
| tasks | 2 rows (Comprar gaze, Marcar oftalmologia) |
| care_notes | 1 row (tensao arterial note) |
| emergency_contacts | 2 rows (Dr. Roberto, Ana Silva) |
| documents | 1 row (Analises_Julho_2024.pdf metadata) |

## F) RLS Sanity Checks

| # | Test | Expected Result |
|---|---|---|
| 1 | User A queries care_profiles | Sees only own profiles |
| 2 | User B queries care_profiles | Does NOT see User A data |
| 3 | Anonymous user queries medications | Gets empty or error (RLS blocks) |
| 4 | Check Supabase RLS policies enabled | All tables have RLS enabled |

## G) Error Handling

| # | Test | Expected Result |
|---|---|---|
| 1 | Disconnect network, try to add medication | Friendly error shown, no crash |
| 2 | Reconnect, try again | Operation succeeds |
| 3 | Check console for errors | Full error logged, not shown to user |