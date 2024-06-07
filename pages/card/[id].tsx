// card/[id].tsx
import React, { useContext } from 'react';
import Head from 'next/head';
import Script from 'next/script'
import Header from '../../src/components/header/Header';
import SearchBar from '../../src/components/SearchBar';
import EvalCard from '../../src/components/EvalCard';
import Footer from '../../src/components/Footer';
import { GetStaticProps, GetStaticPaths } from 'next';
import { evalEvaluator } from '@/src/components/DataContext';
import OpenGraphCardMetaData from '@/src/components/OpenGraphCardMetaData';
import { EvalItem } from '@/src/types/evalItem';
import { claimReviewJsonLD } from '@/src/components/eval-card-elements/ClaimReview';
// Import your JSON data at the top of your file

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id;
  if (!id) {
    return { notFound: true };
  }

  const evals = await import('@/src/data/evals.json');
  const evalItem = evals.default.find((item: any) => item.id === id);

  if (!evalItem) {
    return { notFound: true };
  }

  // Only return the necessary data, not the entire module
  return {
    props: {
      evalItem
    },
  };
};


export const getStaticPaths: GetStaticPaths = async () => {
  // Generate paths based on evals' IDs
  const evals = await import('@/src/data/evals.json');
  const paths = evals.default.map((evalItem: any) => ({
    params: { id: evalItem.id.toString() },
  }));

  return { paths, fallback: 'blocking' };
}



const CardPage = ({ evalItem, evaluators }: { evalItem: EvalItem; evaluators: evalEvaluator[] }) => {
  
  const { title, description, url, image } = OpenGraphCardMetaData(evalItem);
  
  return (
    <>
      <Head>
        <title>{title}</title>

        {/* <!-- HTML Meta Tags --> */}
        <meta name="description" content={description} />

        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:domain" content="Searchevals.com" />
        <meta name="twitter:url" content={url} />

      </Head>
      <Script defer data-domain="searchevals.com" src="https://plausible.io/js/script.js" />
      {evalItem.claimReview && 
        (<Script type="application/ld+json">
          claimReviewJsonLD(evalItem) 
        </Script>)
      }
      <EvalCard evalItemId={evalItem.id} />
    </>
  );
};

export default CardPage; 