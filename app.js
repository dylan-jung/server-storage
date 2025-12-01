const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();

const DATA_DIR = path.join(__dirname, "public", "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, DATA_DIR),
  filename: (req, file, cb) => {
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.get("/files", (req, res) => {
  try {
    const files = fs.readdirSync(DATA_DIR);
    res.json(files);
  } catch (err) {
    console.error("Error reading files:", err);
    res.status(500).json({ error: "Failed to read files" });
  }
});

app.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    res.status(201).json({
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
    });
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).json({ error: "Failed to upload file" });
  }
});
app.delete("/file/:name", (req, res) => {
  const filename = req.params.name;
  const filePath = path.join(DATA_DIR, filename);

  if (!filePath.startsWith(DATA_DIR)) {
    return res.status(400).json({ error: "Invalid file path" });
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      if (err.code === "ENOENT") {
        return res.status(404).json({ error: "File not found" });
      }
      return res.status(500).json({ error: "Failed to delete file" });
    }

    res.status(204).send(); // 성공, 바디 없음
  });
});

app.listen(80, () => {
  console.log("Server is running on port 80");
});
