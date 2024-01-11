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
