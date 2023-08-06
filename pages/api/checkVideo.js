const LOCAL_KEY = process.env.NEXT_PUBLIC_LOCAL_KEY;
const generate_url = "https://api.d-id.com/talks";
const DID_KEY = process.env.NEXT_PUBLIC_DID_KEY;

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { api_key, video_id } = req.body;

    const response = await fetch(generate_url + "/" + video_id, {
      method: "GET",
      headers: {
        Authorization: `Basic ${DID_KEY}`,
        "Content-Type": "application/json",
      },
    });

    response
      .json()
      .then((data) => {
        console.log(data);
        res.status(200).json({ response: data });
      })
      .catch((err) => {
        console.error(err);
        res.status(200).json({ response: null });
      });
  } else {
    res.status(401).json({ error: "not authorized" });
  }
}
