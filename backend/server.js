import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { env } from "./src/config/env.js";


app.listen(env.PORT, async () => {
  console.log(`Server running on port ${env.PORT}`);
  await connectDB();
})