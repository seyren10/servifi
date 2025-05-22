import app from "./app";
import config from "./config/dotenv";
import connectToDatabase from "./config/mongoose";

app.listen(config.port!, async () => {
  console.log(`App listening to port ${config.port}`);
  await connectToDatabase();
});
