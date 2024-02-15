// card/[id].tsx
import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import DataContext from '@/src/components/DataContext';
import Head from 'next/head';
import Header from '../../src/components/Header';
import SearchBar from '../../src/components/SearchBar';
import SearchEvalCard from '../../src/components/SearchEvalCard';
import Footer from '../../src/components/Footer';


const CardPage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string }; 

  const { data, evaluators } = useContext(DataContext);
  const evalItem = data.find(item => item.id === id);
  
  if (!evalItem) {
    return ("No evalItem found...")
  }

  const title = `Searcheval: [${evalItem.query.slice(0, 60)}]`;

  const getEvaluatorName = (evaluatorId: string): string => {
    const evaluator = evaluators.find(evaluator => evaluator.id === evaluatorId);
    return evaluator ? evaluator.name : 'Unknown Evaluator';
  };
  const systems_readable = evalItem.systems.length === 2 ? evalItem.systems.join(' and ') : evalItem.systems.length > 2 ? evalItem.systems.slice(0, -1).join(', ') + ', and ' + evalItem.systems.slice(-1) : evalItem.systems[0];
  const description = `Search evaluation of ${systems_readable} from ${getEvaluatorName(evalItem.evaluator_id)} for query: ${evalItem.query}`
  const { asPath } = router;
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const url = `${domain}${asPath}`;
  const image = `${domain}/screenshots/card-${evalItem.id}_crop.png`;


  return (
    <>
      <Head>
        {/* <!-- HTML Meta Tags --> */}
        <title>{title}</title>
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
      </Head>
      <Header/>
      <SearchBar />
      <SearchEvalCard id={id} />
      <Footer />
    </>
  );
};

export default CardPage; 