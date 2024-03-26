// card/[id].tsx
import React, { useContext } from 'react';
import Head from 'next/head';
import Script from 'next/script'
import Header from '../../src/components/Header';
import SearchBar from '../../src/components/SearchBar';
import SearchEvalCard from '../../src/components/SearchEvalCard';
import Footer from '../../src/components/Footer';
import { GetStaticProps, GetStaticPaths } from 'next';
import { evalEvaluator } from '@/src/components/DataContext';
import OpenGraphCardMetaData from '@/src/components/OpenGraphCardMetaData';
import { EvalItem } from '@/src/types/evalItem';

// Import your JSON data at the top of your file
import evals from "src/data/evals.json";
import evaluators from "src/data/evaluators.json";
import systems from "src/data/systems.json";


export const getStaticProps: GetStaticProps = async (context) => {
  // Ensure `params` is not undefined
  const id = context.params?.id;
  const evalItem = evals.find(item => item.id === id);

  // Handle the case where no item is found
  if (!evalItem) {
    return { notFound: true };
  }

  return {
    props: {
      evalItem,
      evals,
      evaluators,
      systems
    },
  };
};


export const getStaticPaths: GetStaticPaths = async () => {
  // Generate paths based on evals' IDs
  const paths = evals.map(evalItem => ({
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
      <SearchEvalCard id={evalItem.id} />
    </>
  );
};

export default CardPage; 