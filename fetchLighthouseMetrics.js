import { serializeObject } from './utils';

export default function fetchLighthouseMetrics(url) {
    try {
        // Api using example - 
        // https://developers.google.com/speed/docs/insights/v5/reference/pagespeedapi/runpagespeed?apix_params=%7B%22url%22%3A%22https%3A%2F%2Fwww.bookaway.com%2Froutes%2Fcroatia%2Fhvar-to-split%22%2C%22category%22%3A%5B%22BEST_PRACTICES%22%2C%22ACCESSIBILITY%22%2C%22SEO%22%2C%22PERFORMANCE%22%5D%2C%22strategy%22%3A%22MOBILE%22%7D#response
        const response = UrlFetchApp.fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&strategy=${STRATEGY}&category=BEST_PRACTICES&category=ACCESSIBILITY&category=SEO&category=PERFORMANCE`);

        var data = JSON.parse(response.getContentText());
        
        var lighthouseMetrics = {
        seoScore: data.lighthouseResult.categories.seo?.score,
        accessibilityScore: data.lighthouseResult.categories.accessibility?.score,
        performanceScore: data.lighthouseResult.categories.performance?.score,
        bestPracticesScore: data.lighthouseResult.categories['best-practices']?.score
        };

        Logger.log(`For url ${url}, metrics: ${JSON.stringify(lighthouseMetrics)}`);

        return lighthouseMetrics;
    } catch (error) {
        Logger.log(`Error on fetchLighthouseMetrics: ${error.toString()} for ${url}`);
    }
    }
  