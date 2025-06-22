const express = require("express");
const path = require("path");
const app = express();
const PORT = 5000;

// ✅ Absolute path to the frontend build folder
const distPath = path.join(__dirname, "../frontend/dist");

// ✅ Serve all static files like index.js, index.css, vite.svg, etc.
app.use(express.static(distPath));

// ✅ All other routes → serve React's index.html
app.get("/*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
