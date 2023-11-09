function cekNilai(angka) {
  // Buka sheet
  let sheetUrl = "https://docs.google.com/spreadsheets/d/1-mC2_n_EQkdHUYC8VT6cMqBMKC62m-VMIZCny4FEs4E/edit#gid=0";
  let file = SpreadsheetApp.openByUrl(sheetUrl);
  let Saldo = file.getSheetByName("RESUME");
  let lastRowSaldo = Saldo.getLastRow();

  function hasNumber(str) {
  return !isNaN(parseFloat(str)) && isFinite(str);
}

  
  // Ambil data
  let daftarSaldo = Saldo.getRange(`A2:Q${lastRowSaldo}`).getValues();
  let filteredSaldo = daftarSaldo.filter(index => index[0] == angka);

  // Variabel untuk pesan
 let pesan = ""

  // fungsi untuk merubah angka menjadi format mata uang IDR
  const rupiah = (number)=>{
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR"
    }).format(number);
  }
  if (angka === undefined) {
    pesan = `Mohon untuk mengisi NIS dengan benar!\nSyukran`
  } else if (hasNumber(angka) === false ) {
    pesan = `Mohon diperhatikan untuk menggunakan NIS dengan format angka!\nSyukran`
  } else if (filteredSaldo.length === 0) {
      pesan = `Saldo santri dengan NIS ${angka} tidak ditemukan.\nSilahkan periksa NIS kembali.`;
  } else {
      filteredSaldo.forEach((data, i) => {
          let nama = data[1];
          let saldo = data[3];
          let kelas = data[2];
          pesan += `Saldo Santri\nNama : ${nama}\nNIS : ${angka}\nKelas : ${kelas}\n\nSaldo Keseluruhan : ${rupiah(saldo)}`;
      });
  }

  return pesan;
}

function doPost(e) {
  // bagian ini sudah berfungsi sampai senderMessage
  let contents = JSON.parse(e['postData']['contents']);
  let senderMessage = contents.query.message;

  // Mengurai isi pesan
  let splittedMessage = senderMessage.split(' ');
  let nis = splittedMessage[1].trim();
    
  let pesan = cekNilai(nis);

  // Mengirim pesan balasan
  let response = {
    "replies": [
      {
        "message": pesan
      }
    ]
  }

  return ContentService.createTextOutput(JSON.stringify(response));

}

console.log(cekNilai('07230100608'))
