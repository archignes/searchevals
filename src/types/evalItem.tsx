import { ClaimReview } from "./claimReview";

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
  | "election related"
  | "prompt injection"
  | "inconsistent alignment"
  | "SERP"
  | "sponsored search results"
  | "unclear focus"
  | "knowledge cards"
  | "lack of critical evaluation or contextualization of source material";

export interface documentItem {
  url: string;
  title: string;
  date: string;
  author: string;
  publisher?: string;
  platform?: string;
}

export interface EvalItem {
  id: string;
  date: string;
  validation_image?: string;
  query: string;
  likely_fabricated?: boolean;
  url: string;
  connected?: string[];
  pull_quote?: string;
  query_interpolated?: boolean;
  following?: string[];
  key_phrases?: string[];
  content_warning?: string;
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
  claimReview?: ClaimReview;
  resources?: documentItem[];
  referenced_at?: documentItem[];
}

export type evalCardItem = EvalItem | evalPart
