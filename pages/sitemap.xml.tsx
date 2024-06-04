import { GetServerSideProps } from 'next';
import evals from '../src/data/evals.json';

const EXTERNAL_DATA_URL = 'https://searchevals.com';

function generateSiteMap(evals) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${evals
      .map(({ id }) => {
        return `
      <url>
        <loc>${`${EXTERNAL_DATA_URL}/card/${id}`}</loc>
      </url>
    `;
      })
      .join('')}
  </urlset>
  `;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = generateSiteMap(evals);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default function SiteMap() {
  return null;
}
