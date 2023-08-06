import fs from "fs";
import path from "path";

export default function handler(req, res) {
  let filename = req.body.filename;

  const absolutePath = path.join(process.cwd(), "public", filename);
  try {
    fs.accessSync(absolutePath, fs.constants.F_OK);
    res.status(200).json({ exists: true });
  } catch (error) {
    res.status(200).json({ exists: false });
  }
}
