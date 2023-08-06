// import fs and path for file system
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  // get filename from request body
  let filename = req.body.filename;

  // create absolute path to file
  const absolutePath = path.join(process.cwd(), "public", filename);
  try {
    // check if file exists
    fs.accessSync(absolutePath, fs.constants.F_OK);
    // if file exists, return true
    res.status(200).json({ exists: true });
  } catch (error) {
    // if file does not exist, return false
    res.status(200).json({ exists: false });
  }
}
