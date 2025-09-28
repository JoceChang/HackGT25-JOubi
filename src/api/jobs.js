// api/jobs.js
let jobs = [
  {
    id: "google-114944217771320006",
    company: "Google",
    title: "Software Engineering Intern (BS/MS) - 2026",
    location: "Mountain View, CA, USA",
    url: "https://www.google.com/about/careers/applications/jobs/results/114944217771320006-software-engineering-bsms-intern-2026",
    deadline: "2025-11-01",
  status: "not_applied",         // "not_applied" | "applied" | "interview" | "interviewed" | "offer" | "rejected"
  actionRequired: true,          // true if the user must take action (only true for not_applied)
    tags: ["Software", "Internship", "Summer 2026"],
    description: "Join Google’s engineering teams to build scalable software solutions. Work with experts and shape the future of technology.",
    postedDate: "2025-09-20",
    scrapedFrom: "Google Careers",
  },
  {
    id: "prizepicks-7447882003",
    company: "PrizePicks",
    title: "Data Analyst Intern",
    location: "Atlanta, GA (Hybrid)",
    url: "https://www.prizepicks.com/position?gh_jid=7447882003",
    deadline: "2025-10-15",
  status: "applied",
  actionRequired: false,
    tags: ["Data", "Analytics", "Sports"],
    description: "Analyze user data to improve fantasy sports experiences. Ideal for students passionate about sports analytics.",
    postedDate: "2025-09-10",
    scrapedFrom: "Greenhouse",
  },
  {
    id: "cloudflare-7206269",
    company: "Cloudflare",
    title: "Software Engineer Intern",
    location: "Remote (US)",
    url: "https://job-boards.greenhouse.io/cloudflare/jobs/7206269?gh_jid=7206269",
    deadline: null,
  status: "interview",
  // interview implies we already applied, so no further action is required for applying
  actionRequired: false,
    tags: ["Backend", "Security", "Remote"],
    description: "Work on security and performance at scale. Gain hands-on experience with backend systems at a global company.",
    postedDate: "2025-09-15",
    scrapedFrom: "Greenhouse",
  },
];

export function fetchJobListings() {
  return jobs;
}

export function updateJobStatus(jobId, newStatus) {
  jobs = jobs.map((job) => {
    if (job.id === jobId) {
      // actionRequired should be true only when the job is still not applied
      const actionRequired = newStatus === "not_applied";
      return { ...job, status: newStatus, actionRequired };
    }
    return job;
  });
  return jobs;
}