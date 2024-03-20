import { sendEmail, appendToExcel } from './utils';
import fetchLighthouseMetrics from './fetchLighthouseMetrics';

// Pages to inspect
const pages = [
 { url: 'https://www.example.com/home', sheet: '' },
 { url: 'https://www.example.com/page/1' }
];

// May be MOBILE or DESKTOP. MOBILE is the recommended option
const STRATEGY = 'MOBILE';

const senderEmail = 'EXAMPLE@email.com';
const recipients = [senderEmail, senderEmail];

function main() {
  const results = {};
  pages.forEach(p => {
    const res = fetchLighthouseMetrics(p.url);
    results[p.url] = res;
    if (p.sheet) {
      appendToExcel({ url: p.sheet, row: res });
    }
  })

  const urlsList = landingPages.filter(lp => lp.sheet).map(lp => `${lp.url}: ${lp.sheet}`).join('\n\n');
  let mailBody = `Strategy: ${STRATEGY}\nEnv: Production\n${urlsList}`;
  Object.entries(results).forEach(([lp, res]) => {
    mailBody += `\n\n${lp}: ${JSON.stringify(res)}`;
  });

  recipients.forEach(recipient => sendEmail(recipient, subject, mailBody));
}
