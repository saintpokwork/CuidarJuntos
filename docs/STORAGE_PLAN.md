# Supabase Storage Plan — CuidarJuntos

## Current Status

✅ Storage SQL prepared — `supabase/storage.sql`
✅ Frontend upload/download/delete UI implemented in `/dashboard/documentos`

The Supabase Storage infrastructure is active. The SQL creates a private bucket with RLS policies scoped by care profile membership, and the app uploads PDF/JPG/PNG files through the Supabase client.

---

## Bucket Configuration

| Setting | Value |
|---|---|
| **Name** | `care-documents` |
| **Visibility** | Private (`public = false`) |
| **Max file size** | 5 MB per file |
| **Allowed MIME types** | `application/pdf`, `image/jpeg`, `image/png` |

---

## Privacy Model

- The bucket is **private** — no public URLs.
- Files are only accessible to **authenticated users** who are **active members** of the related care profile.
- Access is controlled via Supabase Storage RLS policies on `storage.objects`.
- The care profile ID is extracted from the file path using a helper function.

### Access Rules

| Operation | Who can do it |
|---|---|
| **Read (SELECT)** | Any active care profile member (admin, family, caregiver, viewer) |
| **Upload (INSERT)** | Admin, family, or caregiver of the care profile |
| **Update (UPDATE)** | Admin, family, or caregiver of the care profile |
| **Delete (DELETE)** | Admin only |

---

## Path Convention

```
care-profiles/{care_profile_id}/{document_id}/{safe_filename}
```

### Examples

```
care-profiles/123e4567-e89b-12d3-a456-426614174000/abc123/receita.pdf
care-profiles/123e4567-e89b-12d3-a456-426614174000/def456/analises_julho.jpg
```

### Path Components

| Segment | Description |
|---|---|
| `care-profiles` | Fixed prefix |
| `{care_profile_id}` | UUID of the care profile |
| `{document_id}` | UUID of the document record in the `documents` table |
| `{safe_filename}` | Sanitised filename (no special characters) |

---

## Helper Function

### `public.storage_care_profile_id(object_name text)`

Extracts the care profile UUID from a storage object path.

- **Input:** `care-profiles/123e4567-e89b-12d3-a456-426614174000/abc123/receita.pdf`
- **Output:** `123e4567-e89b-12d3-a456-426614174000` (uuid)
- **Returns NULL** if the path is invalid, too short, doesn't start with `care-profiles`, or the second segment is not a valid UUID.
- **Does not throw** on bad paths.

This function is used by all storage policies to enforce care-profile-scoped access.

---

## Storage Policies

The following RLS policies are created on `storage.objects`:

1. **"Care profile members can read files"** — SELECT, authenticated
2. **"Care profile members can upload files"** — INSERT, authenticated (admin/family/caregiver)
3. **"Care profile members can update files"** — UPDATE, authenticated (admin/family/caregiver)
4. **"Care profile admins can delete files"** — DELETE, authenticated (admin only)

All policies:
- Scope to `bucket_id = 'care-documents'`
- Extract `care_profile_id` from the object path via `storage_care_profile_id()`
- Use existing helper functions: `is_care_profile_member()`, `get_care_profile_role()`, `is_care_profile_admin()`
- Handle NULL safely (invalid paths return NULL, policies deny access)

---

## Frontend Upload Flow

1. User selects a file on `/dashboard/documentos`.
2. Frontend validates file type (PDF, JPG, PNG) and size (≤ 5MB).
3. Frontend creates a `documents` table record (metadata) via the Supabase adapter.
4. Frontend uploads the file to Supabase Storage:
   ```typescript
   const filePath = `care-profiles/${careProfileId}/${documentId}/${safeFilename}`;
   const { data, error } = await supabase.storage
     .from('care-documents')
     .upload(filePath, file, {
       contentType: file.type,
       upsert: false,
     });
   ```
5. Frontend updates the `documents` record with `file_path` and `file_name`.
6. Opening a document creates a signed URL.
7. Deleting a document removes the storage object and metadata.

---

## Known Limitations

1. **5MB limit per file** — Enforced at bucket level. Can be increased later if needed.
2. **No image thumbnails** — Future enhancement.
3. **No virus scanning** — Future enhancement (e.g., Supabase + ClamAV or third-party).
4. **File type restrictions are bucket-level** — Could be further restricted per-care-profile later.

---

## How to Deploy

### Step 1: Run schema.sql (if not already run)

This creates the `documents` table with `file_path` and `file_name` columns, plus the `is_care_profile_member()`, `get_care_profile_role()`, and `is_care_profile_admin()` helper functions.

### Step 2: Run storage.sql

Paste the contents of `supabase/storage.sql` into the Supabase SQL Editor and run.

### Step 3: Verify

```sql
-- Check bucket exists
SELECT * FROM storage.buckets WHERE id = 'care-documents';

-- Check policies exist
SELECT policyname, cmd
FROM storage.policies
WHERE bucket_id = 'care-documents';

-- Check helper function exists
SELECT proname FROM pg_proc WHERE proname = 'storage_care_profile_id';
```

---

## Security Notes

- Service role keys are **never** exposed to the frontend.
- All access is via the user's JWT and RLS policies.
- Files are not publicly accessible — no public URLs.
- The `storage_care_profile_id()` function is `SECURITY DEFINER` and runs with the function owner's privileges, ensuring consistent access checks.
