const TOKEN = process.env.TELEGRAM_BOT_TOKEN

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end()
    
    const { message } = req.body
    if (!message || !message.text) return res.status(200).end()
    
    const chatId = message.chat.id
    const text = message.text
    
    if (text.startsWith("/start")) {
        await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: `✅ Ulandi! Sening chat_id ng: <code>${chatId}</code>\n\nMomentum ilovasiga bu raqamni kiriting.`,
                parse_mode: "HTML"
            })
        })
    }
    
    res.status(200).end()
}