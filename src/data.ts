import { Job, Freelancer, MessageThread, Notification, User, UserResume } from './types';

export function getSampleResume(profileName: string): UserResume {
  const sanitized = profileName.trim().replace(/\s+/g, '_') || 'Student';
  return {
    name: `${sanitized}_LaVerdad_Student_CV.pdf`,
    size: '240 KB',
    data: 'data:application/pdf;base64,JVBERi0xLjQKJUZpbGUgY29udGVudHMgZm9yIExWIFNraWxsU3luYyBTdHVkZW50IFJlc3VtZQ==',
    updatedAt: 'Oct 14, 2026',
  };
}

export const currentUser: User = {
  id: 'u1',
  name: 'Joshua Mislang',
  email: 'joshuamislang45@gmail.com',
  role: 'Freelancer',
  skill: 'UI/UX Designer',
  rating: 4.9,
  completedProjects: 42,
  responseRate: '98%',
  followers: 1250,
  reviews: 38,
  hiring_status: 'for_hire',
  avatar: 'https://i.pravatar.cc/150?u=u1',
  resume: getSampleResume('Joshua Mislang'),
};

export const categories = [
  'Graphic Design',
  'Programming',
  'Writing',
  'Tutoring',
  'Video Editing',
  'Digital Marketing',
  'Virtual Assistant',
  'UI/UX Design',
  'Mobile App Dev',
  'Prompt Engineering',
  'Data Analysis',
  'Motion Graphics',
];

export const featuredFreelancers: Freelancer[] = [
  { 
    id: 'f1', 
    name: 'Alice Chen', 
    email: 'alice.chen@student.laverdad.edu.ph',
    skill: 'Full Stack Dev', 
    rating: 4.9, 
    verified: true, 
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80', 
    hiring_status: 'for_hire',
    bio: 'BS Information Technology junior passionate about building performant React & Node.js web applications, responsive dashboards, and REST APIs.',
    degree: 'BS Information Technology (3rd Year)',
    campus: 'La Verdad Christian College',
    hourlyRate: '₱450/hr',
    completedProjects: 38,
    responseRate: '99%',
    reviewsCount: 34,
    skillsList: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'PostgreSQL', 'Next.js'],
    projects: [
      {
        id: 'p1',
        title: 'Campus Food Delivery Portal',
        category: 'Web Application',
        description: 'Built a full-stack ordering portal for campus canteens with live order status tracking and responsive mobile views.',
        clientRating: 5.0
      },
      {
        id: 'p2',
        title: 'Student Organization Management SaaS',
        category: 'Dashboard',
        description: 'Developed an administrative dashboard with role-based member approvals and event registration check-ins.',
        clientRating: 4.9
      }
    ],
    reviews: [
      {
        id: 'r1',
        clientName: 'Michael Scott',
        clientCompany: 'TechFlow Solutions',
        rating: 5.0,
        comment: 'Alice delivered an exceptional dashboard in record time. Clean TypeScript code and very communicative throughout the sprint.',
        date: 'Oct 12, 2026'
      },
      {
        id: 'r2',
        clientName: 'Daniel Vance',
        clientCompany: 'Campus Enterprise',
        rating: 4.8,
        comment: 'Super reliable student developer. Fixed tricky state bugs within hours.',
        date: 'Sep 28, 2026'
      }
    ]
  },
  { 
    id: 'f2', 
    name: 'Mark Johnson', 
    email: 'mark.johnson@student.laverdad.edu.ph',
    skill: 'Video Editor & Colorist', 
    rating: 4.8, 
    verified: true, 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80', 
    hiring_status: 'open_to_offers',
    bio: 'AB Broadcasting sophomore specializing in cinematic video editing, YouTube long-form pacing, dynamic TikTok/Reels captions, and DaVinci color grading.',
    degree: 'AB Broadcasting (2nd Year)',
    campus: 'La Verdad Christian College',
    hourlyRate: '₱380/hr',
    completedProjects: 27,
    responseRate: '95%',
    reviewsCount: 24,
    skillsList: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Color Grading', 'Sound Design'],
    projects: [
      {
        id: 'p3',
        title: 'Commercial Brand Reel for Nova Cafe',
        category: 'Commercial Video',
        description: 'Produced a 60-second 4K promotional clip featuring barista craft, cafe ambiance, and sound effects.',
        clientRating: 4.9
      }
    ],
    reviews: [
      {
        id: 'r3',
        clientName: 'Sarah Jenkins',
        clientCompany: 'Nova Cafe',
        rating: 4.9,
        comment: 'Mark brought our cafe aesthetics to life! Our Instagram reels views grew by 200% following his video edits.',
        date: 'Oct 04, 2026'
      }
    ]
  },
  { 
    id: 'f3', 
    name: 'Sarah Lopez', 
    email: 'sarah.lopez@student.laverdad.edu.ph',
    skill: 'SEO & Growth Strategist', 
    rating: 5.0, 
    verified: true, 
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80', 
    hiring_status: 'hiring',
    bio: 'BS Information Systems senior helping local businesses and SaaS startups dominate Google organic search with technical audits, keyword clustering, and content blueprints.',
    degree: 'BS Information Systems (4th Year)',
    campus: 'La Verdad Christian College',
    hourlyRate: '₱500/hr',
    completedProjects: 45,
    responseRate: '100%',
    reviewsCount: 42,
    skillsList: ['Technical SEO', 'Keyword Research', 'Google Analytics 4', 'Ahrefs', 'Content Strategy'],
    projects: [
      {
        id: 'p4',
        title: 'E-commerce SEO Overhaul (150% Traffic)',
        category: 'SEO Campaign',
        description: 'Restructured category URL schemas, optimized metadata, and published targeted buying guides that ranked in top 3.',
        clientRating: 5.0
      }
    ],
    reviews: [
      {
        id: 'r4',
        clientName: 'Alex Rivers',
        clientCompany: 'DevInsider',
        rating: 5.0,
        comment: 'Sarah is an absolute powerhouse. Her technical SEO audit resolved indexing hurdles we struggled with for months.',
        date: 'Sep 30, 2026'
      }
    ]
  },
  { 
    id: 'f4', 
    name: 'David Kim', 
    email: 'david.kim@student.laverdad.edu.ph',
    skill: 'Tech Copywriter & Blogger', 
    rating: 4.7, 
    verified: true, 
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80', 
    hiring_status: 'for_hire',
    bio: 'Communication Arts student creating conversion-focused landing page copy, technical whitepapers, and developer documentation that turns readers into users.',
    degree: 'AB Communication (3rd Year)',
    campus: 'La Verdad Christian College',
    hourlyRate: '₱350/hr',
    completedProjects: 31,
    responseRate: '96%',
    reviewsCount: 29,
    skillsList: ['Technical Writing', 'Copywriting', 'SEO Articles', 'Case Studies', 'Product Storytelling'],
    projects: [
      {
        id: 'p5',
        title: 'Web3 & API Developer Documentation',
        category: 'Documentation',
        description: 'Authored 12 developer guides and API onboarding walkthroughs for an open-source fintech client.',
        clientRating: 4.8
      }
    ],
    reviews: [
      {
        id: 'r5',
        clientName: 'Marcus Vance',
        clientCompany: 'FinTech Startup',
        rating: 4.8,
        comment: 'Clear, concise, and technically accurate writing. David understands complex architectures effortlessly.',
        date: 'Oct 02, 2026'
      }
    ]
  },
  { 
    id: 'f5', 
    name: 'Chloe Santos', 
    email: 'chloe.santos@student.laverdad.edu.ph',
    skill: 'UI/UX & Product Designer', 
    rating: 4.95, 
    verified: true, 
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80', 
    hiring_status: 'for_hire',
    bio: 'BS Information Technology student focused on human-centered UI/UX design, interactive Figma prototypes, design systems, and mobile app wireframing.',
    degree: 'BS Information Technology (2nd Year)',
    campus: 'La Verdad Christian College',
    hourlyRate: '₱420/hr',
    completedProjects: 29,
    responseRate: '98%',
    reviewsCount: 26,
    skillsList: ['Figma', 'User Research', 'Design Systems', 'Wireframing', 'Prototyping', 'Mobile UX'],
    projects: [
      {
        id: 'p6',
        title: 'FinHealth Mobile App Redesign',
        category: 'UI/UX Case Study',
        description: 'Complete user research and high-fidelity prototype redesign for a student budgeting mobile application.',
        clientRating: 5.0
      }
    ],
    reviews: [
      {
        id: 'r6',
        clientName: 'Elena Rostova',
        clientCompany: 'GreenSprout Organics',
        rating: 5.0,
        comment: 'Chloe has unmatched visual taste and empathy for users. Her prototypes were ready for developer handoff on day one.',
        date: 'Oct 11, 2026'
      }
    ]
  },
  { 
    id: 'f6', 
    name: 'Rafael Morales', 
    email: 'rafael.morales@student.laverdad.edu.ph',
    skill: 'Mobile App Developer', 
    rating: 4.9, 
    verified: true, 
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80', 
    hiring_status: 'open_to_offers',
    bio: 'Associate in Computer Technology student building cross-platform iOS and Android apps with Flutter, Firebase Auth, and SQLite offline synchronization.',
    degree: 'Associate in Computer Technology (Graduating)',
    campus: 'La Verdad Christian College',
    hourlyRate: '₱480/hr',
    completedProjects: 22,
    responseRate: '97%',
    reviewsCount: 20,
    skillsList: ['Flutter', 'Dart', 'React Native', 'Firebase', 'State Management', 'REST APIs'],
    projects: [
      {
        id: 'p7',
        title: 'Offline-First Attendance Scanner',
        category: 'Mobile Application',
        description: 'Built a QR-code attendance app used during college symposiums with instant offline storage and sync.',
        clientRating: 4.9
      }
    ],
    reviews: [
      {
        id: 'r7',
        clientName: 'David Sterling',
        clientCompany: 'Summit Venture Partners',
        rating: 4.9,
        comment: 'Rafael executed the mobile prototype flawlessly. Solid understanding of cross-platform state.',
        date: 'Oct 08, 2026'
      }
    ]
  },
  { 
    id: 'f7', 
    name: 'Bea Mendoza', 
    email: 'bea.mendoza@student.laverdad.edu.ph',
    skill: 'Motion & 3D Illustrator', 
    rating: 4.88, 
    verified: true, 
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80', 
    hiring_status: 'for_hire',
    bio: 'Passionate digital artist creating 3D product illustrations with Blender, Spline web 3D interactions, and Lottie animations for modern websites.',
    degree: 'AB Broadcasting (3rd Year)',
    campus: 'La Verdad Christian College',
    hourlyRate: '₱400/hr',
    completedProjects: 19,
    responseRate: '94%',
    reviewsCount: 17,
    skillsList: ['Blender 3D', 'Spline', 'Lottie', 'Illustrator', 'Motion Design'],
    projects: [
      {
        id: 'p8',
        title: 'Interactive 3D Hero Scene for Web',
        category: '3D Web Interaction',
        description: 'Created an interactive 3D laptop and phone model embedded with WebGL for a SaaS landing page.',
        clientRating: 4.9
      }
    ],
    reviews: [
      {
        id: 'r8',
        clientName: 'Oliver Ward',
        clientCompany: 'Artisan Guild',
        rating: 4.9,
        comment: 'The 3D assets added tremendous polish to our launch. Highly recommend Bea for motion and 3D work!',
        date: 'Oct 14, 2026'
      }
    ]
  },
  { 
    id: 'f8', 
    name: 'Kenneth Cruz', 
    email: 'kenneth.cruz@student.laverdad.edu.ph',
    skill: 'Python & Data Automation', 
    rating: 4.92, 
    verified: true, 
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80', 
    hiring_status: 'for_hire',
    bio: 'BS Information Systems student automating repetitive workflows, web scraping, data cleaning pipelines, and custom Python automation scripts.',
    degree: 'BS Information Systems (3rd Year)',
    campus: 'La Verdad Christian College',
    hourlyRate: '₱430/hr',
    completedProjects: 26,
    responseRate: '99%',
    reviewsCount: 23,
    skillsList: ['Python', 'Pandas', 'BeautifulSoup', 'FastAPI', 'Automation', 'Data Visualization'],
    projects: [
      {
        id: 'p9',
        title: 'Automated Lead Extraction Pipeline',
        category: 'Data Automation',
        description: 'Engineered an automated script fetching, sanitizing, and syncing business contact leads directly into Google Sheets.',
        clientRating: 5.0
      }
    ],
    reviews: [
      {
        id: 'r9',
        clientName: 'Dr. Evelyn Garcia',
        clientCompany: 'Apex Research Group',
        rating: 5.0,
        comment: 'Saved our research lab 40 hours of manual spreadsheet data entry. Extremely clean Python code!',
        date: 'Oct 09, 2026'
      }
    ]
  }
];

export const jobs: Job[] = [
  {
    id: 'j1',
    title: 'Senior React Developer',
    company: 'TechFlow Solutions',
    budget: '₱50,000',
    deadline: 'Oct 25, 2026',
    category: 'Programming',
    skills: ['React', 'TypeScript', 'Tailwind'],
    description: 'Looking for a skilled student or junior React developer to build an analytics dashboard with interactive metrics, chart widgets, and data filtering. Must be proficient in TypeScript and clean component hierarchies.',
    clientName: 'Michael Scott'
  },
  {
    id: 'j2',
    title: 'Brand Identity & Packaging Design',
    company: 'Nova Cafe',
    budget: '₱18,500',
    deadline: 'Nov 02, 2026',
    category: 'Graphic Design',
    skills: ['Illustrator', 'Branding', 'Logo Design', 'Packaging'],
    description: 'We need a complete visual identity refresh for our craft coffee shop: modern logo mark, coffee bean bag packaging, drink cups, and printable menu templates with an earthy minimalist aesthetic.',
    clientName: 'Sarah Jenkins'
  },
  {
    id: 'j3',
    title: 'Content Writer for Tech Blog & Guides',
    company: 'DevInsider',
    budget: '₱12,000',
    deadline: 'Nov 05, 2026',
    category: 'Writing',
    skills: ['Technical Writing', 'SEO', 'WordPress', 'Markdown'],
    description: 'Looking for a student writer to produce 4 high-quality articles on modern web development practices (Next.js vs Remix, Tailwind best practices). Topics and keyword briefs will be supplied.',
    clientName: 'Alex Rivers'
  },
  {
    id: 'j4',
    title: 'FinTech Mobile App UI/UX Redesign',
    company: 'FinTech Startup',
    budget: '₱28,000',
    deadline: 'Nov 12, 2026',
    category: 'UI/UX Design',
    skills: ['Figma', 'User Testing', 'Mobile UX', 'Design Systems'],
    description: 'We need an intuitive, modern revamp of our student savings and expense tracking mobile app. Deliverables include wireframes, clickable high-fidelity Figma prototype, and interactive user flows.',
    clientName: 'Marcus Vance'
  },
  {
    id: 'j5',
    title: 'Viral Video Reel & Short-form Editor',
    company: 'Campus Buzz Media',
    budget: '₱15,000',
    deadline: 'Oct 30, 2026',
    category: 'Video Editing',
    skills: ['Premiere Pro', 'CapCut Pro', 'Sound Design', 'Motion Graphics'],
    description: 'Need a creative video editor to transform 10 raw interview and event recordings into punchy 30-60 second reels for TikTok and Instagram with kinetic captions, sound effects, and smooth transitions.',
    clientName: 'Clara Santos'
  },
  {
    id: 'j6',
    title: 'Python Web Scraping & Data Cleaning Pipeline',
    company: 'Apex Research Group',
    budget: '₱16,500',
    deadline: 'Nov 08, 2026',
    category: 'Programming',
    skills: ['Python', 'Pandas', 'BeautifulSoup', 'CSV / Excel'],
    description: 'Develop a reliable automated script to gather public academic conference listings, clean duplicated records, extract publication dates, and output a structured CSV format.',
    clientName: 'Dr. Evelyn Garcia'
  },
  {
    id: 'j7',
    title: 'Social Media Growth & Content Creator',
    company: 'GreenSprout Organics',
    budget: '₱14,000',
    deadline: 'Nov 14, 2026',
    category: 'Digital Marketing',
    skills: ['Canva', 'Social Media Strategy', 'Copywriting', 'Instagram'],
    description: 'Seeking a creative student to curate a monthly calendar of 20 educational feed posts, carousel graphics, and community caption prompts for our sustainable health brand.',
    clientName: 'Elena Rostova'
  },
  {
    id: 'j8',
    title: 'College Math & Discrete Math Peer Tutor',
    company: 'Academix Tutoring Hub',
    budget: '₱9,000',
    deadline: 'Nov 01, 2026',
    category: 'Tutoring',
    skills: ['Calculus', 'Discrete Math', 'Logic', 'Virtual Teaching'],
    description: 'Conduct 8 online 1-on-1 tutoring sessions to help freshmen understand sets, functions, recurrence relations, and mathematical proofs prior to midterms.',
    clientName: 'Prof. Ronald Lim'
  },
  {
    id: 'j9',
    title: 'Executive Virtual Assistant & Inbox Organizer',
    company: 'Summit Venture Partners',
    budget: '₱15,500',
    deadline: 'Nov 18, 2026',
    category: 'Virtual Assistant',
    skills: ['Google Calendar', 'Notion', 'Email Management', 'Google Sheets'],
    description: 'Assist our venture partner with organizing investor meetings, screening pitch emails, drafting meeting summaries, and updating Notion project boards (10 hrs/week flexible student hours).',
    clientName: 'David Sterling'
  },
  {
    id: 'j10',
    title: 'WordPress Speed Optimization & Elementor Fixes',
    company: 'Artisan Bakers Guild',
    budget: '₱17,000',
    deadline: 'Nov 20, 2026',
    category: 'Programming',
    skills: ['WordPress', 'Elementor', 'PageSpeed', 'CSS'],
    description: 'Optimize our bakery directory website for mobile performance: reduce page load times from 6s to under 2s, optimize images, resolve layout shifts, and clean unused plugins.',
    clientName: 'Oliver Ward'
  }
];

export const messages: MessageThread[] = [
  { 
    id: 'm1', 
    userId: 'c1', 
    name: 'TechFlow Solutions', 
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80', 
    lastMessage: 'That looks great! Can we deploy tomorrow?', 
    timestamp: '10:42 AM', 
    unread: true 
  },
  { 
    id: 'm2', 
    userId: 'c2', 
    name: 'Nova Cafe', 
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', 
    lastMessage: 'I sent over the revised logo files.', 
    timestamp: 'Yesterday', 
    unread: false 
  },
  { 
    id: 'm3', 
    userId: 'c3', 
    name: 'DevInsider', 
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 
    lastMessage: 'When are you available for a quick call?', 
    timestamp: 'Mon', 
    unread: false 
  },

  { 
    id: 'm5', 
    userId: 'c5', 
    name: 'FinTech Startup (Marcus)', 
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', 
    lastMessage: 'We reviewed your student proposal for the mobile app redesign!', 
    timestamp: 'Oct 14', 
    unread: false 
  },
  { 
    id: 'm6', 
    userId: 'c6', 
    name: 'GreenSprout Organics', 
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', 
    lastMessage: 'Do you offer bundle rates for carousel designs and brand illustrations?', 
    timestamp: 'Oct 11', 
    unread: false 
  }
];

export const notifications: Notification[] = [
  { id: 'n1', title: 'Application Accepted', description: 'TechFlow Solutions accepted your proposal!', time: '2 hours ago', type: 'success' },
  { id: 'n2', title: 'New Job Posted', description: 'A new job matching your skills was posted.', time: '5 hours ago', type: 'info' },
  { id: 'n3', title: 'Student Talent Showcase', description: 'Your portfolio was featured in this week\'s campus creator spotlight!', time: '1 day ago', type: 'success' },
  { id: 'n4', title: 'Profile Viewed', description: 'Your profile was viewed by 5 clients this week.', time: '2 days ago', type: 'info' },
];
