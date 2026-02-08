import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";

//controller for enhancing a resume's professional summary
//POST: /api/ai/enhance-pro-sum

export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        const prompt = `You are an expert resume writer specializing in ATS-optimized content. Your task is to enhance the professional summary provided below.

REQUIREMENTS:
- Length: 2 to 3 concise sentences maximum
- Highlight key skills, relevant experience, and clear career objectives
- Use strong action words and industry-specific terminology
- Make it compelling and ATS-friendly
- Write in third person or first person depending on the input style
- Focus on quantifiable achievements where possible

STRICT FORMATTING RULES:
- NO hyphens or dashes of any kind (-, –, —)
- NO emojis or special characters
- NO bullet points or lists
- NO quotation marks around the output
- Use only standard alphanumeric characters, commas, periods, and spaces
- Output plain text only with no formatting, markdown, or code blocks

User's current summary:
${userContent}

Return ONLY the enhanced professional summary with no preamble, explanation, or additional text:`;

        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL,
            contents: prompt,
        });

        let enhancedContent = response.text.trim();

        // Clean up any unwanted characters that might slip through
        enhancedContent = enhancedContent
            .replace(/[—–-]/g, '') // Remove all types of dashes
            .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Remove emojis
            .replace(/["'`]/g, '') // Remove quotes
            .replace(/\s+/g, ' ') // Normalize spaces
            .trim();

        return res.status(200).json({ enhancedContent })

    } catch (error) {
        console.error('Error enhancing professional summary:', error);
        return res.status(400).json({ message: error.message })
    }
}


//controller for enhancing a resume's job description
//POST: /api/ai/enhance-job-desc

export const enhanceJobDescription = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        const prompt = `You are an expert resume writer specializing in ATS-optimized job descriptions. Your task is to enhance the job description provided below.

REQUIREMENTS:
- Length: 2 to 3 impactful sentences maximum
- Highlight key responsibilities and measurable achievements
- Use strong action verbs (Led, Managed, Developed, Implemented, Optimized, etc.)
- Include quantifiable results and metrics where applicable (percentages, dollar amounts, time saved, etc.)
- Make it ATS-friendly with relevant keywords
- Focus on impact and results rather than just duties

STRICT FORMATTING RULES:
- NO hyphens or dashes of any kind (-, –, —)
- NO emojis or special characters
- NO bullet points or lists
- NO quotation marks around the output
- Use only standard alphanumeric characters, commas, periods, and spaces
- Output plain text only with no formatting, markdown, or code blocks

User's current job description:
${userContent}

Return ONLY the enhanced job description with no preamble, explanation, or additional text:`;

        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL,
            contents: prompt,
        });

        let enhancedContent = response.text.trim();

        // Clean up any unwanted characters that might slip through
        enhancedContent = enhancedContent
            .replace(/[—–-]/g, '') // Remove all types of dashes
            .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Remove emojis
            .replace(/["'`]/g, '') // Remove quotes
            .replace(/\s+/g, ' ') // Normalize spaces
            .trim();

        return res.status(200).json({ enhancedContent })

    } catch (error) {
        console.error('Error enhancing job description:', error);
        return res.status(400).json({ message: error.message })
    }
}

//controller for uploading a resume to the database
//POST: /api/ai/upload-resume

export const uploadResume = async (req, res) => {
    try {
        const { resumeText, title } = req.body;
        const userId = req.userId;

        if (!resumeText) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        const prompt = `You are an expert AI Agent specialized in extracting structured data from resumes with high accuracy.

TASK: Extract all relevant information from the resume text below and format it as valid JSON.

IMPORTANT EXTRACTION RULES:
- Extract dates in a consistent format (e.g., "January 2020", "2020", "Jan 2020")
- For is_current field, set to true only if explicitly mentioned as "Present", "Current", or similar
- Extract skills as individual items in an array
- Clean and normalize all text (remove extra spaces, special formatting)
- If a field is not present in the resume, leave it as an empty string or empty array
- Extract phone numbers and emails exactly as they appear
- For LinkedIn and website URLs, include the full URL if present

STRICT FORMATTING RULES FOR EXTRACTED TEXT:
- NO hyphens or dashes in the extracted content
- NO emojis or special characters
- Replace any dashes with spaces or remove them appropriately
- Use only standard alphanumeric characters and basic punctuation

Resume text:
${resumeText}

Required JSON structure (return ONLY this JSON with no additional text, markdown, or code blocks):
{
    "professional_summary": "",
    "skills": [],
    "personal_info": {
        "image": "",
        "full_name": "",
        "profession": "",
        "email": "",
        "phone": "",
        "location": "",
        "linkedin": "",
        "website": ""
    },
    "experience": [
        {
            "company": "",
            "position": "",
            "start_date": "",
            "end_date": "",
            "description": "",
            "is_current": false
        }
    ],
    "project": [
        {
            "name": "",
            "type": "",
            "description": ""
        }
    ],
    "education": [
        {
            "institution": "",
            "degree": "",
            "field": "",
            "graduation_date": "",
            "gpa": ""
        }
    ]
}`;

        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL,
            contents: prompt,
        });

        let extractedData = response.text.trim();

        // Remove markdown code blocks if present
        if (extractedData.startsWith('```json')) {
            extractedData = extractedData.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (extractedData.startsWith('```')) {
            extractedData = extractedData.replace(/```\n?/g, '');
        }

        const parsedData = JSON.parse(extractedData);

        // Additional cleanup of parsed data to remove dashes and emojis
        const cleanData = JSON.parse(JSON.stringify(parsedData, (key, value) => {
            if (typeof value === 'string') {
                return value
                    .replace(/[—–-]/g, '') // Remove dashes
                    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Remove emojis
                    .replace(/\s+/g, ' ') // Normalize spaces
                    .trim();
            }
            return value;
        }));

        const newResume = await Resume.create({ userId, title, ...cleanData });

        return res.status(200).json({ resumeId: newResume._id })

    } catch (error) {
        console.error('Error uploading resume:', error);
        return res.status(400).json({ message: error.message })
    }
}