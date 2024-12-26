import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import OpenAI from "openai";
import path from "path";

// Load environment variables
config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text.replace(/\n/g, " "),
  });
  return response.data[0].embedding;
}

async function addDocument(content: string, metadata = {}) {
  const embedding = await getEmbedding(content);

  const { error } = await supabase.from("ai_knowledge_vectors").insert({
    content,
    embedding,
    metadata,
  });

  if (error) throw error;
}

async function clearVectorStore() {
  const { error } = await supabase
    .from("ai_knowledge_vectors")
    .delete()
    .neq("id", 0); // Delete all records

  if (error) throw error;
}

async function listVectorStore() {
  const { data, error } = await supabase
    .from("ai_knowledge_vectors")
    .select("content, metadata")
    .limit(10);

  if (error) throw error;
  console.log("Current vector store contents:");
  console.log(JSON.stringify(data, null, 2));
}

async function main() {
  try {
    // First list current contents
    await listVectorStore();

    // Clear existing data
    await clearVectorStore();
    console.log("Cleared vector store");

    // Add sample documents
    const sampleDocs = [
      {
        content: `The Waiver of Service template is a legal document used in civil proceedings where a defendant voluntarily acknowledges receipt of a lawsuit and waives formal service of process. Key sections include:
- Defendant's Acknowledgment
- Rights Waived
- Retention of Defenses
- Time to Respond
- Duty to Avoid Expenses
- Signature and Notarization Requirements`,
        metadata: { type: "template", category: "waiver-of-service" },
      },
      {
        content: `This Power of Attorney template allows you to designate someone to make financial and legal decisions on your behalf. The document includes sections for:
- Principal and Agent Information
- Powers Granted
- Effective Date and Durability
- Successor Agents
- Compensation and Reimbursement
- Acceptance of Appointment`,
        metadata: { type: "template", category: "power-of-attorney" },
      },
      {
        content: `The Last Will and Testament template provides a framework for:
- Identifying beneficiaries
- Appointing an executor
- Distributing assets and property
- Establishing trusts
- Naming guardians for minor children
- Funeral and burial preferences`,
        metadata: { type: "template", category: "will" },
      },
    ];

    for (const doc of sampleDocs) {
      await addDocument(doc.content, doc.metadata);
      console.log(`Added document: ${doc.metadata.category}`);
    }

    // Verify final contents
    await listVectorStore();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
