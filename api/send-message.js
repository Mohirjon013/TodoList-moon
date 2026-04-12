const TOKEN = process.env.TELEGRAM_BOT_TOKEN

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")
    
    if (req.method === "OPTIONS") return res.status(200).end()
    if (req.method !== "POST") return res.status(405).end()

    const { chatId, message } = req.body

    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "HTML"
        })
    })

    res.status(200).json({ ok: true })
}