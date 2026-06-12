# Email Operations — CuidarJuntos

## Current State

Transactional email is active through two paths:

- **Supabase Auth SMTP** sends account confirmation and password reset emails through Resend SMTP.
- **Vercel `/api/send-invite`** sends family invite emails through the Resend HTTP API after a pending invite is created.

Production env required:

```bash
REACT_APP_SUPABASE_URL=
REACT_APP_SUPABASE_ANON_KEY=
REACT_APP_PUBLIC_SITE_URL=https://www.cuidarjuntos.pt
RESEND_API_KEY=
RESEND_FROM_EMAIL=no-reply@cuidarjuntos.pt
```

Do not expose `RESEND_API_KEY` in client code.

## Branded Supabase Auth Templates

Configure templates in Supabase Dashboard → Authentication → Emails.

Templates to keep branded:

- Confirm signup
- Reset password
- Magic link / OTP, if enabled
- Change email address
- Reauthentication, if enabled

Brand direction:

- Product name: CuidarJuntos
- Primary color: `#165c46`
- Background: `#f5efe6`
- Tone: Portuguese first, clear and calm
- Include support email: `contato@cuidarjuntos.pt`

## Family Invite Email

The app-created invite email is sent by `api/send-invite.js`.

Security controls:

- Requires a Supabase bearer session.
- Verifies the sender is an active admin in `care_profile_members`.
- Uses Resend only server-side.
- Keeps copy-link fallback if Resend fails.

## QA Checklist

- Create a new account and confirm the branded confirmation email arrives.
- Trigger password reset and confirm it lands on `/atualizar-password`.
- Create a family invite as admin and confirm the invite email arrives.
- Accept invite with the invited email account.
- Confirm Resend delivery logs show successful sends.
