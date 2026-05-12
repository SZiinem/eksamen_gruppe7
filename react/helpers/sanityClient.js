import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "0z7i65ux",
  dataset: "production",
  apiVersion: "2023-10-01",
  token: "YOUR_API_TOKEN",
  useCdn: false
});

export default client