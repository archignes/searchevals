import React from 'react'; 
import { GetStaticProps } from 'next';
import Head from 'next/head'; 
import Script from 'next/script'
import Intro from '../src/components/Intro';
import Marquee from '../src/components/Marquee';
import evals from "../src/data/evals.json";
import evaluators from "../src/data/evaluators.json";
import systems from "../src/data/systems.json";

const title = "Searchevals"
const description = "A platform for sharing, sharing about, and searching for evaluations of search systems."
const url = process.env.NEXT_PUBLIC_DOMAIN;
const image = `${url}/screenshots/home_default.png`;



export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      evals,
      evaluators,
      systems
    },
  };
};


const HomePage = () => {
  return (
    <>
      <Head>
        <title>{title}</title>

        {/* <!-- HTML Meta Tags --> */}
        <meta name="description" content={description} />

        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content={url} />
        <meta property="og:type" content="search.eval" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Script defer data-domain="searchevals.com" src="https://plausible.io/js/script.js" />
      <Intro evals={evals} evaluators={evaluators} systems={systems} />
      <Marquee />
    </>
  );
};

export default HomePage;