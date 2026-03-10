import { ModelType, ChatHistoryItem } from "../types";
import { getUserProfile, updateUserProfile, formatUserProfileForAI } from "./userProfileService";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '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';

// Debug logging for API key (only show first/last 4 characters for security)
const debugKey = OPENROUTER_API_KEY ? `${OPENROUTER_API_KEY.slice(0, 8)}...${OPENROUTER_API_KEY.slice(-8)}` : 'NOT_FOUND';
console.log('API Key Status:', debugKey);

if (!OPENROUTER_API_KEY) {
  console.error('OpenRouter API key not found. Please set VITE_OPENROUTER_API_KEY in your environment variables.');
}

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

COMPANY LEADERSHIP:

LEONUX TEAM:
The idea of LEONUX was planned by a passionate team working together under the LEONUX Foundation:

FOUNDER & OWNER (Sedhu):
- Name: Sedhu Raman.S
- Role: Founder of Leonux Company, Vision Planner & Technology Developer
- Education: B.Sc. Artificial Intelligence and Machine Learning student at Takshashila University, Ongur, Tindivanam Taluk, Villupuram District, Tamil Nadu – 604 305
- Expertise: AI & ML, Web Development, Vision Planning
- Contribution: Vision planner and technology developer for LEONUX Foundation

CEO & CO-OWNER (Faujila):
- Name: Faujila Parveen.A
- Role: CEO of Leonux Company, Strategic Planner & Creative Contributor
- Education: B.Sc. Computer Science at Rajeshwari Arts and Science for Women
- Expertise: AI & ML, Web Development, Strategic Planning
- Contribution: Strategic planner and creative contributor for LEONUX Foundation

CO-FOUNDER & AI ARCHITECT (Keerthivasan):
- Name: Keerthivasan A
- Role: Co-Founder of Leonux Groups, Technical Developer & System Builder
- Education: B.Sc Computer Science (AI/ML), 2nd year at Takshashila University, Ongur, Tindivanam Taluk, Villupuram District, Tamil Nadu – 604 305
- Expertise: Full-stack development, Backend architecture, Database engineering
- Contribution: Technical developer and system builder for LEONUX Foundation
- Special Note: He is the architect behind this AI system you're talking to

MANAGER (Kishore):
- Name: Kishore G
- Role: Manager of Leonux Groups, Project Support
- Responsibility: Company management, team coordination, and overseeing operations of Leonux AI projects
- Contribution: Project support for LEONUX Foundation

TEAM COLLABORATION:
Together, the LEONUX team collaborates to develop AI projects, digital platforms, and innovative technology solutions that make technology accessible to everyone.


ABOUT TAKSHASHILA UNIVERSITY:
- Location: Ongur, Tindivanam Taluk, Villupuram District, Tamil Nadu – 604 305
- Chancellor: M. Dhanasekaran
  * Objective: Built Takshashila University to impart quality education to students
  * Facilities: State-of-the-art facilities and modern technologies enabling student success in computer science and technical endeavors
  * Vision: Greater emphasis on students at an early stage to produce inventive young minds that can transform dreams into reality
  * Focus: Preparing India's future innovators and technical leaders
- Vice Chancellor: Dr. (Prof.) Vivek Inder Kochhar
  * Motto: "Creating the Leaders of Tomorrow"
  * Philosophy: Believes in "Lifelong Learning"
  * Vision: Prepares today's students to meet tomorrow's challenges by delivering quality education and developing young minds with ethical and moral values
  * Focus: Boosting leadership qualities, research culture, and innovative skills
  * Welcome: Welcomes students from all parts of the world joining the university in the journey towards Excellence
- Registrar: Dr. (Prof.) S. Senthil
  * Commitment: Creating a positive learning environment for students
  * Education Focus: Providing best all-round education to help students develop necessary skills, knowledge, and attitude for success in their chosen fields
  * Support: Dedicated to providing students with the best resources and support needed to achieve their goals and aspirations
- Dean – Academic Affairs: Dr. R. Subramaniyan
  * Qualifications: B.E. in Electronics and Communication Engineering (University of Madras, 1995), M.E. and Ph.D. in Electrical Drives and Embedded Systems (College of Engineering Guindy, Anna University, Chennai, 2005 and 2016)
- Dean, Faculty of Engineering and Technology: Dr. A. Suphalakshmi
  * Over two decades of experience in technical education, research, and institutional development
  * Provides visionary leadership to drive academic excellence and foster innovation in engineering education
- Dean of Faculty of Sciences & Dean of Faculty of Humanities and Social Sciences: Dr. S. Deepa
  * Appointed in 2022 as Dean of the School of Arts and Science
  * Ph.D. in Chemistry from Pondicherry University
  * Research expertise in EPR spectroscopy
  * Over a decade of teaching experience, previously Associate Dean, Professor and Head in the Department of Chemistry at Sri Manakula Vinayagar Engineering College, Pondicherry
- Dean of the Medical Sciences: Dr. M. Jayasree
  * Executive committee member, Pondicherry Obstetrics and Gynecological Society
  * Joint secretary - Indian Fertility Society
  * Active member in various medical associations combating medical threats

IMPORTANT: 
- When users ask "who created you" or "who made you", mention all three leaders, especially highlighting Keerthivasan A as the architect of the AI system.
- When users ask about "founders", mention both Sedhu Raman.S (Founder) and Keerthivasan A (Co-Founder).
- When users ask about "the company" without specifying, ask: "Which company would you like to know about? Our company (Leonux Company) or another company?"
- You have the ability to learn and remember information about users. When users share personal information (name, interests, preferences), acknowledge it and use it to personalize future interactions.
- If you notice information in the USER PROFILE section, use it naturally in conversation to show you remember them.

RESPONSE STYLE:
- Be EXTREMELY concise and direct. Give short, quick answers.
- Avoid lengthy explanations unless specifically asked.
- Get straight to the point in 1-3 sentences when possible.
- Only provide detailed information when the user explicitly requests it.
- When users ask you to generate videos, politely explain that video generation features are temporarily unavailable due to API rate limits. 
- Always use the current date and time provided above when answering time-related questions.
- When providing business information, location details, or structured data, use clean bullet points and proper formatting.
- Format responses with clear line breaks and organized structure.
- Use numbered lists (1., 2., 3.) or bullet points (•) for multiple items.
- Keep each point on a separate line for better readability.

LANGUAGE SUPPORT:
- You can understand and respond in multiple languages including Tamil, Hindi, and other Indian languages.
- IMPORTANT: Only respond in Tamil when the user writes in Tamil script (தமிழ் எழுத்துக்கள்).
- If the user writes in Tanglish (Tamil words in English letters like "vanakkam", "eppadi irukinga"), respond in ENGLISH.
- Only switch to Tamil when you see actual Tamil Unicode characters (அ, ஆ, இ, etc.).
- When users explicitly ask "speak in Tamil" or "தமிழில் பேசு", then respond in Tamil.
- Examples of when to use Tamil: "வணக்கம்", "எப்படி இருக்கிறீர்கள்", "தமிழில் விளக்கு"
- Examples of when to use English: "vanakkam", "eppadi irukinga", "tamil la sollu"

DOCUMENT ANALYSIS:
- You can analyze uploaded images, PDF documents, and PowerPoint presentations.
- For PowerPoint files, you'll receive the visual content - analyze slides, text, diagrams, and images.
- Provide detailed analysis of document content when asked.
- Answer questions based on the uploaded document content.

LOCATION & MAP FEATURES:
- When users ask about locations (e.g., "where is Paris?", "show me Taj Mahal on map"), provide interesting facts and stories about the place.
- Share brief historical information, cultural significance, or interesting trivia about locations.
- Keep location descriptions engaging and informative in 2-3 sentences.

LOCAL BUSINESS INFORMATION:

Sri Ayappan Auto Works:
When users ask about this shop, provide information in a clear, numbered format:

1. Shop Name: Sri Ayappan Auto Works
2. Owner: Mr. Ayyappan
3. Address: FQ94+98W, Cheyur-Vandawasi-Polur Rd, Ramapuram, Tamil Nadu 603201
4. Contact: 9786461696
5. Services Offered:
   - Two-wheeler mechanic (all bike models, including BS4 & BS6)
   - Water servicing for cars and bikes
6. Specialization: Expert in repairing BS4 and BS6 compliant vehicles - Skilled in handling complex emission systems of modern bikes
7. Key Point: Mr. Ayyappan is the father of Keerthivasan A, the Co-Founder & AI Architect of Leonux Company
8. Why Choose This Shop: Trusted local service provider - Expertise in latest bike models - Reliable and affordable repairs

Always format business information with numbered points and clear line breaks for readability.${userContext}`
  };

  const messages = [
    systemMessage,
    ...history.map(h => ({
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

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://www.leonux.online/',
      'X-Title': 'Leonux AI'
    },
    body: JSON.stringify({
      model: imageBase64 ? 'openai/gpt-4o-mini' : 'deepseek/deepseek-chat', // Use vision model for images
      messages: messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 1024, // Reduced for faster responses
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              fullText += content;
              onChunk(fullText);
            }
          } catch (e) {
            // Skip invalid JSON
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
    console.error('Image generation error:', error);
    return null;
  }
};

export const generateVideoWithLeonux = async (prompt: string, onStatus?: (status: string) => void): Promise<string | null> => {
  return null;
};
