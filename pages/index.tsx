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

const HomePage = () => {
  return (
    <>
      <Head>
        <title>Searchevals</title>
        <meta name="description" content="A resource for collecting and exploring a range of open (publicly-available) search evaluations." />
      </Head>
      <Header />
      <SearchBar />
      <Marquee />
      <Footer />
    </>
  );
};

export default HomePage;