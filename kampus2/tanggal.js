$(document).ready(function() {
    // Fungsi untuk memperbarui jam
    function updateClock() {
        const now = new Date();
        
        // Ambil jam dan menit, tambahkan angka 0 di depan jika di bawah 10
        let hours = now.getHours().toString().padStart(2, '0');
        let minutes = now.getMinutes().toString().padStart(2, '0');

        // Masukkan ke dalam HTML
        $('#hour').text(hours);
        $('#minute').text(minutes);
    }

    // Jalankan fungsi update jam setiap detik
    setInterval(updateClock, 1000);

    // Fungsi untuk efek berkedip pada titik dua (blind)
    setInterval(function() {
        $('#blind').fadeOut(500).fadeIn(500);
    }, 1000);

    // Panggil sekali di awal agar tidak menunggu 1 detik saat pertama load
    updateClock();
});
    
      const date = new Date();

// format tanggal yyyy-mm-dd
function formatDateToYMD(Date) {
  const year = Date.getFullYear();
  const month = String(Date.getMonth() + 1).padStart(2, '0'); // getMonth() dimulai dari 0
  const day = String(Date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
// format tanggal yyyy-mm-dd

// hari pasaran jawa
function HariPasaranJawa(tanggalInput) {
  const hariPasaran = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'];
  const hariMingguan = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum&apos;at', 'Sabtu'];

  // Konversi ke format Date
  const tanggal = new Date(tanggalInput);

  // Hari dalam seminggu
  const hari = hariMingguan[tanggal.getDay()];

  // Hitung selisih hari dari acuan (1 Januari 1900 adalah Legi)
  const acuan = new Date('1900-01-01');
  const selisihHari = Math.floor((tanggal - acuan) / (1000 * 60 * 60 * 24));
  const pasaran = hariPasaran[selisihHari % 5];

  return `${hari} ${pasaran}`;
} 
// hari pasaran jawa

// format tanggal indonesia
function formatTanggalIndo(tanggalString) {
  const bulanIndo = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const [tahun, bulan, tanggal] = tanggalString.split('-');
  const namaBulan = bulanIndo[parseInt(bulan) - 1];
  
  return `${parseInt(tanggal)} ${namaBulan} ${tahun}`;
}
// format tanggal indonesia


$('#hari-pasaran').html(HariPasaranJawa(date));
$('#tanggal-masehi').html(formatTanggalIndo(formatDateToYMD(date)));
    
    
// Mapping Nama Bulan Hijriah ke Bahasa Indonesia
const hijriMonthNames = {
  '01': 'Muharram',
  '02': 'Safar',
  '03': 'Rabiul Awal',
  '04': 'Rabiul Akhir',
  '05': 'Jumadil Awal',
  '06': 'Jumadil Akhir',
  '07': 'Rajab',
  '08': 'Sya`ban',
  '09': 'Ramadhan',
  '10': 'Syawwal',
  '11': 'Dzulkaidah',
  '12': 'Dzulhijjah'
};

// Data Koreksi: "Tahun-Bulan Hijriah": "Tanggal 1 Masehi-nya"
const rukyahCorrection1 = {
  "1447-01": "2025-06-26",
  "1447-02": "2025-07-26",
  "1447-03": "2025-08-25",
  "1447-09": "2026-02-19"
};

function convertToHijriWithRukyah(inputDate = null) {
  // 1. Inisialisasi tanggal (Gunakan moment-timezone jika perlu WIB)
  let targetDate = inputDate ? moment(inputDate, "YYYY-MM-DD") : moment();
  
  // Ambil estimasi tahun & bulan Hijriah dari moment-hijri sebagai basis pencarian
  let hYear = targetDate.format("iYYYY");
  let hMonth = targetDate.format("iMM");
  let ymKey = `${hYear}-${hMonth}`;

  // 2. Cek apakah bulan ini ada di data rukyah
  if (rukyahCorrection1[ymKey]) {
    let rukyahStart = moment(rukyahCorrection1[ymKey], "YYYY-MM-DD");
    
    // Hitung selisih hari antara tanggal input dengan tanggal 1 Hijriah
    let diffDays = targetDate.diff(rukyahStart, "days");

    // Jika selisih negatif, berarti tanggal ini masuk ke bulan Hijriah SEBELUMNYA
    if (diffDays < 0) {
      // Mundur 1 bulan Hijriah dan hitung ulang (Logika Fallback)
      let prevMonthDate = moment(targetDate).subtract(15, "days"); 
      let prevHYear = prevMonthDate.format("iYYYY");
      let prevHMonth = prevMonthDate.format("iMM");
      let prevKey = `${prevHYear}-${prevHMonth}`;
      
      if (rukyahCorrection1[prevKey]) {
         let prevStart = moment(rukyahCorrection1[prevKey], "YYYY-MM-DD");
         let prevDiff = targetDate.diff(prevStart, "days");
         return formatOutput(prevDiff + 1, prevHMonth, prevHYear);
      }
      // Jika data bulan sebelumnya tidak ada, gunakan default moment-hijri
      return targetDate.format("iD iMMMM iYYYY") + " H";
    }

    // Tanggal Hijriah = Selisih hari + 1
    let hijriDay = diffDays + 1;
    return formatOutput(hijriDay, hMonth, hYear);
  }

  // 3. Fallback jika tidak ada data koreksi
  return targetDate.format("iD iMMMM iYYYY") + " H";
}

// Helper untuk merapikan tampilan
function formatOutput(day, monthNum, year) {
  let monthName = hijriMonthNames[monthNum] || monthNum;
  return `${day} ${monthName} ${year} H`;
}

// --- Penggunaan ---
$(document).ready(function() {
  // Contoh testing berdasarkan datamu
  //console.log("2025-06-26 jadi:", //convertToHijriWithRukyah("2025-06-26")); // Hasil: 1 Muharram 1447 H
 // console.log("2025-07-01 jadi:", convertToHijriWithRukyah("2025-07-01")); // Hasil: 6 Muharram 1447 H
  
  $('#tanggal-hijriah').html(convertToHijriWithRukyah());
});