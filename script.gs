function cekNilai(nis) {
  // Buka sheet
  let sheetUrl = "https://docs.google.com/spreadsheets/d/1D_gWs5Njo151tw-tm5uHKhaOAofjxjuv1FFooGaygPk/edit#gid=0";
  let file = SpreadsheetApp.openByUrl(sheetUrl);
  let Nilai = file.getSheetByName("Nilai");
  let last_row = Nilai.getLastRow();
  
  // Ambil data
  let daftarNilai = Nilai.getRange(`A3:E${last_row}`).getValues();
  let filteredNilai = daftarNilai.filter(index => index[1] == nis);

  // Variabel untuk pesan
  let pesan = "apa";

  if (filteredNilai.length === 0) {
    pesan = `Saldo untuk siswa dengan No WA ${nis} tidak ditemukan.`;
  } else {
    pesan = "Saldo siswa atas nama dan No WA yang ditemukan adalah:\n";
    
    filteredNilai.forEach((data, i) => {
      let nama = data[3];
      let saldo = data[4];
      pesan += `${i+1}. Nama: ${nama}, No. WA: ${nis}, Saldo: ${saldo}\n`;
    });
  }

  return pesan;
}

// function doget ini untuk mengambil request.param dengan GET dari API yang telah di deploy
function doGet(req) {
  var action = req.parameter.action;
  var result;

  console.log(action)

  if (action === "Nilai") {
    // Mengambil parameter nis dari URL
    var nis = req.parameter.nis;

    // Memanggil fungsi cekNilai
    var pesan = cekNilai(nis);

    // Membuat respons dalam format JSON
    var response = {
      message: pesan
    };

    // Mengubah respons menjadi JSON dan mengirimkannya
    result = ContentService.createTextOutput(JSON.stringify(response));
    result.setMimeType(ContentService.MimeType.JSON);
  } else {
    // Tindakan tidak dikenali
    var errorResponse = {
      error: "Tindakan tidak dikenali."
    };
    result = ContentService.createTextOutput(JSON.stringify(errorResponse));
    result.setMimeType(ContentService.MimeType.JSON);
  }

  return result;
}


function doPost(e) {
  // Membaca pesan
  let contents = JSON.parse(e['postData']['contents']);
  let senderMessage = contents['senderMessage'];

  // Mengurai isi pesan
  let splittedMessage = senderMessage.split(' ');
  let nis = splittedMessage[1];

  // Memanggil fungsi cekNilai()
  let pesan = cekNilai(nis);

  // Mengirim pesan balasan
  let response = {
    data: [
      {
        message: pesan
      }
    ]
  }

  return ContentService.createTextOutput(JSON.stringify(response));
  // return response
}


function test() {
  Logger.log(cekNilai("628188"));
}
