import { ClaimReview } from "./claimReview";

export interface ContentLinkCardProps {
  type: "tweet" | "article";
  url: string;
  imageUrl?: string;
  siteName?: string;
  title?: string;
  description?: string;
  content?: string;
  content_link?: ContentLinkCardProps;
}

export interface evalPart {
  id: string;
  url?: string;
  media?: string;
  content: string;
  query?: string;
  images?: imageItem[]
  content_link?: ContentLinkCardProps;
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
  | "relevant search results"
  | "generated response v. list of results"
  | "freshness"
  | "hallucination"
  | "logic error"
  | "'From sources across the web'"
  | "world model"
  | "election related"
  | "prompt injection"
  | "inconsistent alignment"
  | "SERP"
  | "refusal to answer"
  | "sponsored search results"
  | "original source attribution"
  | "right-to-rank"
  | "unclear focus"
  | "social profile links"
  | "knowledge cards"
  | "dates"
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
  datetime: string;
  validation_image?: string;
  query: string;
  likely_fabricated?: boolean;
  url: string;
  connected?: string[];
  pull_quote?: string;
  reply_to?: string;
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
  content_link?: ContentLinkCardProps;
  images?: imageItem[];
  evaluator_id: string;
  media?: string;
  also_published_at?: string;
  claimReview?: ClaimReview;
  resources?: documentItem[];
  referenced_at?: documentItem[];
  replication_attempt?: {
    replication_of_id: string;
    replication_status: "replicated" | "failed" | "partial" | "patched" | "extended" | "explored"
  }
  rerouting_attempt?: {
    rerouting_from_id: string; 
    rerouting_status: "success" | "failure" | "partial" | "extended critique"
  }
}

export type evalCardItem = EvalItem | evalPart
