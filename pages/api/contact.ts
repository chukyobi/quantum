import { NextApiRequest, NextApiResponse } from "next";
import sendContactEmail from "@/utils/contact";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, email, message } = req.body;

    // Validate the required fields
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    try {
      // Pass the sender's name, email, and message to the sendContactEmail function
      const isSent = await sendContactEmail(email, name, "contact@goldmanprivate.com", message);

      if (isSent) {
        return res.status(200).json({ message: "Your messages has been sent successfully!" });
      }

      return res.status(500).json({ message: "Failed to send message." });
    } catch (error: unknown) {
      // Check if the error is an instance of Error
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }

      // Fallback if the error is not an instance of Error
      return res.status(500).json({ message: "An unexpected error occurred." });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
