// OpenGraphCardMetaData.tsx
import { EvalItem } from '@/src/types/evalItem';
import evaluators from "../data/evaluators.json";

const OpenGraphCardMetaData = (evalItem: EvalItem) => {
  const title = evalItem.query.length > 60 ? `Searcheval: [${evalItem.query.substring(0, evalItem.query.lastIndexOf(' ', 56))}...]` : `Searcheval: [${evalItem.query}]`;
  const getEvaluatorName = (evaluatorId: string): string => {
    const evaluator = evaluators.find(evaluator => evaluator.id === evaluatorId);
    return evaluator ? evaluator.name : 'Unknown Evaluator';
  };
  
  const systems_readable = evalItem.systems.length === 2 ? evalItem.systems.join(' and ') : evalItem.systems.length > 2 ? evalItem.systems.slice(0, -1).join(', ') + ', and ' + evalItem.systems.slice(-1) : evalItem.systems[0];
  const description = `Search evaluation of ${systems_readable} from ${getEvaluatorName(evalItem.evaluator_id)} for query: [${evalItem.query}]`
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const url = `${domain}/card/${evalItem.id}`;
  const image = `${domain}/screenshots/card-${evalItem.id}.png`;

  const ogMetadata = { title, description, url, image };

  return (ogMetadata);
};

export default OpenGraphCardMetaData;
