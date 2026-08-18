const ResumeModel = require('../Models/resume');
const UserModel = require('../Models/user');
const multer = require("multer");
const pdfParse = require("pdf-parse");
const path = require("path");
const fs = require("fs");
const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY || "kIeFgZeWySOFKKKRUO2H4giRpw4HqqCyurgtKsFB", 
});

exports.addResume = async (req, res) => {
    try {
        const { job_desc, user } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: "No resume file uploaded" });
        }
        
        if (!job_desc || !user) {
            // Clean up temp file
            if (req.file.path && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ error: "Job description and user ID are required" });
        }

        const pdfPath = req.file.path;
        const pdfBuffer = fs.readFileSync(pdfPath);
        const pdfData = await pdfParse(pdfBuffer);

        const prompt = `
            You are a resume screening assistant.
            Compare the following resume text with the provided Job Description (JD) and give a match score (0-100) and feedback.

            Evaluate the following aspects:
            - Overall resume quality
            - Skills match
            - Experience relevance
            - Education relevance
            - Projects
            - ATS compatibility & keywords
            - Formatting & content quality
            - Missing information
            - Key improvement suggestions

            Resume:
            ${pdfData.text}

            Job Description:
            ${job_desc}

            Return the score and a brief explanation in this format:
            Score: XX
            Reason: [Your detailed evaluation covering the aspects above]
        `;

        const response = await cohere.chat({
            model: "command-r-08-2024",
            message: prompt,
        });

        const text = response.text;
        
        let score = "0";
        let feedback = "";
        
        const scoreMatch = text.match(/Score:\s*(\d+)/i);
        if (scoreMatch) {
            score = scoreMatch[1];
        }
        
        const reasonMatch = text.match(/Reason:\s*([\s\S]+)/i);
        if (reasonMatch) {
            feedback = reasonMatch[1].trim();
        } else {
            feedback = text.trim();
        }

        const newResume = new ResumeModel({
            user: user,
            resume_name: req.file.originalname,
            job_desc: job_desc,
            score: score,
            feedback: feedback
        });

        await newResume.save();

        if (fs.existsSync(pdfPath)) {
            fs.unlinkSync(pdfPath); // remove temp file
        }

        res.status(200).json({
            score: newResume.score,
            message: "Your analysis is ready",
            summary: newResume.feedback,
            data: newResume
        });

    } catch (err) {
        console.log(err);
        // Clean up temp file on error if it exists
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}

exports.getAllResumesForUser = async (req, res) => {
    try {
        const { user } = req.params;
        if (!user) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const resumes = await ResumeModel.find({ user: user }).sort({ createdAt: -1 });
        return res.status(200).json(resumes);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error', message: err.message });
    }
}

exports.getResumeForAdmin = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized access. User ID is required in headers." });
        }

        const adminUser = await UserModel.findById(userId);
        if (!adminUser || adminUser.role !== 'admin') {
            return res.status(403).json({ error: "Access denied. Admin role required." });
        }

        const resumes = await ResumeModel.find().populate('user').sort({ createdAt: -1 });
        return res.status(200).json({
            resume: resumes
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error', message: err.message });
    }
}