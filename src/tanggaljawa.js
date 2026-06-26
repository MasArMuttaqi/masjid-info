function tanggalJawa(tanggalInput){

const hariMingguan=['Ahad','Senin','Selasa','Rabu','Kamis',"Jum'at",'Sabtu'];
const pasaran=['Legi','Pahing','Pon','Wage','Kliwon'];

const bulanJawa=[
"Sura","Sapar","Mulud","Bakda Mulud",
"Jumadil Awal","Jumadil Akhir",
"Rejeb","Ruwah","Pasa","Sawal",
"Dulkangidah","Besar"
];

const windu=['Alip','Ehe','Jimawal','Je','Dal','Be','Wawu','Jimakir'];

const neptuHari=[5,4,3,7,8,6,9];
const neptuPasaran=[5,9,7,4,8];

const tahunHari=[354,355,354,354,355,354,354,355];

function bulanLength(bulan,tahunIndex){
let panjang=[30,29,30,29,30,29,30,29,30,29,30,29];
if(tahunHari[tahunIndex]==355) panjang[11]=30;
return panjang[bulan];
}

// ACUAN DISINKRONKAN
// 10 Maret 2026 = 21 Pasa 1959 AJ
const epoch=new Date(2026,2,10);

let tanggal=21;
let bulan=8;
let tahun=1959;
let tahunIndex=4; // Dal

const target=new Date(tanggalInput);

let selisih=Math.floor((target-epoch)/86400000);

if(selisih>0){
for(let i=0;i<selisih;i++){

tanggal++;

if(tanggal>bulanLength(bulan,tahunIndex)){
tanggal=1;
bulan++;

if(bulan>11){
bulan=0;
tahun++;
tahunIndex++;
if(tahunIndex>7) tahunIndex=0;
}

}

}
}

if(selisih<0){
for(let i=0;i<Math.abs(selisih);i++){

tanggal--;

if(tanggal<1){

bulan--;

if(bulan<0){
bulan=11;
tahun--;
tahunIndex--;
if(tahunIndex<0) tahunIndex=7;
}

tanggal=bulanLength(bulan,tahunIndex);

}

}
}

// hari
const hariIndex=target.getDay();
const hari=hariMingguan[hariIndex];

// pasaran
const acuanPasaran=new Date(1900,0,1);
let selisihPasaran=Math.floor((target-acuanPasaran)/86400000);

let pasaranIndex=(selisihPasaran+1)%5;
if(pasaranIndex<0) pasaranIndex+=5;

const pasaranHari=pasaran[pasaranIndex];

// neptu
const neptu=neptuHari[hariIndex]+neptuPasaran[pasaranIndex];

return{
hari:hari,
pasaran:pasaranHari,
tanggal: tanggal,
bulan: bulanJawa[bulan],
tahun: tahun,
windu: windu[tahunIndex],
neptu: neptu
}

}