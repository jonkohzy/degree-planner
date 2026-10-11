export type RequirementTag =
  | 'ge-digital'
  | 'ge-expression'
  | 'ge-culture'
  | 'ge-data'
  | 'ge-singapore'
  | 'ge-community'
  | 'ethics'
  | 'id'
  | 'cd'
  | 'foundation'
  | 'math-calculus'
  | 'math-linear'
  | 'math-statistics'
  | 'breadth'
  | 'industry'
  | 'dissertation'
  | 'ue';

export type FocusArea =
  | 'Algorithms & Theory'
  | 'Artificial Intelligence'
  | 'Computer Graphics & Games'
  | 'Computer Security'
  | 'Database Systems'
  | 'Multimedia Information Retrieval'
  | 'Networking & Distributed Systems'
  | 'Parallel Computing'
  | 'Programming Languages'
  | 'Software Engineering';

export type Course = {
  code: string;
  title: string;
  units: number;
  tags: RequirementTag[];
  requirementUnits?: Partial<Record<RequirementTag, number>>;
  group: string;
  focusPrimary?: FocusArea[];
  focusElective?: FocusArea[];
  note?: string;
};

export const TAG_LABELS: Record<RequirementTag, string> = {
  'ge-digital': 'Digital Literacy',
  'ge-expression': 'Critique & Expression',
  'ge-culture': 'Cultures & Connections',
  'ge-data': 'Data Literacy',
  'ge-singapore': 'Singapore Studies',
  'ge-community': 'Communities & Engagement',
  ethics: 'Computing Ethics',
  id: 'Interdisciplinary',
  cd: 'Cross-disciplinary',
  foundation: 'CS Foundation',
  'math-calculus': 'Calculus',
  'math-linear': 'Linear Algebra',
  'math-statistics': 'Statistics',
  breadth: 'CS Breadth & Depth',
  industry: 'Industry Experience',
  dissertation: 'BComp Dissertation',
  ue: 'Unrestricted Elective',
};

const course = (
  code: string,
  title: string,
  tags: RequirementTag[],
  group: string,
  units = 4,
  extra: Partial<Course> = {},
): Course => ({ code, title, tags, group, units, ...extra });

const cultures: Array<[string, string]> = [
  ['GEC1000', 'Globalisation and New Media'],
  ['GEC1001', 'Chinese Music, Language and Literature'],
  ['GEC1002', 'Nations & Nationalism in South Asia'],
  ['GEC1003', 'Pirates, Oceans and the Maritime World'],
  ['GEC1004', 'Samurai, Geisha, Yakuza as Self or Other'],
  ['GEC1005', 'Cultural Borrowing: Japan and China'],
  ['GEC1006', 'Understanding Consumption'],
  ['GEC1007', 'Geopolitics: Geographies of War & Peace'],
  ['GEC1008', 'Exploring Chinese Cinema: Shanghai–Hong Kong–Singapore'],
  ['GEC1009', 'Drugs and Society'],
  ['GEC1010', 'Clean Energy and Storage'],
  ['GEC1011', 'Microbes Which Changed Human History'],
  ['GEC1012', 'Understanding Globalisation'],
  ['GEC1013', 'World Religions'],
  ['GEC1014', 'Social and Cultural Studies Through Music'],
  ['GEC1015', 'Public Health in Action'],
  ['GEC1016', 'Plants and Society'],
  ['GEC1017', 'Film Art and Human Concerns'],
  ['GEC1018', 'Names as Markers of Socio-Cultural Identity'],
  ['GEC1019', 'Religion and Film'],
  ['GEC1020', 'Cultural Diversity in the Contemporary World'],
  ['GEC1021', 'The Theatre Experience'],
  ['GEC1023', 'Social History of the Piano'],
  ['GEC1024', 'Ghosts and Spirits in Society and Culture'],
  ['GEC1025', 'The Life Aquatic: Machines and the Making of the Ocean'],
  ['GEC1026', 'Art in Asia: Through Media, Style, Space and Time'],
  ['GEC1027', 'Culture in Action'],
  ['GEC1028', 'Luck'],
  ['GEC1029', 'Worlds of Football'],
  ['GEC1030', 'Metropolis: The City in World History'],
  ['GEC1031', 'Whatever It Takes? Making War on Civilians'],
  ['GEC1032', 'Home'],
  ['GEC1033', "Maverick or Mahatma? Gandhi's Life & Legacy"],
  ['GEC1034', 'Understanding the Changing Global Economic Landscape'],
  ['GEC1034T', 'Understanding the Changing Global Economic Landscape'],
  ['GEC1035', 'Patrons of the Arts'],
  ['GEC1036', 'Radiation: Scientific Understanding and Public Perception'],
  ['GEC1037', 'Big Picture History'],
  ['GEC1038', 'Asian Cinema: The Silent Era'],
  ['GEC1039', 'International Relations of Asia'],
  ['GEC1040', 'A Culture of Sustainability'],
  ['GEC1040T', 'A Culture of Sustainability'],
  ['GEC1041', 'Crime Fiction and Film across Space & Time'],
  ['GEC1042', 'Fashion: East and West'],
  ['GEC1043', 'Feasting and Fasting: Global Histories of Food'],
  ['GEC1044', 'Chinese Medicine: Theory and Practice'],
  ['GEC1045', 'Forbidden Romance in Modern Times: East and West'],
  ['GEC1046', 'Magic, Myths and Society in Southeast Asia'],
  ['GEC1048', 'Death and Dying in the Human Experience'],
  ['GEC1049', 'Powerful Court Women from Qing China and Other Cultures'],
  ['GEC1050', 'Skyscapes: Cultural Interpretations of the Sky'],
  ['GEC1051', 'Merchants, Guns and Money: The Economics of War'],
  ['GEC1052', 'From Traveller to Tourist'],
  ['GEC1053', 'Rome and the Genealogy of Urban Life'],
  ['GEC1054', 'Fungi and Society'],
  ['GEC1055', '700 Years of Visual Arts: Singapore in the World'],
];

const singaporeStudies: Array<[string, string]> = [
  ['GESS1000', 'Global EC Dimensions of Singapore'],
  ['GESS1000T', 'Global EC Dimensions of Singapore'],
  ['GESS1001', 'Changing Landscapes of Singapore'],
  ['GESS1002', "The Biophysical Environment of Singapore"],
  ['GESS1003', 'Everyday Life of Chinese Singaporeans: Past & Present'],
  ['GESS1004', 'Singapore and India: Emerging Relations'],
  ['GESS1005', 'South Asia in Singapore'],
  ['GESS1006', 'Ethnicity and Nation-Building: Singapore and Malaysia'],
  ['GESS1007', "Singapore's Business History"],
  ['GESS1008', 'Nation-Building in Singapore'],
  ['GESS1009', 'The Evolution of a Global City-State'],
  ['GESS1010', 'Popular Culture in Singapore'],
  ['GESS1011', 'Singapore Architecture and Built Heritage'],
  ['GESS1012', 'Islam and Contemporary Malay Society'],
  ['GESS1013', 'Singapore and Japan: Historical and Contemporary Relationships'],
  ['GESS1014', "Managing Singapore's Built Environment"],
  ['GESS1015', 'Western Music Within a Singaporean Context'],
  ['GESS1016', 'Natural Heritage of Singapore'],
  ['GESS1017', 'Representing Singapore'],
  ['GESS1018', 'Real Estate Development & Investment Law'],
  ['GESS1019', 'Urban Planning in Singapore'],
  ['GESS1020', 'Singapore Society'],
  ['GESS1021', 'Singapore Film: Performance of Identity'],
  ['GESS1022', 'Culture and Communication in Singapore'],
  ['GESS1023', 'Who Moved My OB Markers?'],
  ['GESS1024', "We the Citizens — Understanding Singapore's Politics"],
  ['GESS1025', 'Singapore: Imagining the Next 50 Years'],
  ['GESS1026', 'A History of Singapore in Ten Objects'],
  ['GESS1026T', 'A History of Singapore in Ten Objects'],
  ['GESS1027', 'La Kopi: Forging of the Chinese Singaporean Community'],
  ['GESS1028', 'Cultural Performance and Practices in Singapore'],
  ['GESS1029', 'Everyday Ethics in Singapore'],
  ['GESS1030', 'Public Health in Singapore: Challenges and Changes'],
  ['GESS1031', 'State of the Art: A Current View of Music in Singapore'],
  ['GESS1032', 'Prominent Chinese in Colonial Singapore'],
  ['GESS1033', 'The Singlish Controversy'],
  ['GESS1034', 'Singapore Literature in English: Selected Texts'],
  ['GESS1035', 'Singapore and the Sea'],
  ['GESS1036', 'Singapore Employment Law and Policies'],
  ['GESS1036T', 'Singapore Employment Law and Policies'],
  ['GESS1037', 'Gender and Sexuality: A Singaporean History'],
  ['GESS1038', 'The Arts in Singapore Today'],
];

const communities: Array<[string, string]> = [
  ['GEN2000', 'Living Culture: Engaging Indian Communities in Singapore'],
  ['GEN2001', 'Theatre and Community Engagement'],
  ['GEN2002X', 'Projects Against Threat to Community'],
  ['GEN2002Y', 'Projects Against Threat to Community'],
  ['GEN2003', 'Inclusivity and Equality: Domestic Worker Community'],
  ['GEN2004', 'Green Communities in Action: Climate, Species, Crisis'],
  ['GEN2005', 'Chineseness: Engaging Singapore Chinese Communities'],
  ['GEN2006', 'Communications for Inter-generational Engagement'],
  ['GEN2007', 'Resilience in Restoration'],
  ['GEN2008', 'Purposeful and Productive Ageing in the Community'],
  ['GEN2009', 'Voices from the Ground: Stories & Community Narratives'],
  ['GEN2050X', 'Teach SG'],
  ['GEN2050Y', 'Teach SG'],
  ['GEN2060X', 'Reconnect SeniorsSG'],
  ['GEN2060Y', 'Reconnect SeniorsSG'],
  ['GEN2061X', 'Support Healthy AgeingSG'],
  ['GEN2061Y', 'Support Healthy AgeingSG'],
  ['GEN2062X', 'Community Activities for Seniors'],
  ['GEN2062Y', 'Community Activities for Seniors'],
  ['GEN2070X', 'Community Link (ComLink) Befrienders'],
  ['GEN2070Y', 'Community Link (ComLink) Befrienders'],
  ['GEN2072X', 'Enable Inclusive Communities SG'],
  ['GEN2072Y', 'Enable Inclusive Communities SG'],
];

const idCourses: Array<[string, string]> = [
  ['CDE2501', 'Sustainable Systems for Liveable Cities'],
  ['EG2501', 'Liveable Cities'],
  ['DTK1234', 'Design Thinking'],
  ['EG1311', 'Design and Make'],
  ['IE2141', 'Systems Thinking and Dynamics'],
  ['PF1101A', 'Project Management and Finance'],
  ['PF1101', 'Project Management and Finance (old code)'],
  ['IS1128', 'IT, Management and Organisation'],
  ['IS2218', 'Digital Platforms for Businesses'],
  ['IS2238', 'Economics of IT and AI'],
  ['HSH1000', 'The Human Condition'],
  ['HSS1000', 'Understanding Social Complexity'],
  ['HSA1000', 'Asian Interconnections'],
  ['HSI1000', 'How Science Works, Why Science Works'],
  ['HSI2001', 'Scientific Inquiry & Health: Good Science, Bad Science'],
  ['HSI2002', 'Inquiry into Current Sporting Beliefs and Practices'],
  ['HSI2003', 'From DNA to Gene Therapy'],
  ['HSI2004', 'Cell Based Proteins for a Sustainable Future'],
  ['HSI2005', 'Our Science Stories and You'],
  ['HSI2007', 'Deconstructing Food'],
  ['HSI2008', 'A Brief History of Science & Why Things Often Go Wrong'],
  ['HSI2009', 'What is a Planet?'],
  ['HSI2010', 'New Worlds Beyond Earth'],
  ['HSI2011', 'The World of Quantum'],
  ['HSI2013', 'The Science of Music'],
  ['HSI2014', 'Science, Medical Technology and Society'],
];

const cdCourses: Array<[string, string]> = [
  ['ACC1701', 'Accounting for Decision Makers'],
  ['ACC1701X', 'Accounting for Decision Makers'],
  ['ACC1701XA', 'Accounting for Decision Makers'],
  ['ACC1701XB', 'Accounting for Decision Makers'],
  ['ACC1701XC', 'Accounting for Decision Makers'],
  ['ACC1701XD', 'Accounting for Decision Makers'],
  ['DAO2703', 'Operations and Technology Management'],
  ['MNO1706X', 'Organisational Behavior'],
  ['SC1101E', 'Making Sense of Society'],
  ['EL1101E', 'The Nature of Language'],
  ['PE2101P', 'Introduction to Philosophy, Politics and Economics'],
  ['GE2103', 'Our Planet: An Earth System Science Perspective'],
  ['XD3103', 'Planet Earth'],
  ['GE3253', 'Weather and Climate'],
  ['GE3255', 'Aquatic, Riparian and Coastal Systems'],
  ['GE3256', 'Earth Surface Processes, Landforms and Ecosystems'],
  ['SPH2002', 'Public Health and Epidemiology'],
  ['SC2226', 'Sociology of Mental Health'],
  ['NUR1113A', 'Healthy Ageing and Well-being'],
  ['CDE2300', 'Product Design and Innovation'],
  ['CDE2310', 'Fundamentals of Systems Design'],
  ['EG2201A', 'User-Centred Collaborative Design'],
  ['EG2310', 'Fundamentals of Systems Design'],
];

const foundationCourses: Course[] = [
  course('CS1231S', 'Discrete Structures', ['foundation'], 'Programme · CS Foundation'),
  course('CS2030S', 'Programming Methodology II', ['foundation'], 'Programme · CS Foundation'),
  course('CS2040S', 'Data Structures and Algorithms', ['foundation'], 'Programme · CS Foundation'),
  course('CS2100', 'Computer Organisation', ['foundation'], 'Programme · CS Foundation'),
  course('CS2101', 'Effective Communication for Computing Professionals', ['foundation'], 'Programme · CS Foundation'),
  course('CS2103T', 'Software Engineering', ['foundation'], 'Programme · CS Foundation', 4, { focusPrimary: ['Software Engineering'] }),
  course('CS2106', 'Introduction to Operating Systems', ['foundation'], 'Programme · CS Foundation'),
  course('CS2109S', 'Introduction to AI and Machine Learning', ['foundation'], 'Programme · CS Foundation', 4, { focusPrimary: ['Artificial Intelligence'] }),
  course('CS3230', 'Design and Analysis of Algorithms', ['foundation'], 'Programme · CS Foundation', 4, { focusPrimary: ['Algorithms & Theory'] }),
];

const focusPrimaries: Record<FocusArea, Array<[string, string]>> = {
  'Algorithms & Theory': [
    ['CS3230', 'Design and Analysis of Algorithms'], ['CS3231', 'Theory of Computation'],
    ['CS3236', 'Introduction to Information Theory'], ['CS4231', 'Parallel and Distributed Algorithms'],
    ['CS4232', 'Theory of Computation (no longer offered)'], ['CS4234', 'Optimisation Algorithms'],
    ['CS4330', 'Combinatorial Methods in Bioinformatics'], ['CS4430', 'Computational Complexity'],
  ],
  'Artificial Intelligence': [
    ['CS2109S', 'Introduction to AI and Machine Learning'], ['CS3243', 'Introduction to Artificial Intelligence'],
    ['CS3244', 'Machine Learning'], ['CS3263', 'Foundations of Artificial Intelligence'],
    ['CS3264', 'Foundations of Machine Learning'], ['CS3268', 'Responsible AI: From Algorithms to Impact'],
    ['CS4243', 'Computer Vision and Pattern Recognition'], ['CS4244', 'Knowledge Representation and Reasoning'],
    ['CS4246', 'Reinforcement Learning and Sequential Decision Making'], ['CS4248', 'Introduction to Large Language Models'],
    ['CS4262', 'Machine Learning Systems'], ['CS4263', 'Artificial Intelligence Principles'],
  ],
  'Computer Graphics & Games': [
    ['CS3241', 'Computer Graphics'], ['CS3242', '3D Modelling and Animation'],
    ['CS3247', 'Game Development'], ['CS4247', 'Graphics Rendering Techniques'],
    ['CS4350', 'Game Development Project'],
  ],
  'Computer Security': [
    ['CS2107', 'Introduction to Information Security'], ['CS3235', 'Computer Security'],
    ['CS4230', 'Foundations of Modern Cryptography'], ['CS4236', 'Cryptography in Practice: Systems and Applications'],
    ['CS4238', 'Computer Security Practice'], ['CS4239', 'Software Security'],
  ],
  'Database Systems': [
    ['CS2102', 'Database Systems'], ['CS3223', 'Database Systems Implementation'],
    ['CS4221', 'Database Applications Design and Tuning'], ['CS4224', 'Distributed Databases'],
    ['CS4225', 'Big Data Systems for Data Science'],
  ],
  'Multimedia Information Retrieval': [
    ['CS2108', 'Introduction to Media Computing'], ['CS3245', 'Information Retrieval'],
    ['CS4242', 'Social Media Computing'], ['CS4248', 'Natural Language Processing / Large Language Models'],
    ['CS4347', 'Sound and Music Computing'],
  ],
  'Networking & Distributed Systems': [
    ['CS2105', 'Introduction to Computer Networks'], ['CS3103', 'Computer Networks Practice'],
    ['CS4222', 'Wireless Networking'], ['CS4226', 'Internet Architecture'],
    ['CS4231', 'Parallel and Distributed Algorithms'],
  ],
  'Parallel Computing': [
    ['CS3210', 'Parallel Computing'], ['CS3211', 'Parallel and Concurrent Programming'],
    ['CS4223', 'Multi-core Architecture'], ['CS4231', 'Parallel and Distributed Algorithms'],
  ],
  'Programming Languages': [
    ['CS2104', 'Programming Language Concepts'], ['CS3211', 'Parallel and Concurrent Programming'],
    ['CS4212', 'Compiler Design'], ['CS4215', 'Programming Language Implementation'],
  ],
  'Software Engineering': [
    ['CS2103T', 'Software Engineering'], ['CS3213', 'Software Requirements Specification and Validation'],
    ['CS3217', 'Software Engineering on Modern Application Platforms'], ['CS3219', 'Software Design and Architecture'],
    ['CS3227', 'Agentic Software Engineering'], ['CS3282', 'Software Engineering for Evolving Production Systems II'],
    ['CS4211', 'Formal Methods for Software Engineering'], ['CS4218', 'Software Testing'],
    ['CS4239', 'Software Security'],
  ],
};

const focusElectiveCodes: Record<FocusArea, string[]> = {
  'Algorithms & Theory': ['CS3233', 'CS4257', 'CS4261', 'CS4268', 'CS4269', 'CS5230', 'CS5234', 'CS5236', 'CS5237', 'CS5238', 'CS5330'],
  'Artificial Intelligence': ['CS4220', 'CS4261', 'CS4269', 'CS4277', 'CS4278', 'CS5215', 'CS5228', 'CS5242', 'CS5260', 'CS5339', 'CS5340'],
  'Computer Graphics & Games': ['CS3218', 'CS3240', 'CS3249', 'CS4240', 'CS4243', 'CS4249', 'CS4351', 'CS5237', 'CS5240', 'CS5343', 'CS5346'],
  'Computer Security': ['CS3221', 'CS4257', 'CS4276', 'CS5231', 'CS5250', 'CS5321', 'CS5322', 'CS5331', 'CS5332', 'IFS4101', 'IFS4102', 'IFS4103'],
  'Database Systems': ['CS4220', 'CS5226', 'CS5228', 'CS5322'],
  'Multimedia Information Retrieval': ['CS5241', 'CS5246'],
  'Networking & Distributed Systems': ['CS3237', 'CS4344', 'CS5223', 'CS5224', 'CS5229', 'CS5248', 'CS5321'],
  'Parallel Computing': ['CS5222', 'CS5223', 'CS5224', 'CS5239', 'CS5250'],
  'Programming Languages': ['CS3234', 'CS4216', 'CS5214', 'CS5215', 'CS5218', 'CS5232'],
  'Software Engineering': ['CS3203', 'CS3216', 'CS3226', 'CS3234', 'CS3281', 'CS5219', 'CS5232', 'CS5272'],
};

const focusElectiveTitles: Record<string, string> = {
  CS3203: 'Software Engineering Project',
  CS3216: 'Software Product Engineering for Digital Markets',
  CS3218: 'Multimodal Processing in Mobile Platforms',
  CS3221: 'Operating Systems Design and Pragmatics',
  CS3226: 'Web Programming and Applications',
  CS3233: 'Competitive Programming',
  CS3234: 'Logic for Proofs and Programs',
  CS3237: 'Introduction to Internet of Things',
  CS3240: 'Interaction Design',
  CS3249: 'Conversational User Interface',
  CS3281: 'Software Engineering for Evolving Production Systems I',
  CS4216: 'Constraint Logic Programming',
  CS4220: 'Knowledge Discovery Methods in Bioinformatics',
  CS4240: 'Interaction Design for Virtual and Augmented Reality',
  CS4243: 'Computer Vision and Pattern Recognition',
  CS4249: 'Quantitative Methods of Human-Computer Interaction',
  CS4257: 'Algorithmic Foundations of Privacy',
  CS4261: 'Algorithmic Mechanism Design',
  CS4268: 'Quantum Computing',
  CS4269: 'Fundamentals of Logic in Computer Science',
  CS4276: 'IoT Security',
  CS4277: '3D Computer Vision',
  CS4278: 'Intelligent Robots: Algorithms and Systems',
  CS4344: 'Networked and Mobile Gaming',
  CS4351: 'Real-time Graphics',
  CS5214: 'Design of Optimising Compilers',
  CS5215: 'Constraint Processing',
  CS5218: 'Principles and Practice of Program Analysis',
  CS5219: 'Automated Software Validation',
  CS5222: 'Advanced Computer Architecture',
  CS5223: 'Distributed Systems',
  CS5224: 'Cloud Computing',
  CS5226: 'Database Tuning',
  CS5228: 'Knowledge Discovery and Data Mining',
  CS5229: 'Advanced Computer Networks',
  CS5230: 'Computational Complexity',
  CS5231: 'Systems Security',
  CS5232: 'Formal Specification and Design Techniques',
  CS5234: 'Algorithms at Scale',
  CS5236: 'Advanced Automata Theory',
  CS5237: 'Computational Geometry and Applications',
  CS5238: 'Advanced Combinatorial Methods in Bioinformatics',
  CS5239: 'Performance Analysis of Computer Systems',
  CS5240: 'Theoretical Foundations in MultiMedia',
  CS5241: 'Speech Processing',
  CS5242: 'Neural Networks and Deep Learning',
  CS5246: 'Text Mining',
  CS5248: 'Systems Support for Continuous Media',
  CS5250: 'Advanced Operating Systems',
  CS5260: 'Neural Networks and Deep Learning II',
  CS5272: 'Embedded Software Design',
  CS5321: 'Network Security',
  CS5322: 'Database Security',
  CS5330: 'Randomized Algorithms',
  CS5331: 'Web Security',
  CS5332: 'Biometric Authentication',
  CS5339: 'Theory and Algorithms for Machine Learning',
  CS5340: 'Uncertainty Modelling in AI',
  CS5343: 'Advanced Computer Animation',
  CS5346: 'Information Visualisation',
  IFS4101: 'Legal Aspects of Information Security',
  IFS4102: 'Digital Forensics',
  IFS4103: 'Penetration Testing Practice',
};

const foundationCodes = new Set(foundationCourses.map((item) => item.code));

const focusCourses: Course[] = Object.entries(focusPrimaries).flatMap(([area, courses]) =>
  courses.map(([codeValue, title]) =>
    course(
      codeValue,
      title,
      foundationCodes.has(codeValue) ? [] : ['breadth'],
      `Focus primary · ${area}`,
      4,
      { focusPrimary: [area as FocusArea], note: 'Live focus-area list; offering and cohort applicability can change.' },
    ),
  ),
);

const focusElectives: Course[] = Object.entries(focusElectiveCodes).flatMap(([area, codes]) =>
  codes.map((codeValue) =>
    course(codeValue, focusElectiveTitles[codeValue], ['breadth'], `Focus elective · ${area}`, 4, {
      focusElective: [area as FocusArea],
      note: 'Availability and cohort applicability can change; focus electives do not count as Area Primaries.',
    }),
  ),
);

const baseCourses: Course[] = [
  course('CS1101S', 'Programming Methodology', ['ge-digital'], 'Common · University Pillars'),
  course('ES2660', 'Communicating in the Information Age', ['ge-expression'], 'Common · University Pillars'),
  course('GEA1000', 'Quantitative Reasoning with Data', ['ge-data'], 'Common · Data Literacy'),
  course('BT1101', 'Introduction to Business Analytics', ['ge-data'], 'Common · Data Literacy'),
  course('ST1131', 'Introduction to Statistics and Statistical Computing', ['ge-data'], 'Common · Data Literacy'),
  course('DSA1101', 'Introduction to Data Science', ['ge-data'], 'Common · Data Literacy'),
  course('IS1108', 'Digital and AI Ethics', ['ethics'], 'Common · Computing Ethics'),
  ...cultures.map(([codeValue, title]) => course(codeValue, title, ['ge-culture'], 'Common · Cultures & Connections')),
  ...singaporeStudies.map(([codeValue, title]) => course(codeValue, title, ['ge-singapore'], 'Common · Singapore Studies')),
  ...communities.map(([codeValue, title]) => course(codeValue, title, ['ge-community'], 'Common · Communities & Engagement')),
  ...idCourses.map(([codeValue, title]) => {
    const tags: RequirementTag[] = ['id'];
    if (['CDE2501', 'EG2501', 'HSS1000'].includes(codeValue)) tags.push('ge-singapore');
    if (codeValue === 'HSA1000') tags.push('ge-culture');
    return course(codeValue, title, tags, 'Common · Interdisciplinary');
  }),
  ...cdCourses.map(([codeValue, title]) => course(codeValue, title, ['cd'], 'Common · Cross-disciplinary')),
  ...foundationCourses,
  course('MA1521', 'Calculus for Computing', ['math-calculus'], 'Programme · Mathematics & Sciences'),
  course('MA1522', 'Linear Algebra for Computing', ['math-linear'], 'Programme · Mathematics & Sciences'),
  course('MA2001', 'Linear Algebra I', ['math-linear'], 'Programme · Mathematics & Sciences'),
  course('ST2334', 'Probability and Statistics', ['math-statistics'], 'Programme · Mathematics & Sciences'),
  course('CP3880', 'Advanced Technology Attachment Programme', ['breadth', 'industry'], 'Programme · Industry Experience', 12),
  course('IS4010', 'Digital Transformation Leadership Programme', ['breadth', 'industry'], 'Programme · Industry Experience', 12),
  course('ETP3201L', 'Innovation & Enterprise Internship', ['breadth', 'industry'], 'Programme · Industry Experience', 12),
  course('ETP3206L', 'Innovation & Enterprise Internship', ['breadth', 'industry', 'ue'], 'Programme · Industry Experience', 16, {
    requirementUnits: { breadth: 12, industry: 12, ue: 4 },
    note: '12 of 16 units may map to Industry Experience; the remaining 4 map to UE.',
  }),
  course('TR3202', 'Start-up Internship Programme (historic code)', ['breadth', 'industry'], 'Programme · Industry Experience', 12),
  course('CP3200', 'Internship', ['breadth', 'industry'], 'Programme · Industry Experience', 6),
  course('CP3202', 'Internship II', ['breadth', 'industry'], 'Programme · Industry Experience', 6),
  course('CP3107', 'Computing for Social Service Agencies I', ['ge-community', 'breadth', 'industry'], 'Dual-count · GEN + Industry Experience', 6),
  course('CP3110', 'Computing for Social Service Agencies II', ['ge-community', 'breadth', 'industry'], 'Dual-count · GEN + Industry Experience', 6),
  course('ETP3205', 'Innovation & Enterprise Internship', ['breadth', 'industry'], 'Programme · Industry Experience', 6),
  course('CP4101', 'BComp Dissertation', ['breadth', 'dissertation'], 'Programme · Dissertation', 12, { note: 'May replace Industry Experience only when official GPA and unit conditions are met; required for Highest Distinction.' }),
  course('CS2220', 'Introduction to Computational Biology', ['breadth'], 'Programme · Other Breadth & Depth'),
  course('CS5233', 'Simulation and Modeling Techniques', ['breadth'], 'Programme · Other Breadth & Depth'),
  course('MA1301', 'Introductory Mathematics', ['ue'], 'Unrestricted Electives'),
  course('MA1301X', 'Introductory Mathematics', ['ue'], 'Unrestricted Electives'),
  ...focusCourses,
  ...focusElectives,
];

function mergeCatalog(items: Course[]) {
  const merged = new Map<string, Course>();
  for (const item of items) {
    const existing = merged.get(item.code);
    if (!existing) {
      merged.set(item.code, item);
      continue;
    }
    merged.set(item.code, {
      ...existing,
      title: existing.title,
      tags: [...new Set([...existing.tags, ...item.tags])],
      focusPrimary: [...new Set([...(existing.focusPrimary ?? []), ...(item.focusPrimary ?? [])])],
      focusElective: [...new Set([...(existing.focusElective ?? []), ...(item.focusElective ?? [])])],
      note: existing.note ?? item.note,
    });
  }
  return [...merged.values()].sort((a, b) => a.code.localeCompare(b.code));
}

export const COURSE_CATALOG = mergeCatalog(baseCourses);
export const COURSE_BY_CODE = new Map(COURSE_CATALOG.map((item) => [item.code, item]));
export const FOCUS_AREAS = Object.keys(focusPrimaries) as FocusArea[];

export const SEMESTERS = [
  { key: 'unscheduled', label: 'Unscheduled', year: 'Backlog' },
  { key: 'y1s1', label: 'Semester 1', year: 'Year 1' },
  { key: 'y1s2', label: 'Semester 2', year: 'Year 1' },
  { key: 'y2s1', label: 'Semester 1', year: 'Year 2' },
  { key: 'y2s2', label: 'Semester 2', year: 'Year 2' },
  { key: 'y3s1', label: 'Semester 1', year: 'Year 3' },
  { key: 'y3s2', label: 'Semester 2', year: 'Year 3' },
  { key: 'y4s1', label: 'Semester 1', year: 'Year 4' },
  { key: 'y4s2', label: 'Semester 2', year: 'Year 4' },
] as const;

export const SOURCES = {
  cohort: 'https://www.comp.nus.edu.sg/cug/per-cohort/cs/cs-22-23/',
  common: 'https://www.comp.nus.edu.sg/cug/soc-22-23/',
  generalEducation: 'https://www.nus.edu.sg/registrar/academic-information-policies/undergraduate-students/general-education/list-of-courses-approved-under-the-ge-pillars',
  focus: 'https://www.comp.nus.edu.sg/programmes/ug/focus/',
};
