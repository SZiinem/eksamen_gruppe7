import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "0z7i65ux",
  dataset: "production",
  apiVersion: "2023-10-01",
  token: import.meta.env.VITE_SANITY_TOKEN, //Lagret token i .env filen for at 
  useCdn: false
});

export default client