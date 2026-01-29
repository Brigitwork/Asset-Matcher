export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).send("Only POST allowed");
  }

  const { message } = req.body;

  const BOT_TOKEN = "8530888171:AAGvntyl7L7D32_6_gOwN56hVWyDa-Bg2kE";
  const CHAT_ID = "7516788291";

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message
      })
    });

    return res.status(200).send("Sent");

  } catch (err) {

    return res.status(500).send("Failed");

  }
}
