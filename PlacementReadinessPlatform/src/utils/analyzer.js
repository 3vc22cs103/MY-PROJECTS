export const SKILL_CATEGORIES = {
    "Core CS": ["DSA", "Data Structures", "Algorithms", "OOP", "Object Oriented Programming", "DBMS", "Database Management", "OS", "Operating Systems", "Networks", "Computer Networks", "System Design", "Distributed Systems"],
    "Languages": ["Java", "Python", "JavaScript", "TypeScript", "C++", "C#", "Go", "Golang", "Rust", "Swift", "Kotlin", "PHP", "Ruby"],
    "Web": ["React", "Next.js", "Node.js", "Express", "REST", "API", "GraphQL", "HTML", "CSS", "Tailwind", "Redux", "Vue", "Angular"],
    "Data": ["SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis", "NoSQL", "Cassandra", "Elasticsearch", "Kafka", "Spark", "Hadoop"],
    "Cloud/DevOps": ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Jenkins", "Terraform", "Linux", "Bash", "Shell", "Git", "GitHub"],
    "Testing": ["Selenium", "Cypress", "Playwright", "JUnit", "PyTest", "Jest", "Mocha", "Chai", "TestNG"]
};

// Heuristic list of known large enterprises
const KNOWN_ENTERPRISES = [
    "google", "amazon", "microsoft", "meta", "facebook", "apple", "netflix", "adobe",
    "salesforce", "uber", "airbnb", "lyft", "tcs", "infosys", "wipro", "accenture",
    "cognizant", "ibm", "oracle", "sap", "deloitte", "pwc", "ey", "kpmg", "capgemini",
    "hcl", "tech mahindra", "mindtree", "l&t", "samsung", "cisco", "intel", "amd",
    "nvidia", "qualcomm", "jpmorgan", "goldman sachs", "morgan stanley"
];

const analyzeCompany = (company) => {
    const normalized = company ? company.toLowerCase().trim() : "";
    let type = "Startup"; // Default as per requirements
    let focus = "Practical problem solving + stack depth";

    if (KNOWN_ENTERPRISES.some(e => normalized.includes(e))) {
        type = "Enterprise";
        focus = "Structured DSA + core fundamentals";
    }

    // Simple industry heuristics
    let industry = "Technology Services";
    if (normalized.includes("bank") || normalized.includes("pay") || normalized.includes("fin") || normalized.includes("wealth")) industry = "Fintech";
    if (normalized.includes("health") || normalized.includes("med") || normalized.includes("pharma") || normalized.includes("care")) industry = "Healthcare / HealthTech";
    if (normalized.includes("shop") || normalized.includes("kart") || normalized.includes("commerce") || normalized.includes("retail")) industry = "E-Commerce";
    if (normalized.includes("educ") || normalized.includes("learn") || normalized.includes("school")) industry = "EdTech";
    if (normalized.includes("media") || normalized.includes("entertainment") || normalized.includes("game")) industry = "Media & Entertainment";

    return { name: company, type, industry, focus };
};

const generateRoundMapping = (companyType, skills) => {
    const rounds = [];

    if (companyType === "Enterprise") {
        rounds.push({
            name: "Round 1: Online Assessment",
            desc: "Aptitude + DSA (Arrays, Strings, Trees)",
            why: "Filters the large volume of applicants to identify core logical ability."
        });
        rounds.push({
            name: "Round 2: Technical Interview I",
            desc: "Live Coding (DSA) + Core CS (DBMS/OS)",
            why: "Validates your problem-solving skills and computer science fundamentals."
        });
        rounds.push({
            name: "Round 3: Technical Interview II",
            desc: "System Design / Project Deep Dive",
            why: "Assesses your engineering depth, design choices, and scalability knowledge."
        });
        rounds.push({
            name: "Round 4: Managerial / HR",
            desc: "Behavioral + Culture Fit",
            why: "Ensures alignment with company values and long-term potential."
        });
    } else {
        // Startup logic
        const techStackDesc = skills["Web"]?.length > 0
            ? "Build a small feature / Take-home task"
            : "Basic Coding + Resume Screen";

        rounds.push({
            name: "Round 1: Screening / Assignment",
            desc: techStackDesc,
            why: "Verifies raw hands-on coding ability and speed."
        });
        rounds.push({
            name: "Round 2: Technical Discussion",
            desc: "Code Pair / Architecture Discussion",
            why: "Checks real-time collaboration, communication, and architectural thinking."
        });
        rounds.push({
            name: "Round 3: Founder / Culture Fit",
            desc: "Mission Alignment + Soft Skills",
            why: "Critical for startups to ensure you thrive in a fast-paced environment."
        });
    }
    return rounds;
};

export const analyzeJobDescription = (company, role, jdText) => {
    const extractedSkills = {};
    let totalSkills = 0;
    let categoryCount = 0;

    // 1. Skill Extraction
    Object.keys(SKILL_CATEGORIES).forEach(category => {
        const found = SKILL_CATEGORIES[category].filter(skill => {
            // Escape special characters for regex (like C++, C#)
            const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
            return regex.test(jdText);
        });

        if (found.length > 0) {
            extractedSkills[category] = found;
            totalSkills += found.length;
            categoryCount++;
        }
    });

    // If no skills found, mark as General
    if (totalSkills === 0) {
        extractedSkills["General"] = ["General Freshers Stack"];
    }

    // 2. Readiness Score Calculation
    let baseScore = 35;
    const categoryBonus = Math.min(categoryCount * 5, 30);
    const companyBonus = company && company.trim().length > 0 ? 10 : 0;
    const roleBonus = role && role.trim().length > 0 ? 10 : 0;
    const lengthBonus = jdText && jdText.length > 800 ? 10 : 0;

    let readinessScore = baseScore + categoryBonus + companyBonus + roleBonus + lengthBonus;
    if (readinessScore > 100) readinessScore = 100;

    // 3. Generators
    const plan = generatePlan(extractedSkills);
    const checklist = generateChecklist(extractedSkills);
    const questions = generateQuestions(extractedSkills);
    const companyIntel = analyzeCompany(company);
    const roundMapping = generateRoundMapping(companyIntel.type, extractedSkills);

    return {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        company,
        role,
        jdText,
        extractedSkills,
        categoryCount,
        readinessScore,
        baseReadinessScore: readinessScore,
        plan,
        checklist,
        questions,
        companyIntel,
        roundMapping
    };
};

const generatePlan = (skills) => {
    // Determine focus based on skills
    const hasWeb = skills["Web"]?.length > 0;
    const hasDSA = skills["Core CS"]?.length > 0;
    const hasData = skills["Data"]?.length > 0;

    let day1_2 = "Basics + Core CS (OS, DBMS, Networks)";
    let day3_4 = "DSA + Coding Practice (Arrays, Strings, Trees)";
    let day5 = "Project Review + Resume Alignment";

    if (hasWeb) {
        day5 = "Frontend/Backend Project Deep Dive + Framework Revisions";
    }
    if (hasData) {
        day1_2 += " + SQL Queries & Normalization";
    }

    return [
        { day: "Day 1-2", focus: day1_2 },
        { day: "Day 3-4", focus: day3_4 },
        { day: "Day 5", focus: day5 },
        { day: "Day 6", focus: "Mock Interview Questions (Behavioral + Technical)" },
        { day: "Day 7", focus: "Final Revision + Weak Areas Analysis" }
    ];
};

const generateChecklist = (skills) => {
    // Template-based checklist
    return {
        "Round 1: Aptitude / Basics": [
            "Quantitative Aptitude (Time & Work, Probability)",
            "Logical Reasoning (Puzzles, Series)",
            "Verbal Ability (Comprehension)",
            "Basic Programming Logic (Output guessing)",
            "Resume Walkthrough"
        ],
        "Round 2: DSA + Core CS": [
            "Data Structures (Arrays, Linked Lists, Stacks)",
            "Algorithms (Sorting, Searching, Recursion)",
            skills["Core CS"]?.includes("DBMS") ? "SQL Queries & Normalization" : "Database Basics",
            skills["Core CS"]?.includes("OS") ? "Process Management & Threads" : "OS Concepts",
            "Code Optimization & Complexity Analysis"
        ],
        "Round 3: Tech Interview": [
            "Project Architecture Discussion",
            skills["Web"]?.length > 0 ? `Framework Deep Dive (${skills["Web"].join(", ")})` : "Technology Stack Justification",
            skills["Labs"]?.length > 0 ? `Language Specifics (${skills["Languages"].join(", ")})` : "Favorite Language Features",
            "System Design Basics (Scalability, Load Balancing)",
            "Live Coding / Pair Programming"
        ],
        "Round 4: Managerial / HR": [
            "Why this company?",
            "Strengths and Weaknesses",
            "Conflict Resolution (STAR Method)",
            "Long term goals",
            "Salary Expectations & Negotiation"
        ]
    };
};

const generateQuestions = (skills) => {
    const questions = [];

    // Core CS
    if (skills["Core CS"]) {
        if (skills["Core CS"].includes("OOP")) questions.push("Explain the 4 pillars of OOPs with real-world examples.");
        if (skills["Core CS"].includes("DBMS")) questions.push("What is the difference between SQL and NoSQL? When to use which?");
        if (skills["Core CS"].includes("OS")) questions.push("Explain the difference between a Process and a Thread.");
        if (skills["Core CS"].includes("Networks")) questions.push("What happens when you type a URL in the browser?");
    }

    // Languages
    if (skills["Languages"]) {
        if (skills["Languages"].some(l => l.match(/Java/i))) questions.push("Explain the internal working of HashMap in Java.");
        if (skills["Languages"].some(l => l.match(/Python/i))) questions.push("What are decorators in Python and how do they work?");
        if (skills["Languages"].some(l => l.match(/JavaScript/i))) questions.push("Explain Event Loop, Closures, and Hoisting in JavaScript.");
    }

    // Web
    if (skills["Web"]) {
        if (skills["Web"].includes("React")) questions.push("Explain React Lifecycle methods / Hooks and Virtual DOM.");
        if (skills["Web"].includes("Node.js")) questions.push("How does Node.js handle concurrency?");
        if (skills["Web"].includes("REST")) questions.push("What are the different HTTP methods and when to use them?");
    }

    // Data
    if (skills["Data"]) {
        if (skills["Data"].includes("SQL")) questions.push("Explain indexing and how it helps in query optimization.");
        if (skills["Data"].includes("MongoDB")) questions.push("How does aggregation work in MongoDB?");
    }

    // Default Questions if we don't have enough
    const defaults = [
        "How would you optimize searching in a sorted dataset?",
        "Explain the concept of Recursion with an example.",
        "Design a URL shortener system (Low Level Design).",
        "Tell me about the most challenging bug you fixed.",
        "How do you handle version control in your projects?"
    ];

    // Fill up to 10
    let i = 0;
    while (questions.length < 10 && i < defaults.length) {
        if (!questions.includes(defaults[i])) {
            questions.push(defaults[i]);
        }
        i++;
    }

    return questions.slice(0, 10);
};
