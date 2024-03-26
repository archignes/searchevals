export interface evalPart {
  id: string;
  url?: string;
  media?: string;
  content: string;
  images?: imageItem[]
}

export interface imageItem {
  url: string;
  caption?: string;
  annotated?: boolean;
}




export interface methodologyCitation {
  in_text: string;
  full: string;
  url: string;
}

export interface EvalItem {
  id: string;
  date: string;
  query: string;
  url: string;
  connected?: string[];
  following?: string[];
  key_phrases?: string[];
  tags?: string[];
  methodology?: methodologyCitation;
  context?: string;
  systems: string[];
  eval_parts?: evalPart[];
  content?: string; // Make content optional
  images?: imageItem[];
  evaluator_id: string;
  media?: string;
  also_published_at?: string;
}