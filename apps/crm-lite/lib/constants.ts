export const PIPELINE_STAGES = [
  "Lead",
  "Qualified",
  "Discovery",
  "Proposal",
  "Negotiation",
  "Closed Won",
  "Closed Lost"
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];
