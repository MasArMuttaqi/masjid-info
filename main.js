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

 // Mapping nama bulan Hijriah Arab ke Indonesia
const hijriMonthMap = {
  'محرم': 'Muharram',
  'صفر': 'Safar',
  'ربيع الأول': 'Rabiul Awal',
  'ربيع الثاني': 'Rabiul Akhir',
  'جمادى الأولى': 'Jumadil Awal',
  'جمادى الآخرة': 'Jumadil Akhir',
  'رجب': 'Rajab',
  'شعبان': "Sya'ban",
  'رمضان': 'Ramadhan',
  'شوال': 'Syawwal',
  'ذو القعدة': 'Dzulkaidah',
  'ذو الحجة': 'Dzulhijjah'
};

const rukyahCorrection = [{
  "2025-01": 0,
  "2025-02": 0,
  "2025-03": -1,
  "2025-04": 0,
  "2025-05": +1,
  "2025-06": 0,
  "2025-07": 0,
  "2025-08": -1,
  "2025-09": -1,
  "2025-10": 0,
  "2025-11": 0,
  "2025-12": 0
}];

function convertToHijriWithCorrection(inputDate = null) {
  // gunakan tanggal sekarang jika inputDate null
  let date = inputDate ? moment(inputDate, "YYYY-MM-DD") : moment();

  // set zona waktu WIB (+7)
  //date = date.utcOffset(7);

  // buat key tahun-bulan untuk cek koreksi
  const ymKey = date.format("YYYY-MM");
  const correction = rukyahCorrection[ymKey] || 0;

  // terapkan koreksi tanggal
  if (correction !== 0) {
    date.add(correction, "days");
  }

  // ambil tanggal, bulan, tahun hijriah dengan moment-hijri
  const hijriDay = date.format("iD");
  const hijriMonthArabic = date.format("iMMMM");
  const hijriMonth = hijriMonthMap[hijriMonthArabic] || hijriMonthArabic;
  const hijriYear = date.format("iYYYY");

  return `${hijriDay} ${hijriMonth} ${hijriYear} H`;
}

// Contoh pemakaian:
// document.getElementById("tanggal-hijriah").innerHTML = convertToHijriWithCorrection("2025-08-27");
// atau default ke tanggal hari ini:
$('#tanggal-hijriah').html(convertToHijriWithCorrection());



moment.locale('id');

// data koreksi hasil rukyah
// format: { "iYYYY-iMM": "YYYY-MM-DD" }
const rukyahCorrection1 = {
  "1447-01": "2025-06-26",
  "1447-02": "2025-07-26",
  "1447-03": "2025-08-25"
};

// fungsi konversi dengan fallback
function convertToHijriWithRukyah(inputDate = null) {
  // gunakan tanggal sekarang jika inputDate null
  let date = inputDate ? moment(inputDate, "YYYY-MM-DD") : moment();
  // date = date.utcOffset(7); // WIB

  // konversi awal (fallback default moment-hijri)
  let hijriDefault = moment(date).format("iYYYY-iMM-iD");
  let hijriYear = moment(date).format("iYYYY");
  let hijriMonth = moment(date).format("iMM");
  let ymKey = `${hijriYear}-${hijriMonth}`;

  if (rukyahCorrection1[ymKey]) {
    let rukyahStart = moment(rukyahCorrection1[ymKey], "YYYY-MM-DD").utcOffset(7);
    let diffDays = date.diff(rukyahStart, "days");

    if (diffDays >= 0) {
      let correctedDay = diffDays + 1; // +1 karena tanggal rukyahStart = 1 Hijriah
      return `${hijriYear}-${hijriMonth}-${correctedDay}`;
    } else {
      // jika tanggal sebelum awal rukyah, fallback ke default
      return hijriDefault;
    }
  } else {
    // fallback jika bulan tidak ada di data koreksi
    return hijriDefault;
  }
}

// contoh penggunaan
console.log("Default moment-hijri:", moment(formatDateToYMD(date)).format("iYYYY-iMM-iD"));
console.log("Dengan koreksi:", convertToHijriWithRukyah(formatDateToYMD(date)));


// jam otomatis
function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  const clockDisplay = `${hours}:${minutes}:${seconds}`;
  $('#clock').html(clockDisplay); 
}

function updateClockEverySecond() {
  updateClock();
  setInterval(updateClock, 1000);
}

updateClockEverySecond();
// jam otomatis



// filter data dari json
const targetDate = date.toISOString().slice(0, 10);
const jadwalSholat = datas.filter(item => item.tanggal === targetDate);
// Audio element untuk akhir iqomah
const audioEndIqomah = new Audio("src/audio/beep-alarm-366507.mp3");


function getPrayerTimes() {
    const now = new Date();
    const today = jadwalSholat.find(j => j.tanggal === now.toISOString().slice(0, 10));
    if (!today) return [];

    return [
        { name: "Imsak", time: today.imsak },
        { name: "Subuh", time: today.subuh },
        { name: "Terbit", time: today.terbit },
        { name: "Duha", time: today.duha },
        { name: "Zuhur", time: today.zuhur },
        { name: "Asar", time: today.asar },
        { name: "Magrib", time: today.magrib },
        { name: "Isya", time: today.isya }
    ].map(p => {
        const [h, m] = p.time.split(":");
        const d = new Date(now);
        d.setHours(parseInt(h), parseInt(m), 0, 0);
        return { name: p.name, time: d };
    });
}

function getCurrentPrayerTime() {
    const now = new Date();
    const prayers = getPrayerTimes();

    for (let i = prayers.length - 1; i >= 0; i--) {
        if (now >= prayers[i].time) {
            return prayers[i];
        }
    }
    return null;
}

function getNextPrayerTime() {
    const now = new Date();
    const prayers = getPrayerTimes();
    return prayers.find(p => now < p.time) || null;
}

var jeda = [
  {"jeda_iqomah":"Subuh","menit":15,"jamaah":10},
  {"jeda_iqomah":"Zuhur","menit":15,"jamaah":10},
  {"jeda_iqomah":"Asar","menit":15,"jamaah":10},
  {"jeda_iqomah":"Magrib","menit":3,"jamaah":10},
  {"jeda_iqomah":"Isya","menit":2,"jamaah":10}
];

function jedaIqomah(target){
    // cari object sesuai nama
var hasil = jeda.find(item => item.jeda_iqomah === target);

// ambil menit
var menit = hasil ? hasil.menit : null;
return menit;
}

function jamaah(target){
var hasil = jeda.find(item => item.jeda_iqomah === target);

// ambil menit
var jamaah = hasil ? hasil.jamaah : null;
return jamaah; 
}

let iqomahActive = false;   // status iqomah
let jamaahActive = false;   // status sholat berjamaah
let jamaahEnd = null;       // waktu akhir sholat berjamaah

function updateCountdown() {
    const now = new Date();
    const currentPrayer = getCurrentPrayerTime();
    const iqomahMinutes = jedaIqomah(currentPrayer?.name) || 0;

    if (currentPrayer) {
        const iqomahEnd = new Date(currentPrayer.time.getTime() + iqomahMinutes * 60000);

        // === Sedang iqomah ===
        if (now < iqomahEnd) {
            iqomahActive = true;
            jamaahActive = false; // reset

            const diff = iqomahEnd - now;
            const minutes = Math.floor(diff / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            $("#statusSholat").html("<img src='src/icon/hourglass.gif' width='20px'/>Menuju Iqomah " + currentPrayer.name);
            $("#Nextprayer").html(currentPrayer.name + 
                " <small class='prayer-time'>" + 
                currentPrayer.time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace('.', ':') + 
                "</small>");
            $("#countdown").html("-  " + minutes + " menit " + seconds + " detik");
            $("#tidak_ada_jadwal").hide();
            return;
        } 

        // === Iqomah baru selesai, mulai sholat berjamaah ===
        if (iqomahActive && !jamaahActive) {
            audioEndIqomah.play();
            iqomahActive = false;
            jamaahActive = true;

            let durasiJamaah = jamaah(currentPrayer.name) || 0; // menit
            jamaahEnd = new Date(now.getTime() + durasiJamaah * 60000);
        }

        // === Sedang sholat berjamaah ===
        if (jamaahActive && jamaahEnd && now < jamaahEnd) {
            const diff = jamaahEnd - now;
            const m = Math.floor(diff / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            $("#statusSholat").html("<img src='src/icon/carpet.gif' width='20px'/> Sholat " + currentPrayer.name + " berjamaah");
            $("#tidak_ada_jadwal").show();
            $("#tidak_ada_jadwal").attr("src", "src/icon/shalat.png");
            $("#countdown").html("Sisa waktu: " + m + " menit " + s + " detik");
           return;
        }

        // === Sholat berjamaah selesai ===
        if (jamaahActive && jamaahEnd && now >= jamaahEnd) {
            jamaahActive = false;
            jamaahEnd = null;
            $("#statusSholat").html("<img src='src/icon/time.gif' width='20px'/> Menunggu waktu sholat");
        }
    }

    // === Countdown menuju sholat berikutnya ===
    const nextPrayer = getNextPrayerTime();
    if (!nextPrayer) {
        $("#Nextprayer").hide();
        $("#tidak_ada_jadwal").show();
        $("#tidak_ada_jadwal").attr("src", "src/icon/prayer-mat_7099103.png");
        $("#countdown").html("0 jam 0 menit 0 detik");
        $("#statusSholat").html("<img src='src/icon/check.gif' width='20px'/> Semua sholat selesai hari ini");
        return;
    }

    const diff = nextPrayer.time - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    $("#statusSholat").html("<img src='src/icon/time.gif' width='20px'/> Menunggu waktu sholat");
    $('#Nextprayer').html(nextPrayer.name + 
        " <small class='prayer-time'>" + 
        nextPrayer.time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace('.', ':') + 
        "</small>");
    $('#countdown').html("- " + hours + " jam " + minutes + " menit " + seconds + " detik");
    $("#tidak_ada_jadwal").hide();
}

setInterval(updateCountdown, 1000);
updateCountdown();

  
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

const iconSholat = [{"sholat":"Imsak","url":"https://maps.gstatic.com/weather/v1/mostly_cloudy_night.svg"},{"sholat":"Subuh","url":"https://maps.gstatic.com/weather/v1/cloudy.svg"},{"sholat":"Terbit","url":"https://raw.githubusercontent.com/MasArMuttaqi/masjid-info/refs/heads/main/src/icon/terbit_alt.svg"},{"sholat":"Dhuha","url":"https://raw.githubusercontent.com/MasArMuttaqi/masjid-info/refs/heads/main/src/icon/Component 8.svg"},{"sholat":"Zuhur","url":"https://maps.gstatic.com/weather/v1/sunny.svg"},{"sholat":"Asar","url":"https://maps.gstatic.com/weather/v1/mostly_cloudy.svg"},{"sholat":"Magrib","url":"https://raw.githubusercontent.com/MasArMuttaqi/masjid-info/refs/heads/main/src/icon/magrib_alt.svg"},{"sholat":"Isya","url":"https://maps.gstatic.com/weather/v1/clear.svg"}];

$(schule).each(function(i,val){
const iconData = iconSholat.find(item => item.sholat === val.nama);
  const iconUrl = iconData ? iconData.url : "https://via.placeholder.com/40";

 $("#jadwal_List").append("<li class='list-group-item sholat-"+val.nama+"' style='border: thin solid; border-color: #D3D3D3; border-bottom-left-radius: 10px; border-top-right-radius: 10px;'><div><span class='time d-block fw-bold'>"+val.waktu+" WIB</span><span class='info d-block text-muted'>"+val.nama+"</span></div><div><img src='"+iconUrl+"' alt='icon-"+val.nama+"'/></div></li>");

// Mengambil teks di dalam span
var keterangan = $('.text-1xl').text();
const ArrayKeterangan = keterangan.split(" ");
let nilai = ArrayKeterangan[0];
// alert(nilai);
$("#JedaIqomah").html("jeda iqomah "+nilai);
let toggleClass = ".sholat-"+nilai;
$(toggleClass).toggleClass('active');


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
$('#tgl_sholatJumat').html(HariPasaranJawa(JumatIni)+" , "+formatTanggalIndo(JumatIni)+" / "+convertToHijriWithCorrection(JumatIni));
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
    var icon="https://lh3.googleusercontent.com/d/1aqYhUIsRzEKNZx2q_UtiiW-nKvA5Pwhw=w1000?authuser=1";
    $(filteredData).each(function(i,k){
      if (k.khotib == k.imam) {
        opd += "<div class='row' style='margin: 15px;'><div class='col-md-12'><div class='card profile-card-2'><div class='card-img-block'><h4>Imam dan Khatib</h4></div><div class='card-body pt-5'><img src='"+icon+"' alt='profile-image' class='profile' style='left:7%' /><h5 class='card-title'>"+k.imam+"</h5><p class='card-text'>"+k.profil_imam+"</p></div></div></div></div>";
      }else{
        opd += "<div class='row' style='margin: 15px;'><div class='col-md-6'><div class='card profile-card-2'><div class='card-img-block'><h4>Imam</h4></div><div class='card-body pt-5'><img src='"+icon+"' class='profile' /><h5 class='card-title'>"+k.imam+"</h5><p class='card-text'>"+k.profil_imam+"</p></div></div></div><div class='col-md-6'><div class='card profile-card-2'><div class='card-img-block'><h4>Khatib</h4></div><div class='card-body pt-5'><img src='"+icon+"' alt='profile-image' class='profile' /><h5 class='card-title'>"+k.khotib+"</h5><p class='card-text'>"+k.profil_khotib+"</p></div></div></div></div";
      }
      opd += "<div class='row'><div class='col-md-12'><div class='card'  style='margin: 30px;'><div class='card-body'><blockquote class='blockquote blockquote-custom bg-white px-3 pt-4'><div class='blockquote-custom-icon shadow-1-strong'><img src='src/icon/image 9.png'></div><p class='card-text'>"+k.tema_khutbah+"</p><footer class='blockquote-footer pt-4 mt-4 border-top'>Tema Khutbah Jum'at</footer></blockquote></div></div></div></div>";
      
      $('#MaklumatSholatJumat').html(opd);
    });
// mengambil jadwal imam dan khotib sholat jumat

//agenda pengajian
const filterTanggal = formatDateToYMD(date);

const targetDate1 = new Date(filterTanggal);

const filtered2 = agenda.filter(item => new Date(item.tanggal) > targetDate1);

// Grouping berdasarkan kategori
const grouped = {};
$.each(filtered2, function(_, item) {
  if (!grouped[item.tanggal]) {
    grouped[item.tanggal] = [];
  }
  grouped[item.tanggal].push(item);
});

// Buat tabel dengan rowspan
const tbody = $('#agenda-pengajian tbody');
tbody.empty(); // bersihkan dulu

if ($.isEmptyObject(grouped)) {
  // kalau tidak ada data tampilkan 1 baris kosong
  const row = $('<tr>');
  row.append('<td colspan="3" class="text-center text-muted"><img src="src/icon/1000258151.png" height="50px"> Tidak ada agenda</td>');
  tbody.append(row);
} else {
  $.each(grouped, function(tanggal, items) {
    const rowspan = items.length;
    $.each(items, function(index, item) {
      var anotherString = formatTanggalIndo(tanggal);
      var cleanedWords = anotherString.split(/\s+/);
      const row = $('<tr>');
      if (index === 0) {
        row.append(
          '<td rowspan="' + rowspan + '" class="agenda-date">' +
            '<div class="dayofmonth">' + cleanedWords[0] + '</div>' +
            '<div class="dayofweek">' + HariPasaranJawa(tanggal) + '</div>' +
            '<div class="shortdate text-muted">' + cleanedWords[1] + ' ' + cleanedWords[2] + '</div>' +
          '</td>'
        );
      }
      row.append('<td class="agenda-time">' + item.jam + '</td>');
      row.append(
        '<td class="agenda-events"><div class="agenda-event">' +
          '<i class="fi fi-tr-catalog-magazine"></i> ' + item.materi +
          '<br><i class="fi fi-tr-skill-user"></i> ' + item.pemateri +
        '</div></td>'
      );
      tbody.append(row);
    });
  });
}
// agenda pengajian 
