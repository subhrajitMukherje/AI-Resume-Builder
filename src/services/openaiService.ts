import OpenAI from 'openai';

// Initialize OpenAI client with error handling
let openai: OpenAI | null = null;

const initializeOpenAI = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey || apiKey === 'VITE_OPENAI_API_KEY') {
    return null;
  }
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
  });
};

const getOpenAIClient = () => {
  if (!openai) {
    openai = initializeOpenAI();
  }
  if (!openai) {
    throw new Error('OpenAI API key is not configured. Please add your API key to the .env file.');
  }
  return openai;
};

export interface BulletPointRequest {
  jobTitle: string;
  company: string;
  responsibilities: string;
  achievements?: string;
  skills?: string[];
  industry?: string;
}

export interface SummaryRequest {
  name: string;
  jobTitle: string;
  experience: string;
  skills: string[];
  goals?: string;
}

export interface JobDescriptionAnalysis {
  keySkills: string[];
  requiredExperience: string[];
  suggestedKeywords: string[];
  matchingTips: string[];
}

class OpenAIService {
  async generateBulletPoints(request: BulletPointRequest): Promise<string[]> {
    try {
      const client = getOpenAIClient();
      const prompt = `
        Generate 5 professional resume bullet points for a ${request.jobTitle} position at ${request.company}.
        
        Context:
        - Job responsibilities: ${request.responsibilities}
        ${request.achievements ? `- Key achievements: ${request.achievements}` : ''}
        ${request.skills?.length ? `- Relevant skills: ${request.skills.join(', ')}` : ''}
        ${request.industry ? `- Industry: ${request.industry}` : ''}
        
        Requirements:
        - Start each bullet point with a strong action verb
        - Include quantifiable results where possible (use realistic numbers)
        - Focus on achievements and impact, not just duties
        - Use industry-relevant keywords
        - Keep each bullet point to 1-2 lines
        - Make them ATS-friendly
        
        Format: Return only the bullet points, one per line, without bullet symbols.
      `;

      const response = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content || '';
      return content.split('\n').filter(line => line.trim().length > 0);
    } catch (error) {
      console.error('Error generating bullet points:', error);
      if (error instanceof Error && error.message.includes('OpenAI API key is not configured')) {
        throw error;
      }
      throw new Error('Failed to generate bullet points. Please check your OpenAI API key and internet connection.');
    }
  }

  async generateProfessionalSummary(request: SummaryRequest): Promise<string> {
    try {
      const client = getOpenAIClient();
      const prompt = `
        Write a compelling professional summary for a resume.
        
        Details:
        - Name: ${request.name}
        - Target job title: ${request.jobTitle}
        - Years of experience: ${request.experience}
        - Key skills: ${request.skills.join(', ')}
        ${request.goals ? `- Career goals: ${request.goals}` : ''}
        
        Requirements:
        - 2-3 sentences maximum
        - Highlight most relevant experience and achievements
        - Include key skills naturally
        - Make it compelling and professional
        - Avoid first person pronouns
        - Focus on value proposition to employers
        
        Format: Return only the summary paragraph.
      `;

      const response = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content?.trim() || '';
    } catch (error) {
      console.error('Error generating summary:', error);
      if (error instanceof Error && error.message.includes('OpenAI API key is not configured')) {
        throw error;
      }
      throw new Error('Failed to generate professional summary. Please check your OpenAI API key and internet connection.');
    }
  }

  async analyzeJobDescription(jobDescription: string): Promise<JobDescriptionAnalysis> {
    try {
      const client = getOpenAIClient();
      const prompt = `
        Analyze this job description and extract key information to help tailor a resume:
        
        "${jobDescription}"
        
        Please provide:
        1. Top 10 key skills mentioned
        2. Required experience/qualifications (5 items)
        3. Important keywords for ATS optimization (10 items)
        4. 3 tips for tailoring resume to match this job
        
        Format as JSON:
        {
          "keySkills": ["skill1", "skill2", ...],
          "requiredExperience": ["req1", "req2", ...],
          "suggestedKeywords": ["keyword1", "keyword2", ...],
          "matchingTips": ["tip1", "tip2", "tip3"]
        }
      `;

      const response = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content || '';
      return JSON.parse(content);
    } catch (error) {
      console.error('Error analyzing job description:', error);
      if (error instanceof Error && error.message.includes('OpenAI API key is not configured')) {
        throw error;
      }
      throw new Error('Failed to analyze job description. Please check your OpenAI API key and internet connection.');
    }
  }

  async suggestSkills(jobTitle: string, industry?: string): Promise<string[]> {
    try {
      const client = getOpenAIClient();
      const prompt = `
        Suggest 15 relevant skills for a ${jobTitle} position${industry ? ` in the ${industry} industry` : ''}.
        
        Include a mix of:
        - Technical skills
        - Soft skills
        - Industry-specific skills
        - Tools and technologies
        
        Format: Return only the skills as a comma-separated list.
      `;

      const response = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content || '';
      return content.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    } catch (error) {
      console.error('Error suggesting skills:', error);
      if (error instanceof Error && error.message.includes('OpenAI API key is not configured')) {
        throw error;
      }
      throw new Error('Failed to suggest skills. Please check your OpenAI API key and internet connection.');
    }
  }

  async improveContent(content: string, type: 'summary' | 'bullet' | 'description'): Promise<string> {
    try {
      const client = getOpenAIClient();
      const prompts = {
        summary: 'Improve this professional summary to be more compelling and impactful:',
        bullet: 'Improve this resume bullet point to be more action-oriented and quantified:',
        description: 'Improve this job/project description to be more professional and impactful:'
      };

      const prompt = `
        ${prompts[type]}
        
        "${content}"
        
        Requirements:
        - Keep the same general meaning
        - Make it more professional and impactful
        - Use strong action verbs
        - Include quantifiable results where appropriate
        - Make it ATS-friendly
        
        Return only the improved version.
      `;

      const response = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content?.trim() || content;
    } catch (error) {
      console.error('Error improving content:', error);
      if (error instanceof Error && error.message.includes('OpenAI API key is not configured')) {
        throw error;
      }
      throw new Error('Failed to improve content. Please check your OpenAI API key and internet connection.');
    }
  }
}

export const openaiService = new OpenAIService();