import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import DataContext, { EvalItem } from './DataContext'

interface MetaProps {
  evalItem: EvalItem
}



const HelmetComponent: React.FC<MetaProps> = ({ evalItem }: MetaProps) => {
  const { evaluators } = useContext(DataContext);
  const title = `Searcheval: [${evalItem.query.slice(0, 60)}]`;
  
  const getEvaluatorName = (evaluatorId: string): string => {
    const evaluator = evaluators.find(evaluator => evaluator.id === evaluatorId);
    return evaluator ? evaluator.name : 'Unknown Evaluator';
  };
  const systems_readable = evalItem.systems.length === 2 ? evalItem.systems.join(' and ') : evalItem.systems.length > 2 ? evalItem.systems.slice(0, -1).join(', ') + ', and ' + evalItem.systems.slice(-1) : evalItem.systems[0];
  const description = `Search evaluation of ${systems_readable} from ${getEvaluatorName(evalItem.evaluator_id)} for query: ${evalItem.query}`
  const url = `https://${window.location.hostname}${process.env.PUBLIC_URL}/card/${evalItem.id}`;
  const image = `https://${window.location.hostname}${process.env.PUBLIC_URL}/screenshots/card-${evalItem.id}_crop.png`;

  return (    
    <>
      <Helmet>
        {/* <!-- HTML Meta Tags --> */}
        <title>{title}</title>
        <meta name="description" content={description }/>

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

      </Helmet>
    </>
  );
};

export default HelmetComponent;