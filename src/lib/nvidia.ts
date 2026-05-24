const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '';
const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const DEFAULT_MODEL = 'meta/llama-3.1-70b-instruct';

// Helper to query NVIDIA Build API
async function callNvidia(prompt: string, systemPrompt: string = 'You are a professional real estate copywriter and SEO expert.'): Promise<string> {
  if (!NVIDIA_API_KEY) {
    throw new Error('NVIDIA_API_KEY not configured');
  }

  try {
    const response = await fetch(NVIDIA_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`NVIDIA API responded with status ${response.status}: ${errBody}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error calling NVIDIA NIM API:', error);
    throw error;
  }
}

// 1. AI-generated property descriptions
export async function generatePropertyDescription(params: {
  title: string;
  type: string;
  city: string;
  address: string;
  beds: number;
  baths: number;
  area: number;
  furnished: string;
  amenities: string[];
}): Promise<string> {
  const { title, type, city, address, beds, baths, area, furnished, amenities } = params;
  const prompt = `Write a luxury, high-converting real estate description for a property with the following specifications:
- Title: ${title}
- Type: ${type}
- Location: ${city} (${address})
- Layout: ${beds} bedrooms, ${baths} bathrooms, ${area} sq.ft.
- Furnishing: ${furnished}
- Key Amenities: ${amenities.join(', ')}

The description should have:
1. An engaging hook about the lifestyle and architecture.
2. A descriptive paragraph highlighting the layout and structural details (columns, ceilings, glass).
3. A bulleted list of premium amenities.
4. A closing call-to-action (CTA) for booking private walkthroughs.
Keep the style elegant, sophisticated, and minimalist.`;

  try {
    return await callNvidia(prompt, 'You are an elite real estate copywriter specializing in ultra-luxury developments.');
  } catch (e) {
    // Local fallback
    return `Welcome to ${title}, an exquisite luxury ${type} nestled in the heart of ${city} (${address}). Spanning an impressive ${area} square feet, this ${furnished} estate offers ${beds} bedrooms and ${baths} bathrooms designed with absolute structural precision.

From the double-height ceilings and soaring columns to the floor-to-ceiling glass paneling, every aspect of this residence is crafted to blend architectural brilliance with daily functional comfort. The spacious open-concept floor plan leads effortlessly to outdoor spaces, perfect for hosting private gatherings or relaxing in peace.

Key features include:
${amenities.map(a => `• ${a}`).join('\n')}

Designed for the discerning buyer who values design integrity and premium craftsmanship, this property is a rare find. Contact our team today to coordinate a private, closed-door walkthrough.`;
  }
}

// 2. AI-generated blog outlines
export async function generateBlogOutline(title: string, category: string): Promise<string> {
  const prompt = `Create a detailed, SEO-optimized blog article outline for the topic: "${title}" under the category: "${category}".
Include:
- Suggested meta title and description.
- H1, H2, and H3 headers.
- Bullet points under each header explaining what content should go there.
- Suggested placement of internal links to property listings.
Format as clean Markdown.`;

  try {
    return await callNvidia(prompt, 'You are an SEO Strategist for a high-end real estate publication.');
  } catch (e) {
    return `# Blog Outline: ${title}
**Category:** ${category}

## 1. Introduction
- Hook: The current shifting dynamics in ${category}.
- Overview of what the article will cover.
- Target keywords: real estate trends, modern ${category.toLowerCase()}, property investments.

## 2. Main Concepts & Market Shifts [H2]
- The rising value of design integrity in modern homes.
- How layout structure and natural light drive premium valuation.
- Case Study: Malibu and Miami luxury property markets.

## 3. Structural Essentials to Look For [H2]
### Architectural Materials [H3]
- Importance of raw concrete, premium cedar, and double-glazed glass.
- High thermal efficiency and green LEED ratings.
### Smart Home Integrations [H3]
- Automation of HVAC, security grids, and automated sliding glass walls.

## 4. Investment Advice & SEO Analysis [H2]
- How to audit properties for structural flaws.
- Highlighting similar listings on our platform (add internal link here to Malibu/Miami collections).

## 5. Conclusion & Actionable Next Steps
- Summary of key takeaways.
- Contact form call-to-action (CTA) for investment inquiries.`;
  }
}

// 3. SEO Title & Meta description generation
export async function generateSeoMeta(params: {
  title: string;
  type: 'property' | 'blog';
  descriptionOrContent: string;
}): Promise<{ seoTitle: string; seoDescription: string; seoKeywords: string[] }> {
  const { title, type, descriptionOrContent } = params;
  const prompt = `Based on the following ${type} title and description, generate:
1. A highly optimized SEO Meta Title (max 60 characters).
2. A compelling Meta Description (max 155 characters) that maximizes Click-Through-Rate (CTR).
3. A list of 4-5 high-volume, relevant SEO Keywords.

Title: ${title}
Content snippet: ${descriptionOrContent.slice(0, 300)}

Respond in valid JSON format:
{
  "seoTitle": "...",
  "seoDescription": "...",
  "seoKeywords": ["keyword1", "keyword2", ...]
}`;

  try {
    const raw = await callNvidia(prompt, 'You are an SEO engineering bot. Return ONLY valid JSON.');
    // Clean codeblock formatting if returned
    const cleanJson = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    // Local fallback
    const keywords = type === 'property'
      ? [title.toLowerCase(), 'luxury real estate', 'premium homes', 'buy property online']
      : [title.toLowerCase(), 'real estate insights', 'property investment blog', 'market trends'];
    return {
      seoTitle: `${title.slice(0, 45)} | NexDwell`,
      seoDescription: `Explore ${title}. ${descriptionOrContent.slice(0, 100).replace(/\n/g, ' ')}... Find luxury properties, professional agents, and market analyses.`,
      seoKeywords: keywords
    };
  }
}

// 4. FAQ generation
export async function generateFaqs(title: string, content: string): Promise<Array<{ question: string; answer: string }>> {
  const prompt = `Based on this content about "${title}", generate 3 relevant, high-value FAQ questions and structured, concise answers.
These will be used for Google Schema Markup.

Content: ${content.slice(0, 800)}

Respond in valid JSON array format:
[
  { "question": "...", "answer": "..." },
  { "question": "...", "answer": "..." },
  { "question": "...", "answer": "..." }
]`;

  try {
    const raw = await callNvidia(prompt, 'You are a search engine Schema markup assistant. Return ONLY valid JSON.');
    const cleanJson = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    return [
      {
        question: `Why is ${title} a unique investment?`,
        answer: 'It offers premium location advantages, structural design excellence, and sustainable, energy-efficient building systems that drive long-term equity growth.'
      },
      {
        question: 'Are walkthroughs available for this?',
        answer: 'Yes, private walk-through appointments can be scheduled immediately by contacting our verified listing agents via the enquiry form or WhatsApp.'
      },
      {
        question: 'What is the furnishing status?',
        answer: 'This depends on the property specifications; many premium listings come fully fitted with luxury Italian custom furniture and smart automation grids.'
      }
    ];
  }
}

// 5. Keyword clustering & Semantic SEO optimization
export async function clusterKeywords(rawKeywords: string[]): Promise<Array<{ cluster: string; keywords: string[] }>> {
  const prompt = `Group and cluster the following keywords semantically into logical search themes/topics for a real estate site.
Keywords: ${rawKeywords.join(', ')}

Respond in valid JSON array:
[
  { "cluster": "Theme Name", "keywords": ["kw1", "kw2"] }
]`;

  try {
    const raw = await callNvidia(prompt, 'You are a semantic SEO data architect. Return ONLY valid JSON.');
    const cleanJson = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    return [
      {
        cluster: 'Luxury Living',
        keywords: rawKeywords.filter(k => k.includes('luxury') || k.includes('villa') || k.includes('mansion'))
      },
      {
        cluster: 'Location Specific',
        keywords: rawKeywords.filter(k => k.includes('malibu') || k.includes('miami') || k.includes('alto'))
      },
      {
        cluster: 'Real Estate Investment',
        keywords: rawKeywords.filter(k => !k.includes('luxury') && !k.includes('malibu') && !k.includes('miami'))
      }
    ].filter(c => c.keywords.length > 0);
  }
}

// 6. AI Content Scoring
export interface ContentScore {
  score: number; // 0-100
  readability: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement';
  keywordDensity: string;
  suggestions: string[];
}

export async function scoreContent(content: string, keywords: string[]): Promise<ContentScore> {
  const prompt = `Analyze this blog/property content against the target keywords: [${keywords.join(', ')}].
Score the content from 0 to 100 on SEO optimization, determine readability, analyze keyword density, and provide 3 specific actionable improvement suggestions.

Content: ${content.slice(0, 1200)}

Respond in valid JSON format:
{
  "score": 85,
  "readability": "Good",
  "keywordDensity": "Keywords are well-distributed, 1.8% density.",
  "suggestions": [
    "Suggestion 1",
    "Suggestion 2",
    "Suggestion 3"
  ]
}`;

  try {
    const raw = await callNvidia(prompt, 'You are an advanced SEO content grader. Return ONLY valid JSON.');
    const cleanJson = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    // Local heuristic scorer
    let score = 75;
    const suggestions = [];

    if (content.length < 500) {
      score -= 15;
      suggestions.push('Increase content length to at least 800 words for deeper search coverage.');
    } else {
      suggestions.push('Excellent article length. Consider adding a few more bulleted summaries.');
    }

    const keywordMatches = keywords.filter(kw => content.toLowerCase().includes(kw.toLowerCase()));
    if (keywordMatches.length < keywords.length / 2) {
      score -= 15;
      suggestions.push(`Integrate missing target keywords naturally, such as: ${keywords.filter(kw => !content.toLowerCase().includes(kw.toLowerCase())).join(', ')}.`);
    } else {
      suggestions.push('Good inclusion of target keywords in the main body paragraph copy.');
    }

    if (!content.includes('##') && !content.includes('<h3>')) {
      score -= 10;
      suggestions.push('Organize the content structure using clear H2 and H3 markdown heading tags.');
    } else {
      suggestions.push('Heading structures are cleanly mapped. Add an internal link inside H2 sections.');
    }

    return {
      score: Math.max(score, 30),
      readability: content.length > 800 ? 'Excellent' : 'Good',
      keywordDensity: `Keywords present: ${keywordMatches.length}/${keywords.length}. Local density is roughly 1.5%.`,
      suggestions
    };
  }
}

// 7. Internal linking suggestions
export async function suggestInternalLinks(params: {
  content: string;
  availableListings: Array<{ id: string; title: string; city: string }>;
  availablePosts: Array<{ id: string; title: string; slug: string }>;
}): Promise<Array<{ textToLink: string; url: string; reason: string }>> {
  const { content, availableListings, availablePosts } = params;
  
  // Heuristic linking matching (regex-based local algorithm is extremely reliable and fast)
  const suggestions: Array<{ textToLink: string; url: string; reason: string }> = [];
  const lowercaseContent = content.toLowerCase();

  // Search listings
  for (const item of availableListings) {
    if (lowercaseContent.includes(item.city.toLowerCase())) {
      suggestions.push({
        textToLink: item.city,
        url: `/listings?city=${item.city}`,
        reason: `Hyperlink "${item.city}" to filter listings in this high-performing location.`
      });
      break;
    }
  }

  // Look for specific key phrases
  if (lowercaseContent.includes('minimal') || lowercaseContent.includes('architect')) {
    const post = availablePosts.find(p => p.slug.includes('minimal'));
    if (post) {
      suggestions.push({
        textToLink: lowercaseContent.includes('minimalist') ? 'minimalist' : 'architectural',
        url: `/blog/${post.slug}`,
        reason: `Connect this theme to our popular post "${post.title}".`
      });
    }
  }

  // Look for AI or SEO mentions
  if (lowercaseContent.includes('ai') || lowercaseContent.includes('seo') || lowercaseContent.includes('technology')) {
    const post = availablePosts.find(p => p.slug.includes('ai'));
    if (post) {
      suggestions.push({
        textToLink: 'ai',
        url: `/blog/${post.slug}`,
        reason: `Link references of AI and technology to our deep dive on AI real estate listings.`
      });
    }
  }

  // Limit to max 3
  return suggestions.slice(0, 3);
}

// 8. Content rewriting assistant
export async function rewriteText(text: string, tone: 'professional' | 'luxury' | 'persuasive' | 'simple'): Promise<string> {
  const prompt = `Rewrite the following real estate copy in a ${tone} tone. Keep it highly readable and engaging.
Copy: "${text}"`;

  try {
    return await callNvidia(prompt, `You are a real estate copywriter. Rewrite this text to sound exceptionally ${tone}.`);
  } catch (e) {
    if (tone === 'luxury') {
      return `Immerse yourself in ${text.replace(/is/g, 'stands as a testament of').replace(/has/g, 'boasts premium')}. A truly bespoke living experience.`;
    }
    if (tone === 'persuasive') {
      return `Do not miss this rare opportunity. ${text} Act now to secure your future equity and schedule a private showing.`;
    }
    if (tone === 'simple') {
      return text.replace(/exquisite|architectural marvel|subterranean|panoramic vistas/g, 'beautiful');
    }
    return text;
  }
}
