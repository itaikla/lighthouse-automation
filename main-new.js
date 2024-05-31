// @include utils.gs

// Strategy can be MOBILE or DESKTOP
const STRATEGY = 'MOBILE';
const alertThreshold = 1.05;

const sheetId = 'EXAMPLE';

function saveToSheet(sheetName, lcp, inp, cls) {
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
  var timestamp = new Date();

  sheet.appendRow([timestamp, lcp, inp, cls]);
}

function fetchWebVitals(lp) {
  var response = UrlFetchApp.fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${lp.url}&strategy=${STRATEGY}`);
  var data = JSON.parse(response.getContentText());

  // loadingExperience focuses on a specific page, while originLoadingExperience aggregates data for the entire origin (domain)
  var lcp = data.loadingExperience.metrics.LARGEST_CONTENTFUL_PAINT_MS.percentile;
  var inp = data.originLoadingExperience.metrics.INTERACTION_TO_NEXT_PAINT.percentile;
  var cls = data.originLoadingExperience.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile;

  saveToSheet(lp.sheet, lcp, inp, cls);
}

function sendAlert(msg) {
  sendTelegramMessage(msg);
}

function checkSingleWebVital(vital, lp) {
  var historicalValue = vital.values.getValues().flat();

  var currentValue = historicalValue[historicalValue.length - 1];
  var previousValue = historicalValue[historicalValue.length - 2];
  var averageValue = historicalValue.slice(0, -1).reduce((a, b) => a + b, 0) / (historicalValue.length - 1);

  if (currentValue > averageValue * alertThreshold) {
    sendAlert(`Anomaly detected in ${vital.name}: ${currentValue} vs previously ${previousValue}, on page: ${lp.url}`);
  }
}

function checkWebVitals(lp) {
  fetchWebVitals(lp);

  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(lp.sheet);
  var lastRow = sheet.getLastRow();
  var lcpValues = sheet.getRange('B2:B' + lastRow);
  var inpValues = sheet.getRange('C2:C' + lastRow);
  var clsValues = sheet.getRange('D2:D' + lastRow);

  const webVitals = [
    { name: 'lcp', values: lcpValues }, 
    { name: 'inp', values: inpValues }, 
    { name: 'cls', values: clsValues }
  ];

  webVitals.forEach(x => checkSingleWebVital(x, lp));
}

function main() {
  pagesToCheck.forEach(p => {
    checkWebVitals(p);
  })
}
