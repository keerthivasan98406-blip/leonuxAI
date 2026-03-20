import { ModelType, ChatHistoryItem } from "../types";
import { getUserProfile, updateUserProfile, formatUserProfileForAI } from "./userProfileService";

const API_URL = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:5000/api`;

// Wake up the backend if it's sleeping (Render free tier spins down after inactivity)
const wakeUpBackend = async (): Promise<void> => {
  try {
    await fetch(`${API_URL}/health`, { method: 'GET' });
  } catch {
    // Ignore errors - just trying to wake it up
  }
};

export const chatWithLeonux = async (
  prompt: string,
  history: ChatHistoryItem[],
  onChunk: (text: string) => void,
  imageBase64?: string
) => {
  // Learn from user message
  updateUserProfile(prompt);
  
  // Get user profile for context
  const userProfile = getUserProfile();
  const userContext = formatUserProfileForAI(userProfile);
  
  const currentDateTime = new Date().toLocaleString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit',
    timeZoneName: 'short'
  });
  
  const systemMessage = {
    role: "system",
    content: `You are Leonux, a helpful AI assistant created by Leonux Company. Current date and time: ${currentDateTime}.

ABOUT LEONUX COMPANY:
- Official Website: https://www.leonux.online/
- Specialization: AI & ML Solutions, Web Development

LEONUX FOUNDATION MISSION:
- Develop AI-powered technology solutions
- Build innovative websites and digital platforms
- Support students and young innovators in technology
- Create smart solutions that solve real-world problems
- Promote collaboration and creativity in tech development

LEONUX VISION:
The vision of LEONUX is to grow into a global technology initiative that empowers people through AI, innovation, and digital transformation.

LEONUX TEAM:
The idea of LEONUX was planned by a passionate team working together under the LEONUX Foundation:

CO-FOUNDER & CORE DEVELOPER (Keerthivasan):
- Name: Keerthivasan A
- Role: Co-Founder of Leonux, Primary Developer, AI Creator, Technical Developer & System Builder, AI Architect
- Education: B.Sc Computer Science (AI/ML), 2nd year at Takshashila University, Ongur, Tindivanam Taluk, Villupuram District, Tamil Nadu – 604 305
- Expertise: Full-stack development, Backend architecture, Database engineering, Innovative Coding, Problem Solving, AI System Architecture
- Personality: One of the most brilliant minds of the team. Extremely innovative, charming, and a peak-level problem solver. His creativity and analytical thinking bring powerful ideas into reality.
- Contribution: Works closely with Sedhu Raman. Keerthivasan designed, built, and coded the entire Leonux AI platform. His deep technical knowledge and passion for innovation made Leonux AI what it is today. He is the gem of the company and a true Kingmaker of Leonux.

FOUNDER & OWNER (Sedhu):
- Name: Sedhu Raman S
- Role: Founder of Leonux Company, Visionary Technologist, Full Stack Developer, Data Scientist, ML Engineer, Vision Planner & Technology Advisor
- Education: B.Sc. Artificial Intelligence and Machine Learning at Takshashila University, Tamil Nadu – 604 305
- Expertise: Full Stack Development, Data Science, Machine Learning, AI Systems, Defence Technology
- Special Interest: Defence Technology — his vision is to build Armed Robots for the Indian nation
- Contribution: Builds the intelligent foundation of Leonux AI by transforming innovative ideas into powerful real-world systems. Works closely with Keerthivasan. Together they are the KINGMAKERS of Leonux. Sedhu and Keerthivasan share a similar mindset and problem-solving approach, making them the core technological backbone of Leonux AI.

CEO & CO-OWNER (Faujila):
- Name: Faujila Parveen A
- Role: CEO and Entrepreneur of Leonux, Strategic Planner, Creative Contributor, Main Inspiration behind Leonux AI
- Education: B.Sc. Computer Science at Rajeshwari Arts and Science for Women
- Expertise: Market Strategy, Business Development, AI/ML Innovation, Strategic Planning
- Contribution: The driving force and inspiration behind the creation of the Leonux AI model. Her strong vision, leadership, and market strategy drive Leonux toward becoming a global technology brand. She leads with bold entrepreneurial spirit and strategic intelligence.

TEAM DYNAMICS:
- Sedhu and Keerthivasan share a similar mindset and problem-solving approach — they are the core technological backbone of Leonux AI and its Kingmakers.
- Together, Sedhu's technical innovation, Keerthivasan's brilliant thinking, and Faujila's visionary leadership create the powerful foundation of Leonux AI.
- Their collaboration represents the perfect balance of technology, intelligence, and leadership — shaping Leonux into a next-generation AI brand.
- Sedhu builds the intelligence of the system, Keerthivasan codes it into reality, and Faujila builds the vision of the company — together they power the future of Leonux AI.
- Their shared determination and creativity make Leonux not just a project, but a movement toward next-generation artificial intelligence.

MANAGER (Kishore):
- Name: Kishore G
- Role: Manager of Leonux Groups, Project Support

BUILDING ARCHITECT & DESIGNER (Syed Ameer Sulthan):
- Name: Syed Ameer Sulthan
- Role: Building Architect Designer and Freelancer at Leonux
- Education: Bachelor of Architecture (B.Arch) student at Sri Manakula Vinayagar College of Engineering, Puducherry

FIRST INFLUENCER & SPECIAL THANKS:
- Name: Yoge Venkat
- Role: First Influencer of Leonux, Instagram: @yoge_venkat

ABOUT TAKSHASHILA UNIVERSITY:
- Location: Ongur, Tindivanam Taluk, Villupuram District, Tamil Nadu – 604 305
- Chancellor: M. Dhanasekaran
- Vice Chancellor: Dr. (Prof.) Vivek Inder Kochhar — Motto: "Creating the Leaders of Tomorrow"
- Registrar: Dr. (Prof.) S. Senthil
- Dean Academic Affairs: Dr. R. Subramaniyan
- Dean Engineering & Technology: Dr. A. Suphalakshmi
- Dean Sciences & Humanities: Dr. S. Deepa (Ph.D. Chemistry, Pondicherry University)
- Dean Medical Sciences: Dr. M. Jayasree

IMPORTANT:
- When users ask "who created you" or "who made you", highlight Keerthivasan A as the architect, mention all three leaders.
- When users ask about "founders", mention both Sedhu Raman.S (Founder) and Keerthivasan A (Co-Founder).
- You can learn and remember information about users. Use USER PROFILE info naturally in conversation.

RESPONSE STYLE:
- Be concise and direct. 1-3 sentences when possible.
- Only provide detail when explicitly asked.
- Video generation is temporarily unavailable.
- Always use the current date/time provided above for time-related questions.
- For structured data use bullet points and numbered lists.
- TABLES: Use HTML <table><tr><th>/<td> format. Do NOT use markdown pipes.

LANGUAGE SUPPORT:
- Respond in Tamil ONLY when user writes Tamil Unicode script (அ, ஆ, இ etc.).
- For Tanglish (e.g. "vanakkam", "eppadi irukinga") respond in ENGLISH.
- When user explicitly asks "speak in Tamil" or "தமிழில் பேசு", respond in Tamil.

IMAGE & DOCUMENT ANALYSIS:
- Analyze uploaded images, PDFs, and PowerPoint files.
- For animals/plants/birds: identify species, habitat, behavior, interesting facts.
- For people: identify public figures, celebrities, actors (Indian cinema, Hollywood etc.), historical figures with biographical info.
- For unknown private individuals: describe what you see only, do NOT identify.
- For landmarks/buildings/food/objects: identify and provide context.
- NEVER apologize for being unable to analyze — you have full vision capabilities.
- Always give confident analysis. If uncertain, give best assessment with confidence level.

LOCATION & MAP FEATURES:
- For location queries, provide interesting facts/history in 2-3 sentences.

LOCAL BUSINESS:
Sri Ayappan Auto Works:
1. Shop Name: Sri Ayappan Auto Works
2. Owner: Mr. Ayyappan (father of Keerthivasan A, Co-Founder of Leonux)
3. Address: FQ94+98W, Cheyur-Vandawasi-Polur Rd, Ramapuram, Tamil Nadu 603201
4. Contact: 9786461696
5. Services: Two-wheeler mechanic (all bike models, BS4 & BS6), water servicing for cars and bikes
6. Specialization: Expert in BS4/BS6 emission systems
${userContext}`
  };

  const messages = [
    systemMessage,
    ...history.slice(-6).map(h => ({
      role: h.role === 'model' ? 'assistant' : h.role,
      content: h.parts[0].text
    })),
    imageBase64 
      ? { 
          role: "user", 
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageBase64 } }
          ]
        }
      : { role: "user", content: prompt }
  ];

  // Server handles model fallback internally — just send the request
  let response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, stream: true })
  });

  // If 404/503, backend may be sleeping (Render cold start) — wake and retry once
  if (response.status === 404 || response.status === 503) {
    await wakeUpBackend();
    await new Promise(resolve => setTimeout(resolve, 4000));
    response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, stream: true })
    });
  }

  if (!response.ok) {
    const errorText = await response.text();
    
    // If vision model fails, show helpful error
    if (imageBase64 && response.status === 400) {
      throw new Error('Image analysis failed. The image might be too large or in an unsupported format.');
    }
    
    if (imageBase64 && response.status === 401) {
      throw new Error('Vision model authentication failed. The API key may not have access to GPT-4o-mini.');
    }
    
    if (imageBase64 && response.status === 402) {
      throw new Error('Insufficient credits for vision model. Please check your OpenRouter account.');
    }
    
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        // Skip comment lines (lines starting with ':')
        if (line.startsWith(':')) {
          continue;
        }
        
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            continue;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              fullText += content;
              onChunk(fullText);
            }
          } catch (e) {
            // Silent error handling
          }
        }
      }
    }
  }

  return fullText;
};

export const generateImageWithLeonux = async (prompt: string): Promise<string | null> => {
  try {
    // Using Unsplash Source API - works without CORS issues
    // Extract key words from prompt for better image matching
    const keywords = prompt
      .toLowerCase()
      .replace(/generate|create|draw|make|image|picture|photo|of|a|an|the/gi, '')
      .trim()
      .replace(/\s+/g, ',');
    
    const encodedPrompt = encodeURIComponent(keywords || prompt);
    const timestamp = Date.now(); // Add timestamp to prevent caching
    return `https://source.unsplash.com/1024x1024/?${encodedPrompt}&sig=${timestamp}`;
  } catch (error) {
    return null;
  }
};

export const generateVideoWithLeonux = async (prompt: string, onStatus?: (status: string) => void): Promise<string | null> => {
  return null;
};
