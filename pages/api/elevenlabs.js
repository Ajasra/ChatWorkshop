import textToSpeech from "elevenlabs-api";

const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API;
const LOCAL_KEY = process.env.NEXT_PUBLIC_LOCAL_KEY;
const voice_id = "MF3mGyEYCl7XYWbV9V6O";

export default async function handler(req, res) {
	if (req.method === "POST") {
		
		const timestamp = new Date().getTime();
		const filename = `public/resp/r_${(timestamp).toFixed(0)}.mp3`;
		
		let message = req.body.messages;
		let key = req.body.key;
		
		console.log(message);
		
		if (key !== LOCAL_KEY) {
			res.status(404).json({ error: "Access denied" });
			return;
		}
		
		if (message.length == 0) {
			res.status(404).json({ error: "Empty message" });
			return;
		}
		
		try {
			textToSpeech(apiKey, message, voice_id, filename).then(
				(response) => {
					console.log(`Success, Audio saved as: ${filename}`);
					res.status(200).json({ error: null, response: (timestamp).toFixed(0) });
				}
			);
			
		} catch (error) {
			console.error(
				`An error occurred while converting text to speech: ${error}`
			);
		}
	} else {
		res.status(404).json({ error: "Not found" });
	}
}
