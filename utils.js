export function sendEmail(recipient, subject, body) {
  try {
    MailApp.sendEmail({
      to: recipient,
      subject: mailSubject,
      body: body,
      from: senderEmail,
    });
    Logger.log('Email sent successfully to ' + recipient);
  } catch (error) {
    Logger.log(`Error sending email: ${error.toString()}`);
  }
}

export function appendToExcel(url, row) {
  var todayDate = new Date().toJSON().slice(0,10).replace(/-/g,'/');
  const sheet = SpreadsheetApp.openByUrl(url).getSheetByName('Sheet1');
  var data = [todayDate, row.seoScore, row.accessibilityScore, row.performanceScore, row.bestPracticesScore];
  sheet.appendRow(data);
}

export function serializeObject(obj) {
  var str = [];
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  }
  return str.join("&");
}
