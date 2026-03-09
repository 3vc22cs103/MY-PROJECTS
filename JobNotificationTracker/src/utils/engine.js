export const calculateMatchScore = (job, prefs) => {
    if (!prefs) return 0;
    let score = 0;

    const roleKeywords = prefs.roleKeywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k);
    const userSkills = prefs.skills.split(',').map(k => k.trim().toLowerCase()).filter(k => k);

    // Rule 1: Role Keyword in Title (+25)
    if (roleKeywords.some(kw => job.title.toLowerCase().includes(kw))) {
        score += 25;
    }

    // Rule 2: Role Keyword in Description (+15)
    if (roleKeywords.some(kw => job.description.toLowerCase().includes(kw))) {
        score += 15;
    }

    // Rule 3: Location Match (+15)
    if (prefs.preferredLocations.includes(job.location)) {
        score += 15;
    }

    // Rule 4: Mode Match (+10)
    if (prefs.preferredMode.includes(job.mode)) {
        score += 10;
    }

    // Rule 5: Experience Match (+10)
    if (prefs.experienceLevel && job.experienceLevel === prefs.experienceLevel) {
        score += 10;
    }

    // Rule 6: Skills Overlap (+15)
    const jobSkills = job.skills.map(s => s.toLowerCase());
    if (userSkills.some(skill => jobSkills.includes(skill))) {
        score += 15;
    }

    // Rule 7: Recency (+5)
    if (job.postedDaysAgo <= 2) {
        score += 5;
    }

    // Rule 8: Source LinkedIn (+5)
    if (job.source === 'LinkedIn') {
        score += 5;
    }

    return Math.min(score, 100);
};
