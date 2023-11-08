const { google } = require('googleapis');
// Replace with the path to your credentials JSON file
const key = require('./path/to/your/credentials.json');

const auth = new google.auth.GoogleAuth({
  keyFile: key,
  scopes: 'https://www.googleapis.com/auth/webmasters',
});

const webmasters = google.webmasters({
  version: 'v3',
  auth,
});

// Replace with your site URL
const siteUrl = 'https://example.com';

webmasters.sitemaps.list({
  siteUrl,
}, (err, response) => {
  if (err) {
    console.error('Error:', err);
    return;
  }

  const sitemaps = response.data.sitemap;
  if (sitemaps && sitemaps.length > 0) {
    console.log('List of sitemaps:');
    sitemaps.forEach((sitemap) => {
      console.log(sitemap.path);
    });
  } else {
    console.log('No sitemaps found for the specified site.');
  }
});
