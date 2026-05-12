import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "0z7i65ux",
  dataset: "production",
  apiVersion: "2023-10-01",
  token: "skIRXAq8DRpnIUSAoLZhgRq1Q9v3xmrPIjBmrcZxnRmdNbTtkO7qPyQQyAeeKIjTIShmRBjTXISGHnLGgf3f77i71mwxUP8XIUq3ALH52CQMVRqPsgNrMtgCAkGFTAccW90DDM4plh3Buz6bkFxzD3rkS38mVmuXw25vBxdIvQRtWf3xsj48",
  useCdn: false
});

export default client