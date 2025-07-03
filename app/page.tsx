"use client"

import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Wallet, ArrowRightLeft, TrendingUp, Star, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { useInView } from "react-intersection-observer"
import Navigation from "@/components/Navigation"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import Footer from "@/components/Footer"
import { Badge } from "@/components/ui/badge"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

export default function HomePage() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const floatAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  }

  // Steps data
  const steps = [
    {
      icon: Wallet,
      title: "Fund Your Wallet",
      description:
        "Securely deposit funds into your digital wallet using various payment methods, including bank transfers and cryptocurrencies.",
      color: "bg-gradient-to-r from-teal-500 to-emerald-500",
    },
    {
      icon: ArrowRightLeft,
      title: "Start Trading",
      description:
        "Access a diverse range of assets and execute trades with precision using our advanced yet user-friendly trading platform.",
      color: "bg-gradient-to-r from-violet-500 to-purple-500",
    },
    {
      icon: TrendingUp,
      title: "Earn Profits",
      description:
        "Watch your investments grow in real-time and withdraw your earnings effortlessly at any time that suits you.",
      color: "bg-gradient-to-r from-amber-500 to-orange-500",
    },
  ]

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Alison Salzer",
      role: "Teacher",
      quote:
        "If I had to describe Goldman Private in one word, it would be lifesaving. I lost access to my Trust Wallet and was devastated, but thanks to backing up my wallet with Goldman Private, I was able to recover it without any issues.",
      rating: 5,
      image: "/assets/test3.jpg",
    },
    {
      id: 2,
      name: "James Carter",
      role: "Marketing Director at StripeX",
      quote:
        "At first, I was skeptical, but after seeing how easy the backup feature was to integrate and how Goldman ensures top-notch security, I had a complete change of heart. Their attention to detail has truly impressed me.",
      rating: 4,
      image: "/assets/test2.jpg",
    },
    {
      id: 3,
      name: "Sophie Lee",
      role: "CEO at BrightTech",
      quote:
        "I've never seen such groundbreaking innovation! Goldman is revolutionizing quantum ledger technology, making it seamless and stress-free to use. Their product has truly set a new standard in the industry.",
      rating: 5,
      image: "/assets/test4.jpg",
    },
  ]

  // FAQs data
  const faqs = [
    {
      question: "What is a digital quantum ledger, and how does it protect my crypto wallet backups?",
      answer:
        "A digital quantum ledger is a highly secure system that leverages quantum computing to store and manage encrypted data, including crypto wallet backups. Unlike traditional systems, quantum encryption offers a level of security that is virtually unbreakable, even against future quantum computing threats. By using quantum-safe algorithms and advanced cryptographic techniques, our platform ensures that your crypto wallet backups are safe from hacking, data loss, or unauthorized access.",
    },
    {
      question: "How do I back up my crypto wallet on your platform?",
      answer:
        "Backing up your crypto wallet on our platform is simple and secure. First, you will need to create an account and verify your identity. Afterward, you can upload your wallet's private keys or recovery seed to our system. We then encrypt this information using quantum-safe encryption and store it in our digital quantum ledger. You can easily restore your wallet at any time by accessing your encrypted backup through your secure account.",
    },
    {
      question: "What happens if I lose access to my account or forget my recovery credentials?",
      answer:
        "If you lose access to your account or forget your recovery credentials, our platform offers a secure and reliable recovery process. We use multiple layers of security, including multi-factor authentication and encrypted backup keys, to ensure you can regain access to your wallet backup. Additionally, we offer a quantum-safe backup recovery option, where your recovery key is stored separately and can be retrieved through a secure recovery procedure.",
    },
    {
      question: "How does quantum technology enhance the security of my crypto wallet backup?",
      answer:
        "Quantum technology uses advanced encryption algorithms that are resistant to the threats posed by future quantum computers. While traditional encryption could potentially be broken by quantum computing advancements, our quantum ledger uses quantum-safe algorithms that ensure your crypto wallet backups remain secure, even as computing power advances. This future-proof security guarantees that your backups are safe for the long term, protecting you from evolving cyber threats.",
    },
    {
      question: "Can I back up multiple crypto wallets on your platform?",
      answer:
        "Yes, you can back up multiple crypto wallets on our platform. Whether you have Bitcoin, Ethereum, Solana, or other supported cryptocurrencies, you can securely store backups for each of your wallets separately. Our platform allows you to manage and organize multiple wallet backups, ensuring that each one is safely stored with the highest level of encryption.",
    },
    {
      question: "How much does it cost to use your crypto wallet backup service?",
      answer: "Totally Free",
    },
  ]

  // State for modals
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Refs for scroll animations
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [howItWorksRef, howItWorksInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [testimonialsRef, testimonialsInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [faqRef, faqInView] = useInView({ threshold: 0.1, triggerOnce: true })

  // Modal handlers
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
  const handleOpenWaitlistModal = () => setIsWaitlistModalOpen(true)
  const handleCloseWaitlistModal = () => setIsWaitlistModalOpen(false)

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch("/api/join-waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      if (response.ok) {
        setMessage("You have been added to the waitlist successfully!")
        setEmail("")
        setTimeout(() => {
          setMessage("")
          handleCloseWaitlistModal()
        }, 2000)
      } else {
        setMessage(data.message || "Failed to join the waitlist.")
      }
    } catch (error) {
      setMessage("An unexpected error occurred. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white overflow-hidden">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden" ref={heroRef}>
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-600/20 via-transparent to-purple-600/20 opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center mb-16"
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <motion.div
              className="inline-block mb-4"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
            >
              <Badge className="px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-emerald-500 to-teal-500 border-0 rounded-full">
                Next-Generation Security
              </Badge>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-200 to-white"
              variants={fadeIn}
            >
              Quantum Ledger for Secure Assets
            </motion.h1>

            <motion.p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto" variants={fadeIn}>
              Revolutionizing electronic assets security with quantum ledger technology that provides unparalleled
              protection for your digital wealth.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={staggerContainer}>
              <motion.div variants={fadeIn}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 rounded-full px-8 py-6 text-lg font-medium"
                  onClick={() => (window.location.href = "/login")}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-500 text-white hover:bg-gray-800 rounded-full px-8 py-6 text-lg font-medium bg-transparent"
                  onClick={openModal}
                >
                  See How it Works
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Floating Dashboard Preview */}
          <motion.div
            className="relative mx-auto max-w-5xl"
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, delay: 0.3 },
              },
            }}
          >
            <div className="relative z-10 bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
              <div className="p-1 bg-gradient-to-r from-emerald-500 to-purple-500 rounded-t-2xl">
                <div className="flex items-center gap-2 px-4 py-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-4 text-xs font-medium text-white">Goldman Private - Quantum Ledger Dashboard</div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-medium">Portfolio Overview</h3>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-0">+4.85%</Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-800/80 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
                            <span className="font-bold">₿</span>
                          </div>
                          <div>
                            <p className="font-medium">Bitcoin</p>
                            <p className="text-xs text-gray-400">BTC</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">$32,420.00</p>
                          <p className="text-xs text-emerald-400">+2.4%</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-gray-800/80 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center">
                            <span className="font-bold">Ξ</span>
                          </div>
                          <div>
                            <p className="font-medium">Ethereum</p>
                            <p className="text-xs text-gray-400">ETH</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">$1,840.00</p>
                          <p className="text-xs text-emerald-400">+3.7%</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-gray-800/80 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center">
                            <span className="font-bold">SOL</span>
                          </div>
                          <div>
                            <p className="font-medium">Solana</p>
                            <p className="text-xs text-gray-400">SOL</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">$1,120.00</p>
                          <p className="text-xs text-emerald-400">+5.2%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-lg font-medium mb-6">Recent Transactions</h3>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-800/80 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <ArrowRightLeft className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">Send</p>
                            <p className="text-xs text-gray-400">To: Arthur</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-red-400">-49.88 USDT</p>
                          <p className="text-xs text-gray-400">Today</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-gray-800/80 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
                            <ArrowRightLeft className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">Receive</p>
                            <p className="text-xs text-gray-400">From: Collen</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-emerald-400">+98.34 USDT</p>
                          <p className="text-xs text-gray-400">Today</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-gray-800/80 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">Swap</p>
                            <p className="text-xs text-gray-400">ETH → BTC</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">0.5 ETH</p>
                          <p className="text-xs text-gray-400">Yesterday</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <motion.div
              className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-xl opacity-30"
              animate={floatAnimation}
            ></motion.div>
            <motion.div
              className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full blur-xl opacity-30"
              animate={{
                y: [0, 10, 0],
                transition: {
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                },
              }}
            ></motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative" ref={featuresRef}>
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-16"
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <Badge className="px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-purple-500 to-violet-500 border-0 rounded-full mb-4">
              OMNI-SECURITY
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Redefining Digital Asset Protection</h2>
            <p className="text-xl text-gray-300">
              Goldman Private is a revolutionary technology designed to safeguard and backup your wallet with
              unparalleled precision. Powered by an omni-layered security ledger, it integrates advanced cryptographic
              protocols for ultimate protection.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 backdrop-blur-sm relative overflow-hidden group"
                variants={fadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className={`absolute top-0 left-0 w-full h-1 ${step.color}`}></div>
                <div className={`w-16 h-16 ${step.color} rounded-xl flex items-center justify-center mb-6`}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-white/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative" ref={howItWorksRef}>
        <div className="container mx-auto px-4">
          <motion.div
            className="grid md:grid-cols-2 gap-16 items-center"
            initial="hidden"
            animate={howItWorksInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <Badge className="px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-teal-500 to-emerald-500 border-0 rounded-full mb-4">
                TECHNOLOGY
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Navigate Your Financial Future with Confidence</h2>
              <p className="text-xl text-gray-300 mb-8">
                Discover Tailored Solutions, Gain Invaluable Insights, and Navigate Your Path to Financial Independence
                with Confidence and Peace of Mind.
              </p>

              <div className="space-y-6">
                {[
                  "Quantum-resistant encryption protects against future threats",
                  "Multi-signature authentication for enhanced security",
                  "Decentralized backup system prevents single points of failure",
                  "Automated recovery protocols for seamless asset restoration",
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={howItWorksInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <div className="mt-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full p-1">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-gray-200">{item}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div className="mt-10" variants={fadeIn}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 rounded-full px-8 py-6 text-lg font-medium"
                  onClick={() => (window.location.href = "/login")}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>

            <motion.div className="relative" variants={fadeIn}>
              <div className="relative z-10 bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700 shadow-xl">
                <div className="p-8">
                  <div className="flex justify-center mb-8">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg blur opacity-25"></div>
                      <div className="relative bg-gray-800 rounded-lg p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <span className="text-emerald-400">1</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Secure Wallet Connection</h4>
                          <p className="text-sm text-gray-400">Connect your wallet through our encrypted channel</p>
                        </div>
                      </div>
                    </div>

                    <div className="h-8 border-l-2 border-dashed border-gray-600 ml-5"></div>

                    <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <span className="text-purple-400">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Quantum Encryption</h4>
                        <p className="text-sm text-gray-400">
                          Your data is encrypted using quantum-resistant algorithms
                        </p>
                      </div>
                    </div>

                    <div className="h-8 border-l-2 border-dashed border-gray-600 ml-5"></div>

                    <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <span className="text-amber-400">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Distributed Storage</h4>
                        <p className="text-sm text-gray-400">Backup is stored across multiple secure locations</p>
                      </div>
                    </div>

                    <div className="h-8 border-l-2 border-dashed border-gray-600 ml-5"></div>

                    <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                        <span className="text-teal-400">4</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Instant Recovery</h4>
                        <p className="text-sm text-gray-400">Restore your wallet with a few clicks when needed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <motion.div
                className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-xl opacity-30"
                animate={floatAnimation}
              ></motion.div>
              <motion.div
                className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full blur-xl opacity-30"
                animate={{
                  y: [0, 10, 0],
                  transition: {
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  },
                }}
              ></motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative" ref={testimonialsRef}>
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-16"
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <Badge className="px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-amber-500 to-orange-500 border-0 rounded-full mb-4">
              TESTIMONIALS
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What our customers say about us</h2>
            <p className="text-xl text-gray-300">
              Hear from our satisfied users who have experienced the security and peace of mind that Goldman Private
              provides.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            variants={fadeIn}
            className="relative"
          >
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              className="testimonial-swiper pb-16"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 backdrop-blur-sm h-full flex flex-col">
                    <div className="mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`inline-block h-5 w-5 ${
                            i < testimonial.rating ? "text-amber-400 fill-amber-400" : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-6 flex-grow">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden">
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{testimonial.name}</h4>
                        <p className="text-sm text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 relative" ref={faqRef}>
        <div className="container mx-auto px-4">
          <motion.div
            className="grid md:grid-cols-2 gap-16 items-start"
            initial="hidden"
            animate={faqInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <Badge className="px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-violet-500 to-purple-500 border-0 rounded-full mb-4">
                FAQ's
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-300 mb-8">
                Here, we've compiled answers to some common questions about our crypto wallet backup service and how our
                digital quantum ledger ensures the highest level of security for your assets.
              </p>

              <div className="relative mt-16 hidden md:block">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
                <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                  <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
                  <p className="text-gray-300 mb-6">
                    Our team is here to help you with any questions you may have about our services.
                  </p>
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 rounded-full">
                    Contact Support
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border border-gray-700 bg-gray-800/50 rounded-xl overflow-hidden"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex justify-between items-center w-full text-left">
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-gray-300">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="relative mt-8 md:hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
                <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold mb-4">Still have questions?</h3>
                  <p className="text-gray-300 mb-6">
                    Our team is here to help you with any questions you may have about our services.
                  </p>
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 rounded-full w-full">
                    Contact Support
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-br from-emerald-500/10 to-purple-500/10 rounded-3xl blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl overflow-hidden border border-gray-700 shadow-2xl">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-purple-500"></div>
            <div className="p-8 md:p-16 text-center">
              <Badge className="px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-emerald-500 to-teal-500 border-0 rounded-full mb-4">
                GET STARTED TODAY
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Trade with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                  GoldmanX
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
                Create your account and gain access to seamless crypto wallet management and transactions. Get ready to
                experience a new way of handling your digital assets — coming soon.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 rounded-full px-8 py-6 text-lg font-medium"
                  onClick={handleOpenWaitlistModal}
                >
                  Join the Waitlist
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-500 text-white hover:bg-gray-800 rounded-full px-8 py-6 text-lg font-medium bg-transparent"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* How It Works Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <motion.div
            className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="p-1 bg-gradient-to-r from-emerald-500 to-purple-500 rounded-t-2xl">
              <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-sm font-medium text-white">How It Works</div>
                <div></div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                How the Next-Gen Quantum Backup Ledger Works
              </h2>

              <div className="mb-8">
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-8">
                  <div className="flex flex-col items-center">
                    <div className="w-full max-w-3xl">
                      <div className="flex justify-between items-center mb-8">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 text-emerald-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                          </div>
                          <span className="text-sm text-emerald-400">Wallet</span>
                        </div>

                        <div className="flex-1 mx-4 relative">
                          <div className="h-1 bg-gradient-to-r from-emerald-500 to-purple-500 rounded-full"></div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gray-800 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                            <ArrowRight className="h-3 w-3 text-emerald-500" />
                          </div>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 text-purple-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                              />
                            </svg>
                          </div>
                          <span className="text-sm text-purple-400">Encryption</span>
                        </div>

                        <div className="flex-1 mx-4 relative">
                          <div className="h-1 bg-gradient-to-r from-purple-500 to-amber-500 rounded-full"></div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gray-800 rounded-full border-2 border-purple-500 flex items-center justify-center">
                            <ArrowRight className="h-3 w-3 text-purple-500" />
                          </div>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 text-amber-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                              />
                            </svg>
                          </div>
                          <span className="text-sm text-amber-400">Storage</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 text-gray-300">
                  <p>
                    The next-gen quantum backup ledger uses advanced encryption techniques leveraging quantum computing
                    principles to secure your wallets and transactions. This ensures your assets are protected against
                    even the most sophisticated attacks, including quantum attacks.
                  </p>

                  <h3 className="text-xl font-semibold text-white">Key Features:</h3>

                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="mt-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full p-1 flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <p>
                        <span className="font-medium text-white">Quantum Encryption:</span> Your wallet data is
                        encrypted using quantum-resistant algorithms that can withstand attacks from future quantum
                        computers.
                      </p>
                    </li>

                    <li className="flex items-start gap-3">
                      <div className="mt-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full p-1 flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <p>
                        <span className="font-medium text-white">Distributed Storage:</span> Your encrypted backup is
                        split and stored across multiple secure locations, eliminating single points of failure.
                      </p>
                    </li>

                    <li className="flex items-start gap-3">
                      <div className="mt-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full p-1 flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <p>
                        <span className="font-medium text-white">Multi-Factor Authentication:</span> Multiple layers of
                        verification ensure only you can access your backup.
                      </p>
                    </li>

                    <li className="flex items-start gap-3">
                      <div className="mt-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full p-1 flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <p>
                        <span className="font-medium text-white">Automated Sync:</span> The system automatically syncs
                        and encrypts wallet data across multiple devices, providing a seamless and secure user
                        experience.
                      </p>
                    </li>
                  </ul>

                  <p>
                    When you need to recover your wallet, our secure recovery process verifies your identity through
                    multiple authentication factors before restoring your assets, ensuring only you have access to your
                    funds.
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={closeModal}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 rounded-full px-8"
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Waitlist Modal */}
      {isWaitlistModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <motion.div
            className="bg-gray-900 rounded-2xl max-w-md w-full border border-gray-700"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="p-1 bg-gradient-to-r from-emerald-500 to-purple-500 rounded-t-2xl">
              <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-sm font-medium text-white">Join the Waitlist</div>
                <div></div>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Get Early Access</h2>
              <p className="text-gray-300 mb-6">
                Be among the first to experience our revolutionary quantum ledger technology. Enter your email to join
                our waitlist.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                {message && (
                  <div
                    className={`p-3 rounded-lg ${message.includes("success") ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}
                  >
                    {message}
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseWaitlistModal}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0"
                  >
                    {isLoading ? "Sending..." : "Join Now"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
