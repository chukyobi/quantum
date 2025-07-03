"use client";
import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black text-white flex flex-col">
      {/* Navigation Component */}
      <Navigation />

      <div className="w-full max-w-6xl mx-auto py-8 px-4 flex flex-col space-y-8">
        {/* Privacy Policy Content */}
        <div className="w-full bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
          <h1 className="text-3xl font-semibold">Privacy Policy</h1>
          <p className="text-gray-400 mb-4 text-sm">
            Welcome to Goldman Private. We value your privacy and are committed to protecting the personal information you share with us. This policy explains how we collect, use, and safeguard your personal data.
          </p>

          {/* Policy Content */}
          <div className="space-y-6 text-sm text-gray-300">
            <section>
              <h2 className="text-xl font-semibold">1. Introduction</h2>
              <p>
                This Privacy Policy outlines how Goldman Private (referred to as "we", "us", or "our") collects, uses, processes, and protects your personal information when you visit our website, use our services, or engage with us in any other way. We are fully committed to ensuring your data is protected in compliance with applicable laws and regulations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">2. Information We Collect</h2>
              <p>
                We collect personal information that you provide to us when you interact with our website and services. This information may include, but is not limited to:
              </p>
              <ul className="list-disc ml-8">
                <li><strong>Personal Identification Information:</strong> Name, email address, phone number, date of birth, gender, address.</li>
                <li><strong>Financial Information:</strong> Payment card details, billing address, and transaction history.</li>
                <li><strong>Communication Data:</strong> Messages, inquiries, feedback, and other communication forms submitted through our website.</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, and usage data collected through cookies and similar technologies.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
              <p>
                We use your personal information for the following purposes:
              </p>
              <ul className="list-disc ml-8">
                <li>To provide and manage our services, including responding to inquiries and delivering customer support.</li>
                <li>To process transactions, manage accounts, and ensure compliance with legal obligations.</li>
                <li>To improve our website and services through user feedback, and to monitor website usage for security purposes.</li>
                <li>To send marketing communications, newsletters, and promotional offers (only if you have opted-in to receive such communications).</li>
                <li>To comply with applicable laws, regulations, and legal processes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">4. How We Protect Your Information</h2>
              <p>
                We implement stringent security measures to protect your personal information, including encryption, secure data storage, and regular security audits. Access to personal data is restricted to authorized personnel only and is protected by industry-standard encryption protocols. We also employ firewalls, intrusion detection systems, and secure access controls to safeguard your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">5. Sharing Your Information</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. However, we may share your personal information in the following circumstances:
              </p>
              <ul className="list-disc ml-8">
                <li><strong>Third-Party Service Providers:</strong> We may share your information with trusted service providers who assist us in operating our website, conducting business activities, and providing services to you (e.g., payment processors, data analytics firms).</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of our assets, your personal information may be transferred as part of the transaction.</li>
                <li><strong>Legal Requirements:</strong> We may disclose your information when required by law or in response to valid legal requests by public authorities (e.g., law enforcement, regulatory bodies).</li>
                <li><strong>Consent:</strong> With your explicit consent, we may share your information for specific purposes not outlined in this policy.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">6. Data Retention</h2>
              <p>
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy or as required by law. Once the information is no longer required, we will securely delete or anonymize it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">7. User Rights</h2>
              <p>
                As a user, you have the following rights regarding your personal information:
              </p>
              <ul className="list-disc ml-8">
                <li><strong>Right to Access:</strong> You can request a copy of the personal information we hold about you.</li>
                <li><strong>Right to Rectification:</strong> You can request to update or correct any inaccurate information.</li>
                <li><strong>Right to Erasure:</strong> You may request the deletion of your personal information in certain circumstances.</li>
                <li><strong>Right to Object:</strong> You can object to the processing of your data for direct marketing or legitimate interests.</li>
                <li><strong>Right to Data Portability:</strong> You can request a copy of your personal data in a structured, commonly used format for transfer to another service provider.</li>
                <li><strong>Right to Withdraw Consent:</strong> If we are processing your data based on consent, you can withdraw that consent at any time without affecting the legality of prior processing.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">8. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies (e.g., web beacons, pixels) to enhance your experience on our website, personalize content, analyze usage patterns, and provide targeted advertising. Cookies are small files placed on your device to collect information about how you use our website.
              </p>
              <p>
                You can manage your cookie preferences by adjusting your browser settings to refuse cookies or alert you when a cookie is being sent. However, please note that disabling certain cookies may affect the functionality of our website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">9. International Data Transfers</h2>
              <p>
                Your personal information may be transferred to and processed in countries other than your own, including countries that may not offer the same level of data protection as your home country. By using our services, you consent to the transfer of your personal information to these countries, provided that appropriate safeguards are in place to protect your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">10. Changes to This Privacy Policy</h2>
              <p>
                We reserve the right to update and modify this Privacy Policy at any time. If we make significant changes to this policy, we will notify you by posting the updated version on our website with the "Last Updated" date at the top. We encourage you to review this policy periodically for any updates.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">11. Contact Us</h2>
              <p>
                If you have any questions or concerns about this Privacy Policy or how we handle your personal information, please contact us at:
              </p>
              <p>
                <strong>Email:</strong> support@goldmanprivate.com
              </p>
              <p>
                <strong>Phone:</strong> +44 7412 234258
              </p>
              <p>
                <strong>Address:</strong> 25 Shoe Ln, City of London, London EC4A 4AU, United Kingdom
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
