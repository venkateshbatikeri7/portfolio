import resumePdf from '../assets/Venkatesh_BS_Resume.pdf'

export const profile = {
  firstName: 'Venkatesh',
  lastName: 'BS',
  fullName: 'Venkatesh BS',
  initials: 'VB',
  role: 'Full Stack & Cloud-Native Engineer',
  roleShort: 'Full Stack / Cloud',
  tagline: 'Engineering scalable solutions for high-performance enterprise systems.',
  email: 'batikerisvenkatesh@outlook.com',
  phone: '+91-8904195663',
  phoneHref: 'tel:+918904195663',
  location: 'Bengaluru, Karnataka, India',
  timezone: 'Asia/Kolkata',
  availability: 'Open to Full Stack / Cloud / AI engineering roles',
  // Imported through the bundler (not public/) so the URL is content-hashed
  // and always resolves to a real PDF instead of the SPA index.html fallback.
  resume: resumePdf,
  resumeFileName: 'Venkatesh_BS_Resume.pdf',
  socials: [
    { label: 'LinkedIn', href: 'https://linkedin.com/in/venkateshbs', short: 'in' },
    { label: 'GitHub', href: 'https://github.com/venkateshbs', short: 'gh' },
    { label: 'Email', href: 'mailto:batikerisvenkatesh@outlook.com', short: '@' },
  ],
  education: {
    degree: 'B.Tech — Information Science',
    school: 'Brindavan College of Engineering',
    year: '2018',
  },
  languages: ['English', 'Kannada', 'Telugu'],
}

export const heroStats = [
  { value: 6, suffix: '+', label: 'Years shipping production systems' },
  { value: 40, suffix: '%', label: 'Faster deployment lifecycle' },
  { value: 60, suffix: '%', label: 'Response time reduction' },
  { value: 3, suffix: 'yrs', label: 'Hands-on AWS cloud exposure' },
]

export const rotatingRoles = [
  'AI Automation Builder',
  'Cloud-Native Architect',
  'Backend Engineer',
  'Full Stack Developer',
  'Technical Lead',
]

export const about = {
  kicker: 'Executive Summary',
  title: 'The cross-functional edge',
  lede: 'With 6+ years bridging complex backend systems and intuitive user experiences, I bring a rare dual perspective that accelerates product delivery and drives measurable business outcomes.',
  body: 'My combination of full-stack engineering, cloud-native architecture and AI/ML integration lets me lead cross-functional teams in delivering enterprise solutions that consistently exceed performance benchmarks — from banking platforms processing millions of requests to AI agents automating manual workflows.',
  pillars: [
    {
      icon: 'layers',
      title: 'Systems that scale',
      text: 'Microservices, event-driven pipelines and caching layers designed for enterprise load.',
    },
    {
      icon: 'zap',
      title: 'Interfaces that feel instant',
      text: 'Modular front-end architecture, lazy loading and performance budgets baked into delivery.',
    },
    {
      icon: 'spark',
      title: 'Intelligence on tap',
      text: 'LLM agents, RAG pipelines and prompt engineering wired into real business workflows.',
    },
  ],
}

/** Reverse chronological — most recent first. Current role sits at the top. */
export const experience = [
  {
    company: 'Independent Upskilling',
    location: 'Remote',
    role: 'AI & Cloud Engineering',
    period: 'Jan 2026 — Present',
    tag: 'Current focus',
    current: true,
    points: [
      'Intensive specialisation in OpenAI API, LangChain and prompt engineering.',
      'Built an AI agent with Next.js and Node.js that automates project file uploads end to end.',
      'Shipped full-stack AI products pairing Next.js front-ends with Node.js services.',
      'Practised vibe-coding methodology for rapid, iterative AI solution development and debugging.',
    ],
    stack: ['OpenAI API', 'LangChain', 'Next.js', 'Node.js', 'NLP', 'Prompt Eng.'],
  },
  {
    company: 'Infosys BPM',
    location: 'Bengaluru',
    role: 'Consultant',
    period: 'Aug 2025 — Dec 2025',
    tag: 'Enterprise delivery',
    points: [
      'Delivered enterprise application solutions with cross-functional teams against tight client requirements.',
      'Developed and maintained scalable back-end services with Node.js and Express.js.',
      'Integrated AI-powered automation tooling into existing workflows to lift operational efficiency.',
      'Owned API development and integration for business process management platforms.',
    ],
    stack: ['Node.js', 'Express.js', 'REST APIs', 'AI Automation', 'Agile'],
  },
  {
    company: 'Tata Consultancy Services',
    location: 'Bengaluru',
    role: 'Technical Lead',
    period: 'Apr 2023 — Aug 2025',
    tag: 'Cloud architecture',
    points: [
      'Architected cloud-native microservices and RESTful APIs on AWS — 40% improvement in deployment efficiency.',
      'Led and mentored a team of 5–7 developers, driving Agile delivery and sprint completion.',
      'Optimised database structures and queries — 50% reduction in response time on high-traffic systems.',
      'Engineered ETL workflows with AWS Glue, Lambda and S3 for automated, scalable data pipelines.',
      'Cut front-end load times by 30% through modular architecture and lazy loading.',
      'Built AI Playground environments for rapid prototyping and model experimentation.',
    ],
    stack: ['AWS', 'Spring Boot', 'Angular', 'Glue', 'Lambda', 'S3', 'React'],
  },
  {
    company: 'Integra Microsystems',
    location: 'Bengaluru',
    role: 'Senior Software Engineer',
    period: 'Nov 2019 — Apr 2023',
    tag: 'Backend & performance',
    points: [
      'Led development of scalable back-end systems with Node.js and Express.js for banking and kiosk platforms.',
      'Implemented Redis caching mechanisms — 60% improvement in system response time.',
      'Orchestrated asynchronous workflows with RabbitMQ for reliable background processing and notifications.',
      'Optimised API Gateway for authentication, rate limiting and service routing.',
      'Deployed on Nginx reverse proxy for load balancing and secure access.',
      'Tuned SQL queries, stored procedures and functions across MySQL and OracleDB.',
    ],
    stack: ['Node.js', 'Redis', 'RabbitMQ', 'Nginx', 'MySQL', 'OracleDB', 'Angular'],
  },
]

export const projects = [
  {
    id: 'aws-microservices',
    index: '01',
    tag: 'Cloud Architecture',
    title: 'AWS Microservices Migration',
    description:
      'Decomposed a monolithic enterprise application into cloud-native microservices on AWS, enabling independent scaling, isolated failure domains and on-demand releases.',
    impact: '40%',
    impactLabel: 'faster deployments',
    metrics: [
      { k: 'Deployment cycle', v: 92 },
      { k: 'Service isolation', v: 88 },
      { k: 'Operational load', v: 74 },
    ],
    stack: ['AWS', 'ECS', 'Lambda', 'API Gateway', 'Docker'],
    accent: 'acid',
    span: 'wide',
  },
  {
    id: 'db-optimization',
    index: '02',
    tag: 'Performance',
    title: 'Database Optimization Initiative',
    description:
      'Redesigned schema, index strategy and query patterns for high-traffic enterprise systems processing millions of daily requests.',
    impact: '50%',
    impactLabel: 'lower response time',
    metrics: [
      { k: 'Query latency', v: 94 },
      { k: 'Index efficiency', v: 81 },
      { k: 'Cache hit ratio', v: 89 },
    ],
    stack: ['MySQL', 'OracleDB', 'PL/SQL', 'Redis'],
    accent: 'blue',
  },
  {
    id: 'ai-agent',
    index: '03',
    tag: 'AI Integration',
    title: 'AI-Powered Automation Agent',
    description:
      'Designed an intelligent agent that parses natural-language instructions, classifies incoming project artefacts and automates uploads and downstream workflow routing.',
    impact: 'Automated',
    impactLabel: 'manual workflows',
    metrics: [
      { k: 'Manual steps removed', v: 96 },
      { k: 'Classification accuracy', v: 90 },
      { k: 'Time to ship', v: 70 },
    ],
    stack: ['Next.js', 'Node.js', 'LangChain', 'OpenAI API'],
    accent: 'red',
  },
  {
    id: 'etl-pipelines',
    index: '04',
    tag: 'Data Engineering',
    title: 'ETL Pipeline Automation',
    description:
      'Engineered serverless ETL workflows with AWS Glue, Lambda and S3 to turn nightly batch jobs into resilient, observable data pipelines.',
    impact: 'Serverless',
    impactLabel: 'data pipelines',
    metrics: [
      { k: 'Pipeline reliability', v: 93 },
      { k: 'Cost efficiency', v: 84 },
      { k: 'Observability', v: 79 },
    ],
    stack: ['AWS Glue', 'Lambda', 'S3', 'EventBridge'],
    accent: 'orange',
  },
  {
    id: 'dashboard-redesign',
    index: '05',
    tag: 'Frontend',
    title: 'Enterprise Dashboard Redesign',
    description:
      'Rebuilt a dense enterprise dashboard in Angular with modular architecture, route-level code splitting and a ruthless focus on perceived performance.',
    impact: '30%',
    impactLabel: 'faster load times',
    metrics: [
      { k: 'First paint', v: 87 },
      { k: 'Bundle reduction', v: 76 },
      { k: 'Interaction latency', v: 91 },
    ],
    stack: ['Angular', 'TypeScript', 'Tailwind', 'Lazy Loading'],
    accent: 'acid',
  },
  {
    id: 'banking-backend',
    index: '06',
    tag: 'Banking',
    title: 'Banking Platform Backend',
    description:
      'Built secure, high-availability back-end services for banking and kiosk-based enterprise platforms, with authentication, rate limiting and audit trails baked in.',
    impact: '60%',
    impactLabel: 'better performance',
    metrics: [
      { k: 'Throughput', v: 95 },
      { k: 'Availability', v: 92 },
      { k: 'Security posture', v: 89 },
    ],
    stack: ['Node.js', 'Express.js', 'RabbitMQ', 'Redis', 'Nginx'],
    accent: 'red',
  },
]

export const skillGroups = [
  {
    key: 'frontend',
    label: 'Frontend',
    icon: 'monitor',
    blurb: 'Interfaces tuned for speed and clarity.',
    skills: ['React', 'Angular', 'Next.js', 'TypeScript', 'Tailwind', 'HTML5', 'Redux'],
  },
  {
    key: 'backend',
    label: 'Backend',
    icon: 'server',
    blurb: 'APIs and services that hold under load.',
    skills: ['Node.js', 'Express.js', 'Spring Boot', 'Python', 'REST APIs', 'Microservices', 'GraphQL'],
  },
  {
    key: 'cloud',
    label: 'Cloud & DevOps',
    icon: 'cloud',
    blurb: 'Infrastructure as code, pipelines as product.',
    skills: ['AWS', 'Docker', 'Lambda', 'S3', 'RDS', 'Nginx', 'CI/CD', 'Linux'],
  },
  {
    key: 'data',
    label: 'Data & Messaging',
    icon: 'database',
    blurb: 'Reliable movement and storage of data.',
    skills: ['MySQL', 'OracleDB', 'MongoDB', 'PL/SQL', 'Redis', 'RabbitMQ', 'PySpark'],
  },
  {
    key: 'ai',
    label: 'AI & ML',
    icon: 'spark',
    blurb: 'Intelligence integrated into real workflows.',
    skills: ['OpenAI API', 'LangChain', 'NLP', 'Prompt Eng.', 'Hugging Face', 'TensorFlow', 'Gen AI'],
  },
  {
    key: 'leadership',
    label: 'Ways of Working',
    icon: 'compass',
    blurb: 'Teams that ship predictably.',
    skills: ['Agile / Scrum', 'TDD', 'System Design', 'Code Review', 'Mentoring', 'JIRA', '12-Factor'],
  },
]

export const marqueeItems = [
  'React',
  'Node.js',
  'TypeScript',
  'AWS',
  'Next.js',
  'Docker',
  'PostgreSQL',
  'LangChain',
  'Angular',
  'Python',
  'Kubernetes',
  'Redis',
  'Tailwind',
  'Spring Boot',
  'RabbitMQ',
  'OpenAI API',
  'GraphQL',
  'Terraform',
]

export const contact = {
  kicker: 'Get in touch',
  title: "Let's build something",
  titleAccent: 'great.',
  body: "I'm actively seeking opportunities to apply my experience across full-stack development, cloud architecture and AI integration. Tell me what you're building and I'll show you how I'd approach it.",
}

export const navLinks = [
  { id: 'about', label: 'About', index: '01' },
  { id: 'experience', label: 'Experience', index: '02' },
  { id: 'work', label: 'Work', index: '03' },
  { id: 'stack', label: 'Stack', index: '04' },
  { id: 'contact', label: 'Contact', index: '05' },
]
