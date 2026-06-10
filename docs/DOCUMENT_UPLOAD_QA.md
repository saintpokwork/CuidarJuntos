# Document Upload — Manual QA Checklist

> Feature: Supabase Storage document upload/download/delete integration
> Status: ✅ Ready for manual QA

---

## Prerequisites

- [ ] App runs locally (`npm start`)
- [ ] Supabase project connected with valid `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`
- [ ] `care-documents` bucket exists in Supabase Storage dashboard
- [ ] RLS policies on `care-documents` bucket allow authenticated users to upload/download/delete
- [ ] `documents` table exists in Supabase and has `file_path`, `file_name` columns

---

## 1. Demo Mode — No File

> Anonymous user, no sign-in required.

- [ ] Navigate to Documentos page
- [ ] Fill in file name: `Resultados_2024.pdf`
- [ ] Select categoria: `Exames`
- [ ] Click "Guardar documento"
- [ ] Expect: document card appears in the list
- [ ] Expect: toast "Documento adicionado com sucesso."

## 2. Demo Mode — With File Simulation

- [ ] Click "Selecionar ficheiro" and pick a `.pdf` file (< 5MB)
- [ ] Expect: file name and size shown in upload area
- [ ] Expect: "Remover ficheiro selecionado" link visible
- [ ] Click "Guardar documento"
- [ ] Expect: document card appears with file name
- [ ] Expect: open button may not show (demo mode has no real file)

## 3. Invalid File Type

- [ ] Click "Selecionar ficheiro" and pick a `.txt` or `.docx` file
- [ ] Expect: error message "Formato de ficheiro não suportado. Use PDF, JPG ou PNG." (PT) or "Unsupported file type. Use PDF, JPG or PNG." (EN)
- [ ] Expect: file input resets (no file selected)

## 4. File Over 5MB

- [ ] Click "Selecionar ficheiro" and pick a file > 5MB
- [ ] Expect: error message "Ficheiro demasiado grande. O tamanho máximo é 5MB." (PT) or "File too large. Maximum size is 5MB." (EN)
- [ ] Expect: file input resets

## 5. Remove Selected File

- [ ] Select a valid file
- [ ] Expect: file name/size shown
- [ ] Click "Remover ficheiro selecionado"
- [ ] Expect: file selection clears, upload area returns to initial state

## 6. Open/Download in Demo Mode

- [ ] Click the open button (if visible) on any document card
- [ ] Expect: error message "Este documento está apenas na versão demo e não possui ficheiro real." (PT) or "This document is demo only and has no real file." (EN)

## 7. Delete Document in Demo Mode

- [ ] Click delete button on any document card
- [ ] Expect: card removes from list
- [ ] Expect: toast "Documento removido."

## 8. Persistence (Demo Mode)

- [ ] Add a document in demo mode
- [ ] Refresh the page (F5)
- [ ] Expect: document still present in list
- [ ] Verify: localStorage has `cuidarjuntos-care-data` key with document data

---

## 9. Cloud Mode — Sign In

- [ ] Click "Entrar" and sign in with a valid Supabase account
- [ ] Expect: cloud sync activates, demo data replaced with cloud data

## 10. Cloud Upload — PDF

- [ ] Navigate to Documentos page
- [ ] Expect: upload area shows "Ficheiros guardados de forma privada na sua conta." (PT) or "Files are stored privately in your account." (EN)
- [ ] Select a `.pdf` file (< 5MB)
- [ ] Fill in file name optionally
- [ ] Click "Guardar documento"
- [ ] Expect: submit button shows "A enviar..." / "Uploading..." and is disabled during upload
- [ ] Expect: toast "Documento adicionado com sucesso." after completion
- [ ] Expect: document card appears with open button
- [ ] Verify in Supabase Storage: `care-documents` bucket has file at path `care-profiles/{profileId}/{documentId}/{filename}`

## 11. Cloud Upload — JPG/PNG

- [ ] Repeat steps for `.jpg` and `.png` files
- [ ] Expect: same behavior as PDF upload

## 12. Open/Download Signed URL (Cloud)

- [ ] Click open button on a cloud-uploaded document card
- [ ] Expect: new browser tab opens with the file (PDF viewer / image viewer)
- [ ] Expect: URL is a Supabase signed URL (expires in 10 minutes)
- [ ] Verify: URL pattern contains `token=` parameter

## 13. Delete Document in Cloud Mode

- [ ] Click delete on a document that has an uploaded file
- [ ] Expect: card removes from list
- [ ] Expect: toast "Documento removido."
- [ ] Verify in Supabase Storage: file is removed from `care-documents` bucket
- [ ] Verify in Supabase DB: `documents` table row is deleted

## 14. Delete Document Without File (Cloud)

- [ ] Add a document via `addDocument` (metadata only, no file) in cloud mode
- [ ] Delete that document
- [ ] Expect: no storage delete attempted, metadata deleted successfully

## 15. Refresh Persistence (Cloud)

- [ ] Add/upload documents in cloud mode
- [ ] Refresh the page (F5)
- [ ] Expect: all documents still present, loaded from Supabase

## 16. Supabase Storage Check

- [ ] Go to Supabase Dashboard → Storage → `care-documents` bucket
- [ ] Expect: uploaded files exist with correct path structure
- [ ] Verify RLS policies allow authenticated users to `SELECT`, `INSERT`, `DELETE` on `care-documents` bucket

## 17. Supabase Documents Table Check

- [ ] Go to Supabase Dashboard → Table Editor → `documents` table
- [ ] Expect: document metadata rows exist with populated `file_path` and `file_name` columns for uploaded files
- [ ] Expect: rows without upload have `file_path` and `file_name` as `NULL`

---

## 18. Language Toggle

- [ ] Switch app language to English (Definições → Language → English)
- [ ] Navigate to Documents page
- [ ] Expect: all labels, buttons, errors, and helper text in English
- [ ] Switch back to Portuguese
- [ ] Expect: all text in Portuguese

---

## 19. Edge Cases

- [ ] Double-click submit button rapidly during upload
- [ ] Expect: only one submission (button disabled while uploading)
- [ ] Upload with no file selected (just metadata)
- [ ] Expect: document created without file_path/file_name
- [ ] Upload with file name containing special characters
- [ ] Expect: filename sanitised (lowercase, unsafe chars replaced with `_`)
- [ ] Upload a file with no extension
- [ ] Expect: `sanitiseFileName` handles gracefully, defaults to 'file'

---

## Summary

| Test Area | Status |
|---|---|
| Demo mode — no file | ⬜ |
| Demo mode — with file simulation | ⬜ |
| Invalid file type rejection | ⬜ |
| File >5MB rejection | ⬜ |
| Remove selected file | ⬜ |
| Delete in demo | ⬜ |
| Demo persistence | ⬜ |
| Cloud upload — PDF | ⬜ |
| Cloud upload — JPG/PNG | ⬜ |
| Cloud open/download signed URL | ⬜ |
| Cloud delete with file | ⬜ |
| Cloud delete without file | ⬜ |
| Cloud refresh persistence | ⬜ |
| Supabase Storage verification | ⬜ |
| Supabase documents table verification | ⬜ |
| Language toggle PT/EN | ⬜ |
| Edge cases (double submit, no file, special chars) | ⬜ |

**Ready for manual QA:** ✅