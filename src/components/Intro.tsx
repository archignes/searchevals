import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Link from 'next/link';
import { EvalItem } from '@/src/types/evalItem';
import { evalEvaluator, System} from '@/src/components/DataContext';
import { SearchevalTitle } from "./header/Header";
import ImageDisplay from "./ImageDisplay";

const Intro = ({ evals, evaluators, systems }: { evals: EvalItem[]; evaluators: evalEvaluator[]; systems: System[]}) => { 
  
  const uniqueSystemsCount = new Set(evals.flatMap(evalItem => evalItem.systems)).size;
  
  return (
    <>
      
    </>
  );
};

export default Intro;
