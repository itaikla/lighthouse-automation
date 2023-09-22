// The translation for TS done by GPT-3.5

const STRATEGY: string = 'MOBILE';
const recipients: string[] = ['itai.k@bookaway.com'];
const googleSheetUrl: string = 'https://docs.google.com/spreadsheets/d/1V_NDiwSXiOaZCDD2_Aih5tu0-IAPsU_OsQNKbLcvFY0/edit#gid=0';

async function serializeObject(obj: Record<string, string | number | boolean>): Promise<string> {
  const str: string[] = [];
  for (const p in obj) {
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p].toString()));
    }
  }
  return str.join("&");
}

async function fetchLighthouseMetrics(url: string): Promise<{
  seoScore?: number;
  accessibilityScore?: number;
  performanceScore?: number;
  bestPracticesScore?: number;
}> {
  try {
    // Define the strategy here
    const STRATEGY = "MOBILE";

    // Make the API request
    const response = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${STRATEGY}&category=BEST_PRACTICES&category=ACCESSIBILITY&category=SEO&category=PERFORMANCE`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    const lighthouseMetrics: {
      seoScore?: number;
      accessibilityScore?: number;
      performanceScore?: number;
      bestPracticesScore?: number;
    } = {
      seoScore: data.lighthouseResult.categories.seo?.score,
      accessibilityScore: data.lighthouseResult.categories.accessibility?.score,
      performanceScore: data.lighthouseResult.categories.performance?.score,
      bestPracticesScore: data.lighthouseResult.categories['best-practices']?.score,
    };

    console.log(`For url ${url}, metrics: ${JSON.stringify(lighthouseMetrics)}`);

    return lighthouseMetrics;
  } catch (error) {
    console.error('Error on fetchLighthouseMetrics: ' + error.toString());
    throw error;
  }
}

function appendToExcel(url: string, row: {
  seoScore?: number;
  accessibilityScore?: number;
  performanceScore?: number;
  bestPracticesScore?: number;
}) {
  const todayDate: string = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
  const sheet = SpreadsheetApp.openByUrl(url).getSheetByName('Sheet1');
  const data: any[] = [todayDate, row.seoScore, row.accessibilityScore, row.performanceScore, row.bestPracticesScore];
  sheet.appendRow(data);
}

async function main() {
  const subject: string = 'Lighthouse Scores - Bookaway';
  const landingPages: string[] = [
    'https://www.bookaway.com/routes/vietnam/sapa-to-hanoi',
    'https://www.bookaway.com/routes/croatia/hvar-to-split',
    'https://www.bookaway.com/routes/croatia/hvar',
    'https://www.bookaway.com/routes/croatia',
    'https://www.bookaway.com/suppliers/tp-line'
  ];
  const results: Record<string, {
    seoScore?: number;
    accessibilityScore?: number;
    performanceScore?: number;
    bestPracticesScore?: number;
  }> = {};

  for (const lp of landingPages) {
    const res = await fetchLighthouseMetrics(lp);
    results[lp] = res;
  }

  let mailBody: string = `Strategy: ${STRATEGY}\nEnv: Production\n`;
  Object.entries(results).forEach(([lp, res]) => {
    mailBody += `\n\n${lp}: ${JSON.stringify(res)}`;
  });

  appendToExcel(googleSheetUrl, results['https://www.bookaway.com/routes/croatia/hvar-to-split']);

  recipients.forEach(recipient => sendEmail(recipient, subject, mailBody));
}

// Call the main function to start the execution
main();
