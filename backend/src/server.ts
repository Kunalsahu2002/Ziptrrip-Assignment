import "./config/env"; // Fail fast if env vars missing
import { app } from "./app";
import { env } from "./config/env";

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`[server] Ziptrrip Todo API running on http://localhost:${PORT}`);
  console.log(`[server] Environment: ${env.NODE_ENV}`);
});
