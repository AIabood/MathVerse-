export const staticFallbackData = {
  subjects: [
    {
      id: "algebra",
      name: "Algebra Tower",
      description: "Master equations, functions, and variables.",
      icon: "Binary",
      color: "#3b82f6",
      gradient: "algebra-world",
      mentor: "Nova Agent",
      progress: 80,
      completedLessons: 8,
      totalLessons: 10,
      courses: [
        { id: 1, title: "Basic Variables", status: "completed", difficulty: "Easy", xp: 50, duration: "15 Min" }
      ],
      paths: [
        {
          id: "variables-equations",
          name: "Variables & Equations Path",
          icon: "Binary",
          description: "Master the fundamentals of algebraic representation and solving equations.",
          totalXp: 1050,
          progress: 80,
          courses: [
            {
              id: 1,
              title: "Basic Variables",
              status: "completed",
              difficulty: "Easy",
              xp: 50,
              duration: "15 Min",
              description: "Understand variables as placeholders for unknown values and how they are used.",
              lessons: [
                { id: 1, title: "What is a Variable?", duration: "5 Min", xp: 15, status: "completed", icon: "Binary" },
                { id: 2, title: "Substituting Values", duration: "5 Min", xp: 15, status: "completed", icon: "BookOpen" }
              ]
            },
            {
              id: 2,
              title: "Final Algebra Challenge",
              status: "locked",
              difficulty: "Boss",
              xp: 500,
              duration: "60 Min",
              isBoss: true,
              description: "Tackle the ultimate Algebra Tower checkpoint.",
              lessons: [
                { id: 1, title: "Algebra Grandmaster Exam", duration: "60 Min", xp: 500, status: "locked", icon: "Trophy" }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "geometry",
      name: "Geometry Center",
      description: "Explore areas, volumes, and spatial symmetry principles.",
      icon: "Triangle",
      color: "#10b981",
      gradient: "geometry-world",
      mentor: "Archimedes",
      progress: 60,
      completedLessons: 6,
      totalLessons: 10,
      courses: [
        { id: 1, title: "Shapes & Perimeters", status: "completed", difficulty: "Easy", xp: 50, duration: "15 Min" }
      ],
      paths: [
        {
          id: "euclidean-shapes",
          name: "Euclidean Shapes Path",
          icon: "Triangle",
          description: "Journey through shapes, areas, dimensions, and theorems.",
          totalXp: 975,
          progress: 60,
          courses: [
            {
              id: 1,
              title: "Shapes & Perimeters",
              status: "completed",
              difficulty: "Easy",
              xp: 50,
              duration: "15 Min",
              description: "Calculate regular polygon borders and perimeter lengths.",
              lessons: [
                { id: 1, title: "Polygons Properties", duration: "5 Min", xp: 20, status: "completed", icon: "Triangle" }
              ]
            },
            {
              id: 2,
              title: "Geometry Overlord Boss",
              status: "locked",
              difficulty: "Boss",
              xp: 500,
              duration: "45 Min",
              isBoss: true,
              description: "Tackle the ultimate geometry proving grounds. Solve spatial puzzles.",
              lessons: [
                { id: 1, title: "Spatial Synthesizer Test", duration: "45 Min", xp: 500, status: "locked", icon: "Trophy" }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "ai",
      name: "AI Lab",
      description: "Decode pattern recognition and neural networks basics.",
      icon: "BrainCircuit",
      color: "#8b5cf6",
      gradient: "ai-world",
      mentor: "AI Prime",
      progress: 25,
      completedLessons: 2,
      totalLessons: 8,
      courses: [
        { id: 1, title: "AI Fundamentals", status: "completed", difficulty: "Easy", xp: 50, duration: "15 Min" }
      ],
      paths: [
        {
          id: "machine-learning",
          name: "Machine Learning Path",
          icon: "BrainCircuit",
          description: "Train classification models, regression vectors, and complete neural architectures.",
          totalXp: 1100,
          progress: 25,
          courses: [
            {
              id: 1,
              title: "AI Fundamentals",
              status: "completed",
              difficulty: "Easy",
              xp: 50,
              duration: "15 Min",
              description: "Understand core definitions of Artificial Intelligence and Machine Learning.",
              lessons: [
                { id: 1, title: "Supervised vs Unsupervised", duration: "5 Min", xp: 25, status: "completed", icon: "BrainCircuit" }
              ]
            },
            {
              id: 2,
              title: "Build an AI System",
              status: "locked",
              difficulty: "Boss",
              xp: 500,
              duration: "60 Min",
              isBoss: true,
              description: "Create, optimize, and launch a complete neural agent system.",
              lessons: [
                { id: 1, title: "Grand AI Deployment", duration: "60 Min", xp: 500, status: "locked", icon: "Trophy" }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "cyber",
      name: "Cyber Security Center",
      description: "Learn digital logic gates, modular cryptography, and security.",
      icon: "Lock",
      color: "#ef4444",
      gradient: "cyber-world",
      mentor: "Cyber Sentinel",
      progress: 10,
      completedLessons: 1,
      totalLessons: 10,
      courses: [
        { id: 1, title: "Security Foundations", status: "completed", difficulty: "Easy", xp: 50, duration: "15 Min" }
      ],
      paths: [
        {
          id: "ethical-hacking",
          name: "Ethical Hacking Path",
          icon: "Zap",
          description: "Audit linux shells, deploy port scanners, identify vulnerabilities, and hack mock assets.",
          totalXp: 1100,
          progress: 10,
          courses: [
            {
              id: 1,
              title: "Security Foundations",
              status: "completed",
              difficulty: "Easy",
              xp: 50,
              duration: "15 Min",
              description: "Understand target classification, assets evaluation, and threat vectors.",
              lessons: [
                { id: 1, title: "Asset Management", duration: "5 Min", xp: 25, status: "completed", icon: "Lock" }
              ]
            },
            {
              id: 2,
              title: "Ethical Hacking Challenge",
              status: "locked",
              difficulty: "Boss",
              xp: 500,
              duration: "60 Min",
              isBoss: true,
              description: "Complete the final CTF Hacking Challenge. Break into the mock target network.",
              lessons: [
                { id: 1, title: "Ethical Hacking Grand Capstone", duration: "60 Min", xp: 500, status: "locked", icon: "Trophy" }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "data",
      name: "Data Center",
      description: "Analyze statistical data, central tendency, and charts.",
      icon: "TrendingUp",
      color: "#f59e0b",
      gradient: "data-world",
      mentor: "Data Guru",
      progress: 40,
      completedLessons: 4,
      totalLessons: 10,
      courses: [
        { id: 1, title: "Data Collection Methods", status: "completed", difficulty: "Easy", xp: 50, duration: "15 Min" }
      ],
      paths: [
        {
          id: "data-analysis",
          name: "Data Analysis Path",
          icon: "TrendingUp",
          description: "Journey through databases, central metrics, and graphical chart analysis.",
          totalXp: 925,
          progress: 40,
          courses: [
            {
              id: 1,
              title: "Data Collection Methods",
              status: "completed",
              difficulty: "Easy",
              xp: 50,
              duration: "15 Min",
              description: "Study database querying, logs parsing, and target survey groups.",
              lessons: [
                { id: 1, title: "Querying Databases", duration: "5 Min", xp: 25, status: "completed", icon: "Search" }
              ]
            },
            {
              id: 2,
              title: "Data Mastery Boss",
              status: "locked",
              difficulty: "Boss",
              xp: 450,
              duration: "45 Min",
              isBoss: true,
              description: "Analyze multi-variable trend files.",
              lessons: [
                { id: 1, title: "Executive Data Challenge", duration: "45 Min", xp: 450, status: "locked", icon: "Trophy" }
              ]
            }
          ]
        }
      ]
    }
  ],
  dailyChallenges: [
    { id: 1, title: "Solve 3 Algebra Equations", xp: 100, completed: true, description: "Solve in any corresponding building tower." }
  ],
  achievements: [
    { id: 1, title: "Equation Master", description: "Solved 15 linear equations successfully.", icon: "Trophy", unlocked: true, color: "#f1c40f" }
  ],
  activityFeed: [
    { id: 1, text: "Earned \"Equation Master\" badge", time: "2 hours ago", icon: "🏆" }
  ],
  statistics: {
    totalCourses: 32,
    xpEarned: 1960,
    missionsCompleted: 18,
    challengesSolved: 12,
    learningStreak: 14,
    totalLessons: 68,
    completedLessons: 28,
    achievementsUnlocked: 5,
    averageScore: 87.5
  }
};
