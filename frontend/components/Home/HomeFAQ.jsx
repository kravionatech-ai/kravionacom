"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What does it mean that Kraviona is an AI-first technology company?",
    answer:
      "Kraviona is an AI-first technology company that combines artificial intelligence, intelligent automation, and custom software engineering. We help businesses build intelligent software, deploy autonomous AI agents, automate manual workflows, and scale modern web applications.",
  },
  {
    question: "What AI and automation solutions does Kraviona develop?",
    answer:
      "We develop custom AI agents, enterprise chatbots, workflow automation pipelines (using LangChain, LlamaIndex, n8n), RAG-based knowledge retrieval systems, intelligent document processing, and predictive business intelligence tools.",
  },
  {
    question: "Can Kraviona integrate AI into our existing web applications or CRM?",
    answer:
      "Yes. We specialize in enterprise AI integration. We embed LLM capabilities, vector search, automated data pipelines, and intelligent assistant interfaces directly into existing codebases and cloud infrastructure.",
  },
  {
    question: "What is Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO)?",
    answer:
      "AEO and GEO optimize your digital brand to appear as cited answers and authoritative recommendations inside AI search engines such as Perplexity, ChatGPT, Google Gemini, and Claude, backed by technical SEO and structured Schema graphs.",
  },
  {
    question: "Can you build AI-powered SaaS MVPs for startups?",
    answer:
      "Yes. We build full-lifecycle SaaS MVPs in 4 to 8 weeks, complete with secure authentication, multi-tenancy, Stripe billing, LLM model integration, and scalable database architecture.",
  },
  {
    question: "How do you protect business data privacy when implementing AI solutions?",
    answer:
      "We implement private enterprise AI models and secure vector databases with strict access boundaries, ensuring your proprietary customer data is never leaked or used to train public foundation models.",
  },
  {
    question: "How does Kraviona's founder-led engineering approach benefit clients?",
    answer:
      "Clients work directly with lead engineers without junior layers or account manager telephone games. You get transparent communication, production-grade code, weekly milestone demos, and reliable post-launch support.",
  },
  {
    question: "What is your pricing model for AI and software projects?",
    answer:
      "We offer flexible pricing: fixed-price for scoped milestones, dedicated sprint retainers for evolving AI & SaaS products, and enterprise SLAs. Every project starts with a free 30-minute discovery call to map technical feasibility and provide an accurate scope.",
  },
];

const HomeFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => setOpenIndex(openIndex === index ? null : index);

  return (
    <section
      className="py-20 md:py-28 bg-[#FEFCF9] relative overflow-hidden"
      aria-labelledby="faq-heading"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      {/* Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(#1A3840 1.5px, transparent 1.5px)",
            backgroundSize: "26px 26px",
          }}
        />
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#EAF3F5]/60 blur-3xl rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-5"
          >
            <span className="w-8 h-[2px] bg-[#2D6E7A]" aria-hidden="true" />
            <span className="text-[#2D6E7A] font-semibold uppercase tracking-[0.2em] text-xs">
              Got Questions?
            </span>
            <span className="w-8 h-[2px] bg-[#2D6E7A]" aria-hidden="true" />
          </motion.div>

          <motion.h2
            id="faq-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A3840] tracking-tight mb-4"
          >
            Frequently Asked{" "}
            <span className="text-[#2D6E7A]">
              Questions
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 }}
            className="text-[#5A7A82] text-base md:text-lg max-w-xl mx-auto leading-relaxed"
          >
            Everything you need to know about MERN Stack development, Technical
            SEO, and how Kraviona can grow your business.
          </motion.p>
        </div>

        {/* FAQ Accordion */}
        <ul className="space-y-3" aria-label="Frequently Asked Questions">
          {faqs.map((faq, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.055 }}
              className={`border rounded-[12px] overflow-hidden transition-all duration-300 bg-[#FEFCF9] ${
                openIndex === index
                  ? "border-[#2D6E7A]/40 shadow-sm"
                  : "border-[#E8E4DE] hover:border-[#2D6E7A]/30"
              }`}
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <button
                onClick={() => toggle(index)}
                id={`faq-btn-${index}`}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-[#FEFCF9] transition-colors duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6E7A]/40"
              >
                <span
                  itemProp="name"
                  className={`font-semibold text-base md:text-[17px] leading-snug transition-colors duration-200 pr-2 ${
                    openIndex === index
                      ? "text-[#2D6E7A]"
                      : "text-[#1A3840] group-hover:text-[#2D6E7A]"
                  }`}
                >
                  {faq.question}
                </span>
                <div
                  className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                    openIndex === index
                      ? "bg-[#2D6E7A] text-white"
                      : "bg-[#EAF3F5] text-[#2D6E7A] group-hover:bg-[#2D6E7A] group-hover:text-white"
                  }`}
                  aria-hidden="true"
                >
                  {openIndex === index ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-btn-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                  >
                    <div className="px-6 pb-6 pt-3 border-t border-[#E8E4DE]">
                      <p
                        itemProp="text"
                        className="text-[#5A7A82] leading-relaxed text-sm md:text-base"
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </ul>
        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 md:mt-14 text-center"
        >
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-[#EAF3F5] rounded-[20px] border border-[#E8E4DE] mb-6">
            <HelpCircle className="w-5 h-5 text-[#2D6E7A]" aria-hidden="true" />
            <p className="text-[#5A7A82] text-sm font-medium">
              Still have questions? We&apos;re happy to help.
            </p>
          </div>
          <div>
            <a
              href="/contact"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#C85A3C] hover:bg-[#B04D31] text-white font-semibold rounded-[6px] transition-all duration-200 shadow-brand-sm hover:-translate-y-0.5 text-sm"
            >
              Contact Our Team
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeFAQ;
