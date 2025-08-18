# Register & Login Multi-Entitas Security (ForumWeb)

## Register
1. Isi username, email, password di frontend
2. Frontend ambil userAgent (`navigator.userAgent`) & screen (`${screen.width}x${screen.height}`)
3. Kirim ke backend /users
4. Backend balas:
   - totpSecret (base32)
   - QR code (scan di Google Authenticator)
   - fingerprint & salt
   - publicKey
5. Simpan privateKey di device (file terenkripsi dengan password lokal; jangan upload ke server!)

## Login
1. Isi email, password
2. Frontend generate fingerprint (userAgent + screen + salt)
3. Masukkan TOTP dari Google Authenticator (6 digit)
4. Kirim ke backend /login
5. Jika semua entitas valid → akses forum!

## Tips Keamanan
- Jangan pernah bagikan privateKey atau totpSecret.
- Bind device baru via /users/:userId/bind-device.
- Jika login gagal berulang, akun otomatis di-lock (fitur lanjutan).
