import {Axiom} from "@axiomhq/js"

const AXIOM_TOKEN = process.env.AXIOM_TOKEN!
const AXIOM_ORG_ID = process.env.AXIOM_ORG_ID!
const AXIOM_DATASET = process.env.AXIOM_DATASET!

export const axiom = new Axiom({
  token: AXIOM_TOKEN,
  orgId: AXIOM_ORG_ID,
})

export const axiomDatasetName = AXIOM_DATASET
