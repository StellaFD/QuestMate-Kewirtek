# QuestMate — AI-Powered Academic Task Companion

> **Tagline:** *Progress, not pressure.*  
> **Konsep Inti:** Mengubah tumpukan tugas kuliah semester lanjut yang memicu *decision paralysis* dan *procrastination* menjadi *microquest* 15–20 menit yang ringan, adaptif, dan menyenangkan berbasis **Nir Eyal's Hook Model**.

---

## Latar Belakang & Masalah (Student Persona)
Mahasiswa semester 5 sering menghadapi tumpukan tugas kuliah beragam (course online, kuis modul, tugas proyek UI/UX, laporan) dengan deadline berdempetan.
* **Activation Barrier:** Bingung mau mulai dari mana sehingga berakhir rebahan dan *doomscrolling reels/tiktok* di kasur hingga larut malam.
* **Guilt-Induced Paralysis:** Mau nonton YouTube/anime atau main game tapi merasa bersalah karena belum nugas. Akhirnya tidak nugas dan tidak menikmati hiburan sama sekali.
* **Flow Disruption:** Timer pomodoro konvensional sering berbunyi bising dan memaksa berhenti justru saat mahasiswa sedang *in the zone* (sedang *lock-in*).

---

## Implementasi Hook Model di QuestMate

### 1. Trigger (Pemicu)
* **Internal Trigger:** Mengatasi perasaan kewalahan (*overwhelmed*), cemas deadline, dan rasa bersalah menunda tugas.
* **External Trigger:** Notifikasi kontekstual kebiasaan belajar (misal: jam 8 malam), peringatan H-7 beban tugas tinggi, dan widget robot melayang di desktop (*roaming companion*).

### 2. Action (Aksi Bergesekan Rendah — $B = MAT$)
* Mengurangi *cognitive load* melalui AI task chunking: tugas 4.5 jam dipecah menjadi *microquests* 20 menit.
* 1-klik untuk memulai sesi fokus tanpa *decision fatigue*.

### 3. Variable Reward (Hadiah Beragam & Bermakna)
* **Voucher Hiburan 100% Bebas Rasa Bersalah (*Certified Guilt-Free Leisure Pass*):** Sertifikat resmi terverifikasi QuestMate yang memvalidasi bahwa tugas hari ini sudah dicicil, sehingga mahasiswa berhak 100% menikmati 30 menit tontonan/game tanpa rasa bersalah.
* **Variable Sparks & Mystery Loot Roll:** Setiap quest memberikan drop dinamis (+50 EXP, +35–65 Sparks, serta loot seperti *Token Santai Bebas Cemas* atau kupon diskon toko).

### 4. Investment (Investasi Pengguna)
* **Mata Uang Sparks & Toko Aksesoris Aero:** Sparks yang dikumpulkan ditukar untuk meng-upgrade robot humanoid Aero (Cyber-Headphones, Holo-Visor, Plasma Jetpack Thrusters, Drone Mini-Pet).
* Akumulasi *Streak*, riwayat sesi fokus, dan personalisasi companion.

---

## Fitur Utama

1. **Pomodoro Flow State & Mode Lock-in (+Detik):**
   * Dilengkapi mode **Do Not Disturb (DND)** dengan pelindung distraksi visual.
   * Ketika countdown mencapai `00:00`, timer **TIDAK berhenti mendadak dan TIDAK otomatis memaksa rehat**.
   * Timer bertransisi ke **Lock-in Mode (Flow State)** dan menghitung **MAJU (+detik)** untuk menjaga momentum fokus dengan bonus Sparks lembur.
   * Dua tombol keputusan: `[ Ambil Rehat Bebas Rasa Bersalah ]` atau `[ Lanjut Tanpa Istirahat ]`.

2. **Rehat Bebas Rasa Bersalah (Manual Start):**
   * Pilihan aktivitas relaksasi mahasiswa: Nonton YouTube/Anime, Main Game Santai, Seduh Kopi/Boba, Jalan Keluar, Chat Teman, Rebahan Santai.
   * Timer rehat **HANYA** mulai berjalan saat pengguna menekan tombol `Mulai Rehat Sekarang`.

3. **Desktop Roaming Companion (Aero the Humanoid Robot):**
   * Melayang di desktop mendampingi sesi belajar.
   * Dilengkapi indikator waktu live countdown, tombol interaksi (*poke*), mode *docked/roaming*, dan dialog penyemangat khas mahasiswa.
   * Teks dan angka timer selalu tegak lurus dan terbaca saat Aero berputar arah.

4. **Katalog Tugas & AI Breakdown Generator:**
   * Manajemen tugas kuliah semester 5 (AWS Cloud, DataCamp Python, UI/UX App).
   * Input silabus / file / prompt tugas dengan simulasi analisis AI.

---

## Menjalankan Proyek Secara Lokal

### Prasyarat
* [Node.js](https://nodejs.org/) (versi 18 ke atas disarankan)
* npm atau yarn / pnpm

### Langkah Instalasi
```bash
# 1. Clone repository
git clone https://github.com/StellaFD/QuestMate-Kewirtek.git

# 2. Masuk ke direktori
cd QuestMate-Kewirtek

# 3. Install dependencies
npm install

# 4. Jalankan development server
npm run dev
```

Buka URL lokal yang muncul di terminal (biasanya `http://localhost:5173/`) pada browser Anda.

---

## Build Produksi
```bash
npm run build
npm run preview
```

---

## Tech Stack
* **Framework:** React 19 + Vite
* **Routing:** React Router v7
* **Icons:** Lucide React (100% bebas raw emoji)
* **Styling:** Modern Vanilla CSS Design System (Electric Indigo & Cyber Violet gradients, glassmorphism, responsive grid)
