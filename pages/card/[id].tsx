// card/[id].tsx
import React from 'react';
import Head from 'next/head';
import Script from 'next/script'
import Header from '../../src/components/Header';
import SearchBar from '../../src/components/SearchBar';
import SearchEvalCard from '../../src/components/SearchEvalCard';
import Footer from '../../src/components/Footer';
import { GetStaticProps, GetStaticPaths } from 'next';
import { EvalItem, evalEvaluator } from '@/src/components/DataContext';

// Import your JSON data at the top of your file
import evals from "src/data/evals.json";
import evaluators from "src/data/evaluators.json";


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
      evaluators
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
  
  const title = `Searcheval: [${evalItem.query.slice(0, 60)}]`;

  const getEvaluatorName = (evaluatorId: string): string => {
    const evaluator = evaluators.find(evaluator => evaluator.id === evaluatorId);
    return evaluator ? evaluator.name : 'Unknown Evaluator';
  };
  const systems_readable = evalItem.systems.length === 2 ? evalItem.systems.join(' and ') : evalItem.systems.length > 2 ? evalItem.systems.slice(0, -1).join(', ') + ', and ' + evalItem.systems.slice(-1) : evalItem.systems[0];
  const description = `Search evaluation of ${systems_readable} from ${getEvaluatorName(evalItem.evaluator_id)} for query: [${evalItem.query}]`
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const url = `${domain}/card/${evalItem.id}`;
  const image = `${domain}/screenshots/card-${evalItem.id}.png`;




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
        {/* <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:domain" content="Searchevals.com" />
        <meta name="twitter:url" content={url} /> */}

      </Head>
      <Script defer data-domain="searchevals.com" src="https://plausible.io/js/script.js" />
      <Header/>
      <SearchBar />
      <SearchEvalCard id={evalItem.id} />
      <Footer />
    </>
  );
};

export default CardPage; 