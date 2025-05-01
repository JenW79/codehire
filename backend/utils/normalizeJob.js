function normalizeJob(job, source) {
    if (source === 'jsearch') {
      return {
        id: job.job_id,
        source: 'jsearch',
        title: job.job_title,
        company: job.employer_name,
        location: job.job_location || 'Remote/Unknown',
        applyUrl: job.job_apply_link,
        description: job.job_description,
        datePosted: job.job_posted_at_datetime_utc
      };
    }
  
    if (source === 'remotive') {
      return {
        id: job.id.toString(),
        source: 'remotive',
        title: job.title,
        company: job.company_name,
        location: job.candidate_required_location || 'Remote',
        applyUrl: job.url,
        description: job.description,
        datePosted: job.publication_date
      };
    }
  
    // If already normalized (e.g., from mockJobs.json)
    return job;
  }
  
  module.exports = normalizeJob;
  