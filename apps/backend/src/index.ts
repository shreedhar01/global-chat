import { createApp } from "./app.js";

const start = async () => {
  try {
    const { server } = await createApp();

    const PORT = process.env.PORT || 3000;

    server.listen(PORT, () => {
      console.log("Server running on port", PORT);
    });
  } catch (err) {
    console.log("Startup error ::", err);
    process.exit(1);
  }
};

start();
