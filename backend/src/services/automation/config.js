import dotenv from "dotenv";
dotenv.config();

export const AUTOMATION_CONFIG = {
  siteUrl: "https://www.kraviona.com",
  brandName: "Kraviona Tech Solutions",
  brandTagline: "Building technology. Creating possibilities.",
  brandPositioning: [
    "Modern Web Development",
    "MERN Stack Development",
    "Next.js Development",
    "Backend & API Engineering",
    "Technical SEO & Digital Growth",
    "AI Automation & Optimization"
  ],
  timezone: "Asia/Kolkata",
  minWordCount: 1200,
  minSeoScore: 90,
  maxZeroGptAllowed: 10, // Max 10%
  
  defaultAuthor: {
    userID: "69d71638f2a8df1130724898",
    name: "Amar Kumar",
    email: "kravionatech@gmail.com",
    username: "amar2mail9",
    jobTitle: "Founder and Lead Engineer, Kraviona Tech Solutions",
    bio: "Amar Kumar is the Founder and Lead Engineer at Kraviona Tech Solutions, specializing in MERN stack development, AI automation, and technical SEO. He has built and scaled web platforms for businesses across India and has written extensively on artificial intelligence, machine learning, and emerging web technologies.",
    avatar: "https://res.cloudinary.com/dybydsegx/image/upload/v1787281491/kravionatech/images/aews0bxyduivzmua1g2j.webp",
    linkedInUrl: "https://www.linkedin.com/in/amarkumar96085/",
    sameAs: [
      "https://www.linkedin.com/in/amarkumar96085/",
      "https://twitter.com/KravionaTech"
    ]
  },

  categoryMap: {
    "mern-stack": {
      id: "6a4927ee402e4016db913ce4",
      name: "mern stack",
      slug: "mern-stack"
    },
    "technical-seo": {
      id: "6a492871402e4016db913cea",
      name: "technical seo",
      slug: "technical-seo"
    },
    "web-performance": {
      id: "6a492b22402e4016db913d12",
      name: "web performance",
      slug: "web-performance"
    },
    "ai-and-automation": {
      id: "69d85d92457107290d56e0f1",
      name: "ai and automation",
      slug: "ai-and-automation"
    },
    "next-gen-web-development": {
      id: "69d85e86457107290d56e101",
      name: "next gen web development",
      slug: "next-gen-web-development"
    },
    "devops-and-cloud": {
      id: "6a8d7a0a484ae4887596fcdd",
      name: "devops and cloud",
      slug: "devops-and-cloud"
    }
  },

  // Scoring weights specified in requirements
  scoringWeights: {
    searchIntent: 15,
    contentQuality: 20,
    keywordOptimization: 10,
    onPageSeo: 15,
    technicalSeo: 10,
    geoReadiness: 15,
    internalLinking: 5,
    imageOptimization: 5,
    readabilityOriginality: 5
  }
};

export default AUTOMATION_CONFIG;
