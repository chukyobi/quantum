"use client";
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const TermsCondition = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black text-white flex flex-col">
      {/* Navigation Component */}
      <Navigation />

      <div className="w-full max-w-6xl mx-auto py-8 px-4 flex flex-col space-y-8">
        {/* Terms and Conditions Content */}
        <div className="w-full bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
          <h1 className="text-3xl font-semibold">Terms and Conditions</h1>
          <p className="text-gray-400 mb-4 text-sm">
            Welcome to Goldman Private. Please read these Terms and Conditions carefully before using our services. By accessing or using our website and services, you agree to comply with and be bound by these terms.
          </p>

          {/* Terms and Conditions Content */}
          <div className="space-y-6 text-sm text-gray-300">
            <section>
              <h2 className="text-xl font-semibold">1. Introduction</h2>
              <p>
                These Terms and Conditions govern your use of Goldman Private’s website, services, and products (collectively referred to as "Services"). By accessing or using our Services, you agree to be bound by these terms. If you do not agree with any part of these terms, you must not use our Services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">2. Eligibility</h2>
              <p>
                To use our Services, you must be at least 18 years of age or have the consent of a legal guardian. By using our Services, you represent and warrant that you meet these eligibility requirements. If you are using the Services on behalf of a business entity, you represent that you have the authority to bind that entity to these Terms and Conditions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">3. Services Provided</h2>
              <p>
                Goldman Private provides a wide range of services, including but not limited to financial consulting, investment management, and secure online transaction processing. We strive to offer high-quality services; however, we do not guarantee uninterrupted access or error-free performance. We may modify, suspend, or discontinue our Services at any time without notice.
              </p>
              <p>
                We may also introduce new features or services, which will be subject to these Terms and Conditions unless otherwise stated.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">4. User Responsibilities</h2>
              <p>
                As a user of Goldman Private’s Services, you agree to:
              </p>
              <ul className="list-disc ml-8">
                <li>Provide accurate, current, and complete information when required during registration or transactions.</li>
                <li>Maintain the confidentiality of your account information, including passwords and login details.</li>
                <li>Comply with all applicable local, national, and international laws when using our Services.</li>
                <li>Not use our Services for any unlawful or fraudulent purposes.</li>
                <li>Not engage in activities that could harm, disable, overburden, or impair our Services or interfere with other users’ access to the Services.</li>
                <li>Not attempt to gain unauthorized access to our servers or networks.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">5. Account Security</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to immediately notify Goldman Private of any unauthorized use of your account or any other security breaches.
              </p>
              <p>
                Goldman Private is not liable for any loss or damage resulting from your failure to comply with this section.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">6. Intellectual Property</h2>
              <p>
                All content on the Goldman Private website, including but not limited to logos, graphics, text, and software, is the property of Goldman Private or its licensors and is protected by copyright laws. You are granted a limited, non-exclusive, non-transferable license to access and use our Services for personal or internal business purposes only.
              </p>
              <p>
                You may not copy, modify, distribute, sell, or lease any part of our intellectual property, nor may you reverse-engineer or attempt to extract the source code of any software we provide unless you have obtained explicit permission from Goldman Private.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">7. Payment Terms</h2>
              <p>
                All payments for services provided by Goldman Private must be made in accordance with the payment terms specified on the website or in any relevant agreement. You agree to pay all applicable fees for the Services you access and use, including taxes and other charges.
              </p>
              <p>
                Payment transactions are processed through third-party payment processors, and Goldman Private is not responsible for any payment errors or failures. You agree to provide accurate payment information and authorize us to charge the applicable fees to your chosen payment method.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">8. Limitations of Liability</h2>
              <p>
                Goldman Private strives to ensure the accuracy and reliability of its Services, but we make no representations or warranties regarding the accuracy, completeness, or reliability of the content or Services provided. 
              </p>
              <p>
                In no event shall Goldman Private be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, revenue, data, or use, whether in an action of contract, tort (including negligence), or otherwise, arising from your use or inability to use the Services, even if we have been advised of the possibility of such damages.
              </p>
              <p>
                Our liability to you for any claim arising from your use of the Services is limited to the amount you paid for the Service that gave rise to the claim, provided that such a claim is made within a reasonable time frame.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">9. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Goldman Private, its affiliates, officers, directors, employees, agents, and licensors from any claims, liabilities, damages, losses, costs, or expenses (including attorneys' fees) arising out of or related to your breach of these Terms and Conditions or your use of the Services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">10. Dispute Resolution</h2>
              <p>
                Any disputes arising from or in connection with these Terms and Conditions shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association (AAA), or an alternative arbitration body that is mutually agreed upon by the parties involved.
              </p>
              <p>
                The arbitration shall take place in a mutually agreed location, and the decision of the arbitrator shall be final and binding. You agree that any dispute resolution proceedings will be conducted on an individual basis and not as part of any class or representative action.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">11. Termination</h2>
              <p>
                Goldman Private reserves the right to suspend or terminate your access to our Services at any time, with or without notice, if you violate any terms of this agreement or if we deem it necessary to protect the integrity of our Services. Upon termination, your right to access the Services will immediately cease, and any outstanding payments will become due.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">12. Changes to Terms and Conditions</h2>
              <p>
                Goldman Private reserves the right to modify, update, or change these Terms and Conditions at any time. Any changes will be posted on this page, and the "Last Updated" date will be updated accordingly. It is your responsibility to review these terms periodically to stay informed of any updates.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">13. Governing Law</h2>
              <p>
                These Terms and Conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which Goldman Private is registered, without regard to its conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">14. Contact Us</h2>
              <p>
                If you have any questions or concerns regarding these Terms and Conditions, please contact us at:
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

export default TermsCondition;
