// Resources:
// https://schema.org/ClaimReview
// https://schema.org/Rating
// https://schema.org/Claim
// https://developers.google.com/search/docs/appearance/structured-data/factcheck#guidelines
// https://toolbox.google.com/factcheck/about#fcmt-creators

export interface Rating {
  name: string; // Required: Truthfulness rating as a short word or phrase
  author?: {
    name: string; // Recommended: Name of the organization or person publishing the fact check
    url?: string; // Recommended: URL of the publisher of the fact check
  };
  bestRating?: number; // Recommended: Best value possible in the rating scale
  ratingValue: number; // Required: Numeric rating of the claim
  worstRating?: number; // Recommended: Worst value possible in the rating scale
  ratingExplanation?: string; // Optional: Explanation of the rating
  reviewAspect?: string; // Optional: Aspect of the content being rated
}

export interface Claim {
  appearance?: { url: string; "@type": string }[]; // Recommended: Links to or descriptions of CreativeWorks where the claim appears
  author?: {
    name: string; // Required if author is provided: Name of the publisher of the claim
    sameAs?: string; // Recommended: URL providing information about the party making the claim
  };
  datePublished?: string; // Recommended: Date when the claim was made or entered public discourse
  firstAppearance?: { url: string; "@type": string }; // Recommended: Link to or description of a CreativeWork where the claim first appears
}

export interface ClaimReview {
  claimReviewed: string; // Required: Short summary of the claim being evaluated
  reviewRating: Rating; // Required: Assessment of the claim
  url: string; // Required: Link to the page hosting the full article of the fact check
  author?: {
    name: string; // Recommended: Name of the organization or person publishing the fact check
    url?: string; // Recommended: URL of the publisher of the fact check
  };
  itemReviewed?: Claim; // Recommended: Object describing the claim being made
  datePublished: string; // Recommended: Date when the fact check was published
}
