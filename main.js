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


$(function(){

    // Cache some selectors

    var clock = $('#clock'),
        ampm = clock.find('.ampm');

    // Map digits to their names (this will be an array)
    var digit_to_name = 'zero one two three four five six seven eight nine'.split(' ');

    // This object will hold the digit elements
    var digits = {};

    // Positions for the hours, minutes, and seconds
    var positions = [
        'h1', 'h2', ':', 'm1', 'm2', ':', 's1', 's2'
    ];

    // Generate the digits with the needed markup,
    // and add them to the clock

    var digit_holder = clock.find('.digits');

    $.each(positions, function(){

        if(this == ':'){
            digit_holder.append('<div class="dots">');
        }
        else{

            var pos = $('<div>');

            for(var i=1; i<8; i++){
                pos.append('<span class="d' + i + '">');
            }

            // Set the digits as key:value pairs in the digits object
            digits[this] = pos;

            // Add the digit elements to the page
            digit_holder.append(pos);
        }

    });

    // Add the weekday names

    var weekday_names = 'AHAD SENIN SELASA RABU KAMIS JUM&apos;AT SABTU'.split(' '),
        weekday_holder = clock.find('.weekdays');

    $.each(weekday_names, function(){
        weekday_holder.append('<span>' + this + '</span>');
    });

    var weekdays = clock.find('.weekdays span');

    // Run a timer every second and update the clock

    // hari pasaran jawa
        var hariPasaran = 'Legi Pahing Pon Wage Kliwon'.split(' '),
            Haripasaran_holder = clock.find('.pasaran');

        $.each(hariPasaran, function(){
            Haripasaran_holder.append('<span>' + this + '</span>');
        });

        var pasaran = clock.find('.pasaran span');

        function HariPasaranJawa(tanggalInput) {
          const tanggal = new Date(tanggalInput);
          const acuan = new Date('1900-01-01'); // Hitung selisih hari dari acuan (1 Januari 1900 adalah Legi)
          const selisihHari = Math.floor((tanggal - acuan) / (1000 * 60 * 60 * 24));
          const pasaran = selisihHari % 5;

          return `${pasaran}`;
        } 
        // hari pasaran jawa

    (function update_time(){

        // Use moment.js to output the current time as a string
        // hh is for the hours in 12-hour format,
        // mm - minutes, ss-seconds (all with leading zeroes),
        // d is for day of week and A is for AM/PM

        var now = moment().format("hhmmssd");

        digits.h1.attr('class', digit_to_name[now[0]]);
        digits.h2.attr('class', digit_to_name[now[1]]);
        digits.m1.attr('class', digit_to_name[now[2]]);
        digits.m2.attr('class', digit_to_name[now[3]]);
        digits.s1.attr('class', digit_to_name[now[4]]);
        digits.s2.attr('class', digit_to_name[now[5]]);

        // The library returns Sunday as the first day of the week.
        // Stupid, I know. Lets shift all the days one position down, 
        // and make Sunday last

        var dow = now[6];
        dow--;

        // Sunday!
        if(dow < 0){
            // Make it last
            dow = 6;
        }

        // Mark the active day of the week
        weekdays.removeClass('active').eq(dow).addClass('active');

        var hari = moment().format("YYYY-MM-DD");
        var HariPasaran = HariPasaranJawa(hari);

        pasaran.removeClass('active').eq(HariPasaran).addClass('active');


        // Set the am/pm text:
        ampm.text("WIB");

        // Schedule this function to be run again in 1 sec
        setTimeout(update_time, 1000);

    })();

});

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
// Audio element untuk akhir iqomah
const audioEndIqomah = new Audio("end-iqomah.mp3");

let iqomahActive = false; // status apakah sedang dalam iqomah

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

function updateCountdown() {
    const now = new Date();
    const currentPrayer = getCurrentPrayerTime();
    const iqomahMinutes = parseInt($("#iqomah_minutes").val()) || 0;
    if (currentPrayer) {
        const iqomahEnd = new Date(currentPrayer.time.getTime() + iqomahMinutes * 60000);

        if (now < iqomahEnd) {
            // Masih dalam waktu iqomah
            iqomahActive = true; // set status aktif
            const diff = iqomahEnd - now;
            const minutes = Math.floor(diff / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            $("#Nextprayer").html(currentPrayer.name + " <small class='prayer-time'>" + currentPrayer.time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace('.', ':') + "</small>");
            $("#countdown").html("Iqomah dalam waktu : "+minutes + " menit " + seconds + " detik");
           // $("#prayer").show();
            $("#tidak_ada_jadwal").hide();
            return;
        } else if (iqomahActive) {
            // Iqomah baru saja selesai
            audioEndIqomah.play();
            iqomahActive = false;
        }
    }

    // Countdown menuju sholat berikutnya
    const nextPrayer = getNextPrayerTime();
    if (!nextPrayer) {
        $("#Nextprayer").hide();
        $("#tidak_ada_jadwal").show();
        $("#countdown").html("0 jam 0 menit 0 detik");
        return;
    }

    const diff = nextPrayer.time - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    $('#Nextprayer').html(nextPrayer.name + 
        " <small class='prayer-time'>" + 
        nextPrayer.time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace('.', ':') + 
        "</small>");
    $('#countdown').html("- " + hours + " jam " + minutes + " menit " + seconds + " detik");
   // $("#prayer").show();
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
$(schule).each(function(i,val){
  $('#jadwal_List').append("<li class='list-group-item  d-flex justify-content-between align-items-center "+val.nama+"'><div class='aligned'><img src='src/icon/icon-"+val.nama+".svg' alt='icon-"+val.nama+"'/>"+"&#x20;"+"<span>"+val.nama+"</span></div><span class='badge bg-primary'>"+val.waktu+"</span></li>");
});

// Mengambil teks di dalam span
var keterangan = $('.text-1xl').text();
const ArrayKeterangan = keterangan.split(" ");
let nilai = ArrayKeterangan[0];
// alert(nilai);
$("#JedaIqomah").html("jeda iqomah "+nilai); 

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
const filterTanggal = formatDateToYMD(date);

const targetDate1 = new Date(filterTanggal);

const filtered2 = agenda.filter(item => new Date(item.tanggal) > targetDate1);

//console.log(filtered);

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
  $.each(grouped, function(tanggal, items) {
    const rowspan = items.length;
    $.each(items, function(index, item) {
      var anotherString = formatTanggalIndo(tanggal);
      var cleanedWords = anotherString.split(/\s+/);
      const row = $('<tr>');
      if (index === 0) {
        row.append('<td rowspan="' + rowspan + '" class="agenda-date"><div class="dayofmonth">'+cleanedWords[0]+'</div><div class="dayofweek">'+HariPasaranJawa(tanggal)+'</div><div class="shortdate text-muted">'+cleanedWords[1]+' '+cleanedWords[2]+'</div></td>');
      }
      row.append('<td class="agenda-time">' + item.jam + '</td>');
      row.append('<td class="agenda-events"><div class="agenda-event"><i class="fi fi-tr-catalog-magazine"></i> ' + item.materi + '<br><i class="fi fi-tr-skill-user"></i>' + item.pemateri+ '</div></td>');
      tbody.append(row);
    });
  });
