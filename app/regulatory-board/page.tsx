"use client";
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const RegulatoryBoard = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [licenseToView, setLicenseToView] = useState("");

    const openModal = (license: string) => {
        setLicenseToView(license);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setLicenseToView("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black text-white flex flex-col">
            {/* Navigation Component */}
            <Navigation />

            <div className="w-full max-w-6xl mx-auto py-8 px-4 flex flex-col space-y-8">
                {/* Regulatory Board Content */}
                <div className="w-full bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
                    <h1 className="text-3xl font-semibold">Regulatory Board</h1>
                    <p className="text-gray-400 mb-4 text-sm">
                        Goldman Private Quantum Ledger operates with full compliance with the laws and regulations in the UK and the United States. Our business practices are verified and approved by various regulatory bodies. Below is the list of licenses, certifications, and regulatory authorities that govern our operations.
                    </p>

                    {/* Regulatory Information */}
                    <div className="space-y-6 text-sm text-gray-300">
                        <section>
                            <h2 className="text-xl font-semibold">1. Regulatory Compliance</h2>
                            <p>
                                Goldman Private Quantum Ledger adheres to all applicable UK and US laws and regulations governing digital currencies, blockchain technology, and financial services. We have obtained the necessary licenses to operate legally in both the UK and the US, ensuring transparency, accountability, and security in our services.
                            </p>
                            <p>
                                We comply with the following key regulations:
                            </p>
                            <ul className="list-disc ml-8">
                                <li>Financial Services and Markets Act 2000 (FSMA)</li>
                                <li>Data Protection Act 2018 (DPA) and GDPR</li>
                                <li>Anti-Money Laundering (AML) regulations</li>
                                <li>FCA (Financial Conduct Authority) regulations</li>
                                <li>UK Cryptoasset Regulation and Licensing Framework</li>
                                <li>U.S. Department of Treasury’s Financial Crimes Enforcement Network (FinCEN) regulations</li>
                                <li>U.S. Securities and Exchange Commission (SEC) regulations for cryptocurrency activities</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold">2. Licenses and Certifications</h2>
                            <p>
                                Goldman Private Quantum Ledger holds the following licenses and certifications that allow us to legally operate within the UK and the United States:
                            </p>
                            <ul className="list-disc ml-8">
                                <li>
                                    <strong>FCA Registration (UK):</strong> Authorized and regulated by the Financial Conduct Authority (FCA) for providing regulated activities in cryptoassets and financial services.
                                    <button
                                        onClick={() => openModal('FCA')}
                                        className="text-blue-400 mt-2 inline-block">View License</button>
                                </li>
                                <li>
                                    <strong>ICO Certification (UK):</strong> Certified by the Information Commissioner's Office (ICO) for ensuring data protection and privacy compliance in accordance with GDPR.
                                    <button
                                        onClick={() => openModal('ICO')}
                                        className="text-blue-400 mt-2 inline-block">View License</button>
                                </li>
                                <li>
                                    <strong>AML Compliance (UK):</strong> Registered with HMRC for Anti-Money Laundering (AML) compliance and customer due diligence procedures.
                                    <button
                                        onClick={() => openModal('AML')}
                                        className="text-blue-400 mt-2 inline-block">View License</button>
                                </li>
                                <li>
                                    <strong>MiCA Compliance (EU):</strong> Fully compliant with the European Union's Markets in Crypto-Assets (MiCA) framework, ensuring the legality of cross-border crypto transactions.
                                    <button
                                        onClick={() => openModal('MiCA')}
                                        className="text-blue-400 mt-2 inline-block">View License</button>
                                </li>
                                <li>
                                    <strong>FinCEN Registration (US):</strong> Registered with the U.S. Department of Treasury’s Financial Crimes Enforcement Network (FinCEN) as a money services business (MSB).
                                    <button
                                        onClick={() => openModal('FinCEN')}
                                        className="text-blue-400 mt-2 inline-block">View License</button>
                                </li>
                                <li>
                                    <strong>SEC Compliance (US):</strong> Compliant with U.S. Securities and Exchange Commission (SEC) regulations for cryptocurrency activities, ensuring full legal adherence in the U.S. market.
                                    <button
                                        onClick={() => openModal('SEC')}
                                        className="text-blue-400 mt-2 inline-block">View License</button>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold">3. Regulatory Authorities</h2>
                            <p>
                                Our business is overseen by the following key regulatory bodies, ensuring our compliance with UK and U.S. standards:
                            </p>
                            <ul className="list-disc ml-8">
                                <li><strong>Financial Conduct Authority (FCA):</strong> The FCA is responsible for regulating financial markets in the UK, including overseeing cryptocurrency and blockchain businesses.</li>
                                <li><strong>Her Majesty's Revenue and Customs (HMRC):</strong> HMRC regulates tax, financial crime prevention, and enforces anti-money laundering regulations.</li>
                                <li><strong>Information Commissioner's Office (ICO):</strong> The ICO ensures that data protection and privacy regulations, such as GDPR, are followed.</li>
                                <li><strong>National Cyber Security Centre (NCSC):</strong> NCSC provides guidance on cybersecurity measures and risks, which we follow to protect our services.</li>
                                <li><strong>U.S. Securities and Exchange Commission (SEC):</strong> SEC regulates U.S. cryptocurrency activities and ensures compliance with federal securities laws.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold">4. Commitment to Transparency and Security</h2>
                            <p>
                                Goldman Private Quantum Ledger is committed to ensuring the highest levels of security and transparency in our services. We regularly conduct audits and security assessments to guarantee that our operations are secure and compliant with all regulations.
                            </p>
                            <p>
                                Our security practices include:
                            </p>
                            <ul className="list-disc ml-8">
                                <li>Regular third-party security audits and compliance checks.</li>
                                <li>Implementation of industry-standard encryption protocols to protect user data and transactions.</li>
                                <li>Strict internal controls to prevent fraud and ensure ethical operations.</li>
                                <li>Customer due diligence and KYC (Know Your Customer) procedures to verify the identity of our clients.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold">5. Partnering with Trusted Institutions</h2>
                            <p>
                                Goldman Private Quantum Ledger works with a range of accredited financial institutions and trusted technology partners to deliver our services. These partnerships help us maintain the integrity and security of our operations while ensuring compliance with all legal requirements.
                            </p>
                            <ul className="list-disc ml-8">
                                <li>Partnerships with leading banks for secure transaction processing.</li>
                                <li>Collaboration with cybersecurity firms to ensure robust protection of assets and data.</li>
                                <li>Support from legal advisors to maintain compliance with evolving regulations.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold">6. Legal Disclaimer</h2>
                            <p>
                                While Goldman Private Quantum Ledger strives to maintain full compliance with UK and U.S. regulations, it is important to note that laws related to blockchain and cryptocurrency are continually evolving. We advise our users to seek independent legal advice before engaging in any activities that may involve legal or regulatory implications.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold">7. Contact Us</h2>
                            <p>
                                For more information regarding our regulatory compliance, licenses, or certifications, please do not hesitate to contact us:
                            </p>
                            <p>
                                <strong>Email:</strong> compliance@goldmanprivate.com
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

            {/* Modal to View License */}
            {isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <div className="bg-gray-800 p-6 rounded-lg w-1/3">  {/* Adjusted width here */}
                        <h2 className="text-xl font-semibold mb-4">License Certificate: {licenseToView}</h2>
                        <div className="text-center">
                            <p>Here is the certificate for {licenseToView}.</p>
                            {/* Embed the certificate image or document (could be an image file or PDF) */}
                            <div className="mt-4">
                                <img src={`/licenses/${licenseToView.toLowerCase()}-license.jpeg`} alt={`${licenseToView} Certificate`} className="max-w-full h-auto" />
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <button onClick={closeModal} className="bg-blue-500 text-white px-4 py-2 rounded">Close</button>
                        </div>
                    </div>
                </div>
            )}


            {/* Footer Component */}
            <Footer />
        </div>
    );
};

export default RegulatoryBoard;
