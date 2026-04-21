const Jobs = require("../models/Jobs");
const User = require("../models/Users");
const fs = require("fs");
const path = require("path");
const transporter = require("../middleware/nodeConfig");
exports.postJob = async (req, res) => {
  try {
    console.log(req.body, "body");
    const job = await Jobs.create(req.body);
    console.log(job, "job>>>>");
    const employees = await User.find({ role: "employee" });
    console.log(employees, "employees");
    const templatePath = path.join(__dirname, "Email.html");
    let emailTemplate = fs.readFileSync(templatePath, "utf8");
    emailTemplate = emailTemplate
      .replace("{{jobTitle}}", job.title)
      .replace("{{company}}", job.company)
      .replace("{{location}}", job.location)
      .replace("{{salary}}", job.salary)
      .replace("{{createdAt}}", new Date(job.createdAt).toLocaleDateString());
    for (let employee of employees) {
      const mailOptions = {
        from: process.env.EMAIL,
        to: employee.email,
        subject: "New Job Opportunity Posted!",
        html: emailTemplate,
      };
      await transporter.sendMail(mailOptions);
    }

    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.getAllJobs = async (req, res) => {
  try {
    const filter = {};
    if (req.query.location) filter.location = req.query.location;
    const sortyBy = req.query.sort || "-createdAt";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;
    const jobs = await Jobs.find(filter).sort(sortyBy).skip(skip).limit(limit);
    const totalJobs = await Jobs.countDocuments();
    res.json({
      success: true,
      total: totalJobs,
      page,
      limit,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};
exports.fetchSingleJob = async (req, res) => {
  const job = await Jobs.findById(req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
};
exports.updateJob = async (req, res) => {
  const job = await Jobs.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
};
exports.deleteJob = async (req, res) => {
  try {
    const job = await Jobs.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json({ message: "job deleted successfully" });
  } catch (err) {
    next(err);
  }
};
