import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Link from 'next/link';
import { EvalItem } from '@/src/types/evalItem';
import { evalEvaluator, System} from '@/src/components/DataContext';
import { SearchEvalTitle } from "./Header";
import ImageDisplay from "./ImageDisplay";

const Intro = ({ evals, evaluators, systems }: { evals: EvalItem[]; evaluators: evalEvaluator[]; systems: System[]}) => { 
  
  const uniqueSystemsCount = new Set(evals.flatMap(evalItem => evalItem.systems)).size;
  
  return (
    <>
      <section id="about" className="p-1 mt-5 w-90 md:w-2/5 mx-auto">
        <h2 className="text-xl font-semibold">What is <SearchEvalTitle/>?</h2>
      A platform for sharing, sharing about, and searching for evaluations of search systems.
      <ul className="ml-2 space-y-2">
        <li className="font-medium">Search for search evaluations:</li>
          <ul className="list-disc list-outside ml-4 space-y-1 pl-5">
            <li>Discover over <span className='font-bold'>{evals.length - 1}</span> evaluations of <Link href="/systems" className='hover:bg-blue-100 underline'><span className='font-bold'>{uniqueSystemsCount}</span> search systems</Link> collected across the web from <Link href="/evaluators" className='hover:bg-blue-100 underline'><span className="font-bold">{evaluators.length}</span> evaluators</Link></li>
    
            <ImageDisplay className="mx-5" type="solo" images={[{ "url": "/screenshots/home.png"}]} />
            <li>In an open eval card, click <span className='font-bold'>SearchOnEval</span> to conduct the subject search across <span className='font-bold'>{systems.length}</span> search systems.</li>
            <ImageDisplay className="mx-5" type="solo" images={[{ "url": "/screenshots/SearchOnEval.png" }]} />
            <li>Explore search evaluations across the web ( <ExclamationTriangleIcon className="inline-block" /> currently unsupported)</li>
            <li>Filter and facet by system, type of search, and type of evaluations  ( <ExclamationTriangleIcon className="inline-block" /> currently unsupported)</li>
        </ul>
          <li className="font-medium">Submit found & original search evaluations  ( <ExclamationTriangleIcon className="inline-block" /> currently unsupported)</li>
          <li className="font-medium">Share search evaluations elsewhere  ( <ExclamationTriangleIcon className="inline-block" /> currently minimally supported)</li>
          <ul className="list-disc list-outside ml-4 space-y-1 pl-5">
            <li>Each eval card displays nicely in social media posts through OpenGraph meta tags</li>
            <a href="https://twitter.com/danielsgriffin/status/1758597255748255859" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'center' }} className="underline text-blue-600 hover:text-blue-800 hover:visited:text-purple-600">Twitter (X)</a>
            <ImageDisplay className="mx-5" type="solo" images={[{ "url": "/screenshots/sharecard_twitter.png" }]} />
            <a href="https://www.linkedin.com/feed/update/urn:li:activity:7164373294673018881/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'center' }} className="underline text-blue-600 hover:text-blue-800 hover:visited:text-purple-600">LinkedIn</a>
            <ImageDisplay className="mx-5" type="solo" images={[{ "url": "/screenshots/sharecard_linkedin.png" }]} />
          </ul>
          <li className="font-medium">Share feedback and contribute to the <SearchEvalTitle /> system itself on <a href="https://github.com/danielsgriffin/searchevals" className="underline text-blue-600 hover:text-blue-800 hover:visited:text-purple-600">GitHub</a></li>
      </ul>
    </section>
      <section id="why" className="p-1 mt-2 w-4/5 md:w-2/5 mx-auto">
        <h2 className="text-xl font-semibold">Why <SearchEvalTitle />?</h2>
        We use search systems to wonder and doubt, to learn and find, and to put our knowledge to use.
        But evaluating search is very difficult. We need to expand our ability to talk about and learn about different search tools and practices.
        <ol className="ml-2 space-y-2 list-decimal">
          <li className="font-medium">Search is often "invisible" and is not discussed as often as its importance ought require:</li>
          <ul className="list-inside ml-4 space-y-1">
            <li>Search researchers Jutta Haider & Olof Sundin wrote in <a href="https://www.taylorfrancis.com/books/oa-mono/10.4324/9780429448546/invisible-search-online-search-engines-jutta-haider-olof-sundin" className="underline text-blue-600 hover:text-blue-800 hover:visited:text-purple-600">2019</a>:</li>
            <blockquote className="italic border-l-4 border-gray-500 ml-3 pl-4">
                Search permeates myriads of social practices and everyday life at all levels, but it often remains invisible. It appears to be simple and is done effortlessly. Yet, this effortless simplicity with which online search intersects with everyday life in so many different situations conceals an astounding complexity.
            </blockquote>
            <li>Public-interest technologist Dave Guarino wrote in <a href="https://twitter.com/allafarce/status/1218045995793018880" className="underline text-blue-600 hover:text-blue-800 hover:visited:text-purple-600">2020</a>:</li>
            <blockquote className="italic border-l-4 border-gray-500 ml-3 pl-4">
              We really need to talk more about monitoring search quality for public interest topics.
            </blockquote>

          </ul>
          <li className="font-medium">There are no widely applicable ratings of search systems</li>
          <ul className="list-inside ml-4 space-y-1">
          <li>Former search journalist and Google's Search Liaison Danny Sullivan wrote in <a href="https://searchengineland.com/google-search-quality-crisis-272174" className="underline text-blue-600 hover:text-blue-800 hover:visited:text-purple-600">2017</a>:</li>
          <blockquote className="italic border-l-4 border-gray-500 ml-3 pl-4">
            <span className="text-lg font-bold">We don’t have relevancy ratings for search engines</span><br></br>
            We don’t know which search engine has the best search results. There’s no independent third-party diligently and consistently evaluating actual results. We occasionally get consumer satisfaction surveys, but those don’t actually try to verify that the consumers rating search engines actually know themselves how to evaluate the quality of results.
          </blockquote>
          </ul>
          <li className="font-medium">Benchmarks and academic audits can be gamed and have limited scope</li>          
          <ul className="list-inside ml-4 space-y-1">
            <li>Aravind Srinivas, CEO of Perplexity AI, wrote in <a href="https://twitter.com/AravSrinivas/status/1730647482999378052" className="underline text-blue-600 hover:text-blue-800 hover:visited:text-purple-600">2023</a>:</li>
              <blockquote className="italic border-l-4 border-gray-500 ml-3 pl-4">
              Product human evals are what matter to us, not academic evals that can be gamed.
              </blockquote>
            <li>The <a href="https://chat.lmsys.org/" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 hover:text-blue-800 hover:visited:text-purple-600">LMSYS Chatbot Arena</a> is a crowdsourced platform for evaluating systems that include a couple with online access, but it is not focused on the breadth of use cases for web search.</li>
            </ul>
          <li className="font-medium">Search tools and search needs are constantly changing</li>          
          <ul className="list-inside ml-4 space-y-1">
            <li>People are using search-like tools such as OpenAI's ChatGPT and Google's Gemini, or search-in-situ tools like GitHub Copilot or Cursor</li>
            <li>Chat-based or conversational search tools are used to search the web</li>
            <li>Personalization in search now extends beyond search history and interactions to include brief biographies and system messages shaped by the user</li>
            </ul>
        </ol>
        <p>As we face disruption and opportunity in web search, we deserve a new approach.</p>
      </section>
    </>
  );
};

export default Intro;
