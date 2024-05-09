import React from 'react';
import { GetStaticProps } from 'next';
import { NewInputForm } from '@/src/components/DataInput';
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
      <NewInputForm/>
      <Footer />
    </>
  );
};

export default HomePage;