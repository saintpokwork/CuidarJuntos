# Email Branding Plan — CuidarJuntos

## Current State

Supabase default authentication emails are currently used for:
- Account confirmation
- Password reset
- Magic link (if enabled)

These emails use Supabase's built-in templates, which are generic and unbranded.

## Issue

Default Supabase auth emails:
- Have no CuidarJuntos branding (logo, colors, typography)
- Are in English only (no PT/EN templates)
- Look generic and impersonal
- Do not match the app's visual identity

## Planned Solution (DO NOT IMPLEMENT YET)

### Domain Setup
- Buy/connect `cuidarjuntos.pt` domain
- Configure DNS for email sending

### Email Provider
- Use **Resend** or **custom SMTP** for transactional auth emails
- Resend recommended for simplicity and React email template support

### Branded Templates
Create custom email templates for:
- Account confirmation (PT/EN)
- Password reset (PT/EN)
- Email change confirmation (future)

### Design Assets
Use brand assets from `src/assets/brand/`:
- `cuidarjuntos-logo.svg` — main logo
- `cuidarjuntos-icon.svg` — icon
- `cuidarjuntos-app-icon.svg` — app icon
- Brand colors: `#2D6A52` (verde), `#C8623A` (terracota)

### Language Support
- Detect user language preference from `profiles.language`
- Send emails in PT by default, EN if user toggled language
- Templates must support both languages

### Implementation Steps (Future)
1. Set up Resend account and verify domain
2. Create React email templates
3. Configure Supabase Auth hook to use custom SMTP
4. Test all email flows in PT and EN
5. Monitor delivery rates

## Status

**TODO — Do not implement until domain is ready.**