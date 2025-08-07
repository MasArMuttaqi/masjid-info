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
  const hariPasaran = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
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

// konversi masehi ke hijriah
  function konversiHijriah(gregorianDate) {
  const hijriMonths = [
    "Muharram", "Safar", "Rabiul Awal", "Rabiul Akhir",
    "Jumadil Awal", "Jumadil Akhir", "Rajab", "Syaban",
    "Ramadhan", "Syawal", "Zulkaidah", "Zulhijah"
  ];

  const hijri = moment(gregorianDate, "YYYY-MM-DD").iDate();
  const hijriMonth = hijriMonths[moment(gregorianDate, "YYYY-MM-DD").iMonth()];
  const hijriYear = moment(gregorianDate, "YYYY-MM-DD").iYear();

  return `${hijri} ${hijriMonth} ${hijriYear} H`;
}
// konversi masehi ke hijriah

// jam otomatis
function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  const clockDisplay = `${hours}:${minutes}:${seconds}  WIB`;
  $('#clock').html(clockDisplay); 
}

function updateClockEverySecond() {
  updateClock();
  setInterval(updateClock, 1000);
}

updateClockEverySecond();
// jam otomatis

// melihat tanggal hijriah Set zona waktu Indonesia (WIB)
moment.locale('id');
const bulanHijriah = moment().utcOffset(7).format('iMMMM');
const tanggal_Hijriah = moment().utcOffset(7).format('iD');
const tahunHijriah = moment().utcOffset(7).format('iYYYY');
const hijriMonthMap = {
  'محرم': 'Muharram',
  'صفر': 'Safar',
  'ربيع الأول': 'Rabiul Awal',
  'ربيع الآخر': 'Rabiul Akhir',
  'جمادى الأولى': 'Jumadil Awal',
  'جمادى الآخرة': 'Jumadil Akhir',
  'رجب': 'Rajab',
  'شعبان': "Sya'ban",
  'رمضان': 'Ramadhan',
  'شوال': 'Syawwal',
  'ذو القعدة': 'Dzulkaidah',
  'ذو الحجة': 'Dzulhijjah'
};

// Fungsi konversi
function convertHijriMonth(arabicMonth) {
  return hijriMonthMap[arabicMonth] || 'Unknown month';
}
$('#tanggal-hijriah').html(tanggal_Hijriah+' '+convertHijriMonth(bulanHijriah)+' '+tahunHijriah); 
// melihat tanggal hijriah Set zona waktu Indonesia (WIB)

// jadwal sholat dan countdown
// filter data dari json
const targetDate = date.toISOString().slice(0, 10);
const jadwalSholat = datas.filter(item => item.tanggal === targetDate);
function getNextPrayerTime(jadwal) {
      const now = new Date();
      const today = jadwalSholat.find(j => j.tanggal === now.toISOString().slice(0, 10));
      if (!today) return null;

      const times = [
        { name: "Imsak", time: today.imsak },
        { name: "Subuh", time: today.subuh },
        { name: "Terbit", time: today.terbit },
        { name: "Duha", time: today.duha },
        { name: "Zuhur", time: today.zuhur },
        { name: "Asar", time: today.asar },
        { name: "Magrib", time: today.magrib },
        { name: "Isya", time: today.isya }
      ];

    for (let i = 0; i < times.length; i++) {
      const [hour, minute] = times[i].time.split(":");
      const prayerTime = new Date(now);
      prayerTime.setHours(parseInt(hour), parseInt(minute), 0, 0);
      if (now < prayerTime) {
        return { name: times[i].name, time: prayerTime };
      }
    }
  return null; // Semua waktu sholat hari ini telah berlalu
}

function updateCountdown() {
      const nextPrayer = getNextPrayerTime(jadwalSholat);

      if (!nextPrayer) {
        // $('#prayer').html("Semua jadwal sholat hari ini telah berlalu.");
        $("#prayer").css("display", "none");
        $("#tidak_ada_jadwal").css("display", "block");
        $('#countdown').html(" 0 jam 0 menit 0 detik");
        return;
      }

      const now = new Date();
      const diff = Math.max(0, nextPrayer.time - now);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      $('#prayer').html(nextPrayer.name+" <small class='prayer-time'>"+nextPrayer.time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace('.', ':')+" </small>");
      $('#countdown').html("- "+hours+" jam "+minutes+" menit "+seconds+" detik");
      $("#prayer").css("display", "block");
      $("#tidak_ada_jadwal").css("display", "none");
}

setInterval(updateCountdown, 1000);
updateCountdown(); // First run

  
// tampilan depan jadwal sholat
const waktu = jadwalSholat[0];
const schule= [
  { nama: "Imsak", waktu: waktu.imsak },
  { nama: "Subuh", waktu: waktu.subuh },
  { nama: "Terbit", waktu: waktu.terbit },
  { nama: "Dhuha", waktu: waktu.duha },
  { nama: "Zuhur", waktu: waktu.zuhur },
  { nama: "Asar", waktu: waktu.asar },
  { nama: "Magrib", waktu: waktu.magrib },
  { nama: "Isya", waktu: waktu.isya }
];
$(schule).each(function(i,val){
  $('#jadwal_List').append("<li class='list-group-item  d-flex justify-content-between align-items-center "+val.nama+"'><div class='aligned'><img src='src/icon/icon-"+val.nama+".svg' alt='icon-"+val.nama+"'/><span>"+val.nama+"</span></div><span class='badge bg-primary'>"+val.waktu+"</span></li>");
});

// Mengambil teks di dalam span
var keterangan = $('.text-1xl').text();
const ArrayKeterangan = keterangan.split(" ");
let nilai = ArrayKeterangan[0];
// alert(nilai);

switch(nilai) {
  case "Imsak":
        $('.Imsak').toggleClass('list-group-item-success');
    break;
  case "Subuh":
        $('.Subuh').toggleClass('list-group-item-success');
    break;
    case "Terbit":
        $('.Terbit').toggleClass('list-group-item-success');
    break;
    case "Duha":
        $('.Dhuha').toggleClass('list-group-item-success');
    break;
    case "Zuhur":
        $('.Zuhur').toggleClass('list-group-item-success');
    break;
    case "Asar":
        $('.Asar').toggleClass('list-group-item-success');
    break;
    case "Magrib":
        $('.Magrib').toggleClass('list-group-item-success');
    break;
    case "Isya":
        $('.Isya').toggleClass('list-group-item-success');
    break;
  default:
    $('.Subuh').toggleClass('');
}
// jadwal sholat dan countdown

// slides setting
const slides = document.querySelector('.slides');
const allSlides = document.querySelectorAll('.slide');
const progressBar = document.getElementById('progressBar');
let currentSlide = 0;
let timeoutId;

function showSlide(index) {
  const slide = allSlides[index];
  const duration = parseInt(slide.getAttribute('data-duration'), 10);

  // Move to the selected slide
  slides.style.transform = `translateX(-${index * 100}%)`;

  // Reset and animate the progress bar
  progressBar.style.transition = 'none';
  progressBar.style.width = '0%';
  void progressBar.offsetWidth; // force reflow
  progressBar.style.transition = `width ${duration}ms linear`;
  progressBar.style.width = '100%';

  // Schedule the next slide
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
  currentSlide = (currentSlide + 1) % allSlides.length;
  showSlide(currentSlide);
  }, duration);
}

// Start the carousel
showSlide(currentSlide);
// slides setting

// mengambil tanggal hari jumat diminggu ini
function getFridayDate() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
  const diffToFriday = 5 - dayOfWeek; // 5 is Friday
  const friday = new Date(today);
  friday.setDate(today.getDate() + diffToFriday);
  
  // Format to YYYY-MM-DD
  const yyyy = friday.getFullYear();
  const mm = String(friday.getMonth() + 1).padStart(2, '0');
  const dd = String(friday.getDate()).padStart(2, '0');
  
  return `${yyyy}-${mm}-${dd}`;
}
var JumatIni = getFridayDate();
// test tanggal maklumat solat jumat id="tgl_sholatJumat"
$('#tgl_sholatJumat').html(HariPasaranJawa(JumatIni)+" , "+formatTanggalIndo(JumatIni)+" / "+konversiHijriah(JumatIni));
// mengambil tanggal hari jumat diminggu ini

// mengambil jadwal imam dan khotib sholat jumat
var filteredData = $.grep(maklumatJumat, function(element, index) {
    return element.tanggal === getFridayDate();
});

if (!Array.isArray(filteredData) || filteredData.length === 0) {
      $("#info-data-kosong").css("display", "block");
      $("#MaklumatSholatJumat").css("display", "none");
    } else { 
        $("#MaklumatSholatJumat").css("display", "block");
    }
var opd = "";
$(filteredData).each(function(i,k){
      if (k.khotib == k.imam) {
        opd += "<div class='row' style='margin: 15px;'><div class='col-md-12'><div class='card profile-card-2'><div class='card-img-block'><h4>Imam dan Khatib</h4></div><div class='card-body pt-5'><img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIwoYUmRwwk60oQVwIEFkoOn5iQZ1jNYkMh80kZ5KkIauzp7E-4kCAkvw&s=10' alt='profile-image' class='profile' style='left:7%' /><h5 class='card-title'>"+k.imam+"</h5><p class='card-text'>"+k.profil_imam+"</p></div></div></div></div>";
      }else{
        opd += "<div class='row' style='margin: 15px;'><div class='col-md-6'><div class='card profile-card-2'><div class='card-img-block'><h4>Imam</h4></div><div class='card-body pt-5'><img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIwoYUmRwwk60oQVwIEFkoOn5iQZ1jNYkMh80kZ5KkIauzp7E-4kCAkvw&s=10' alt='profile-image' class='profile' /><h5 class='card-title'>"+k.imam+"</h5><p class='card-text'>"+k.profil_imam+"</p></div></div></div><div class='col-md-6'><div class='card profile-card-2'><div class='card-img-block'><h4>Khatib</h4></div><div class='card-body pt-5'><img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIwoYUmRwwk60oQVwIEFkoOn5iQZ1jNYkMh80kZ5KkIauzp7E-4kCAkvw&s=10' alt='profile-image' class='profile' /><h5 class='card-title'>"+k.khotib+"</h5><p class='card-text'>"+k.profil_khotib+"</p></div></div></div></div";
      }
      opd += "<div class='row'><div class='col-md-12'><div class='card'  style='margin: 30px;'><div class='card-body'><blockquote class='blockquote blockquote-custom bg-white px-3 pt-4'><div class='blockquote-custom-icon shadow-1-strong'><img src='src/icon/image 9.png'></div><p class='card-text'>"+k.tema_khutbah+"</p><footer class='blockquote-footer pt-4 mt-4 border-top'>Tema Khutbah Jum'at</footer></blockquote></div></div></div></div>";
      
      $('#MaklumatSholatJumat').html(opd);
    });
// mengambil jadwal imam dan khotib sholat jumat
