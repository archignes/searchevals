export interface evalPart {
  id: string;
  url?: string;
  media?: string;
  content: string;
  query?: string;
  images?: imageItem[]
}


export interface imageItem {
  url: string;
  caption?: string;
  annotated?: boolean;
  extension_modified?: boolean;
}


export interface methodologyCitation {
  in_text: string;
  full: string;
  url: string;
}

export type evalTag = "implied negative evaluation" | "implied positive evaluation" | "adversarial query" | "more evaluations available at the link"

export type searchType = "navigational" | "video"

export type evalTarget = 
  | "featured snippet" 
  | "generated response" 
  | "top results" 
  | "generated response v. list of results"
  | "fresh retreival"
  | "hallucination"
  | "logic error"
  | "'From sources across the web'"
  | "world model"
  | "prompt injection"
  | "inconsistent alignment"
  | "SERP"
  | "lack of critical evaluation or contextualization of source material";

export interface EvalItem {
  id: string;
  date: string;
  validation_image?: string;
  query: string;
  url: string;
  connected?: string[];
  following?: string[];
  key_phrases?: string[];
  evaluation_target?: Array<evalTag>;
  search_type?: Array<searchType>;
  tags?: Array<evalTag>;
  methodology?: methodologyCitation | null;
  context?: string;
  systems: string[];
  eval_parts?: evalPart[];
  content?: string; // Make content optional
  images?: imageItem[];
  evaluator_id: string;
  media?: string;
  also_published_at?: string;
}

export type evalCardItem = EvalItem | evalPart
