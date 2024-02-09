import { Logger } from '../logger';

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

export function sendTelegramMessage(message) {
  const text = encodeURIComponent(message);
  const url = `${TELEGRAM_API}?chat_id=${CHAT_ID}&text=${text}`;
  const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  const { ok, description } = JSON.parse(response);
  if (ok !== true) {
    Logger.log(`Error: ${description}`);
  }
}
