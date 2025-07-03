"use client";
import { useState, useEffect } from "react";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const ContactPage = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        if (!name || !email || !message) {
            setError("All fields are required.");
            return;
        }

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, message }),
            });

            const result = await response.json();

            if (response.ok) {
                setSuccess(true);
                setName("");
                setEmail("");
                setMessage("");
            } else {
                setError(result.message || "Failed to send message.");
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black text-white flex flex-col">
            {/* Navigation Component */}
            <Navigation />

            <div className="w-full max-w-6xl mx-auto py-8 px-4 flex flex-col md:flex-row space-y-8 md:space-y-0">
                {/* Left Side: Contact Form */}
                <div className="w-full md:w-1/2 p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
                    <h1 className="text-2xl md:text-3xl font-semibold">Contact <span className="text-green-500">Goldman Private</span></h1>
                    <p className="text-gray-400 mb-4 text-sm">
                        Get in touch with us for any inquiries, partnerships, or customer support. We're here to assist you.
                    </p>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm text-gray-300">Name</label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-4 bg-gray-700 text-sm text-white rounded-lg border-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm text-gray-300">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-4 bg-gray-700 text-sm text-white rounded-lg border-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm text-gray-300">Message</label>
                            <textarea
                                id="message"
                                placeholder="Your message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full p-4 bg-gray-700 text-sm text-white rounded-lg border-none focus:ring-2 focus:ring-green-500"
                                rows={4}
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        {success && <p className="text-green-500 text-sm">Your message has been sent successfully!</p>}

                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
                        >
                            Send Message
                        </button>
                    </form>
                </div>

                {/* Right Side: Contact Info */}
                <div className="w-full md:w-1/2 bg-gray-800 p-8 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-100 mb-4">Contact Info</h2>
                    <div className="space-y-4">
                        <div className="flex items-center text-gray-400">
                            <PhoneIcon className="w-5 h-5 text-green-500 mr-3" />
                            <span>+44 7412 234258</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                            <EnvelopeIcon className="w-5 h-5 text-green-500 mr-3" />
                            <a href="mailto:contact@goldmanprivate.com" className="text-green-500 hover:underline">
                                contact@goldmanprivate.com
                            </a>
                        </div>

                        <div className="flex items-center text-gray-400">
                            <MapPinIcon className="w-5 h-5 text-green-500 mr-3" />
                            <span>25 Shoe Ln, City of London, London EC4A 4AU, United Kingdom</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Component */}
            <Footer />
        </div>
    );
};

export default ContactPage;
