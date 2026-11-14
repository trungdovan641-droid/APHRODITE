// Dán toàn bộ đoạn này vào Apps Script của Google Sheet (Tiện ích mở rộng > Apps Script)
const SHEET_ID = '1juPt_BmXDaebsWhk4aCARfPNQCZXOBdSlIEEAVZJ5vA';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const sh = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    if (sh.getLastRow() === 0) {
      sh.appendRow(['Thời gian gửi', 'Họ và tên', 'Số điện thoại', 'Số khách', 'Sự kiện']);
    }
    const row = sh.getLastRow() + 1;
    sh.getRange(row, 3).setNumberFormat('@'); // giữ số 0 đầu của số điện thoại
    sh.getRange(row, 1, 1, 5).setValues([[new Date(), d.name, d.phone, d.guests, d.event]]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput('Aphrodite Clinic RSVP đang hoạt động');
}
