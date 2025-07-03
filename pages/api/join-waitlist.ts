import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email } = req.body;

    // Basic validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    try {
      // Add email to the EmailList model
      const newEmail = await prisma.emailList.create({
        data: {
          email,
          status: "pending", 
        },
      });

      return res.status(200).json({ message: "You have been added to the waitlist successfully!" });
    } catch (error) {
      console.error("Error adding email to waitlist:", error);

      // Log the error for debugging purposes
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      return res.status(500).json({ message: "Failed to add email to the waitlist.", error: errorMessage });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
