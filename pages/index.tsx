import React from 'react'; 
import { GetStaticProps } from 'next';
import Head from 'next/head'; 
import Header from '../src/components/Header';
import SearchBar from '../src/components/SearchBar';
import Marquee from '../src/components/Marquee';
import Footer from '../src/components/Footer';


export const getStaticProps: GetStaticProps = async (context) => {
  // Fetch data here if necessary
  return {
    props: {}, // Pass data to the page via props
  };
};

const title = "Searchevals"
const description = "A resource for collecting and exploring a range of open (publicly-available) search evaluations."
const url = process.env.NEXT_PUBLIC_DOMAIN;
const image = `${url}/screenshots/home.png`;

const HomePage = () => {
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
        <meta property="twitter:domain" content="Searchevals.com" />
        <meta property="twitter:url" content={url} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <script defer data-domain="searchevals.com" src="https://plausible.io/js/script.js"></script>
      </Head>
      <Header />
      <SearchBar />
      <Marquee />
      <Footer />
    </>
  );
};

export default HomePage;