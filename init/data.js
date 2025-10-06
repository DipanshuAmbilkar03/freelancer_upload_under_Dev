const initData = [
    {
        title: "Implement Sorting Algorithms",
        description: "Implement and analyze various sorting algorithms such as Quick Sort, Merge Sort, and Heap Sort.",
        startingPrice: 500,
        image: "sorting.png",
        subject: "Data Structures & Algorithms",
        deadline: new Date('2025-10-10'),
        status: "open",
        category: "Programming & Software Development"
    },
    {
        title: "Design a RESTful API for Library Management",
        description: "Create a RESTful API for managing books, users, and transactions in a library system using Node.js and Express.",
        startingPrice: 1000,
        image: "rest-api.png",
        subject: "RESTful API Development",
        deadline: new Date('2025-10-15'),
        status: "open",
        category: "Programming & Software Development"
    },
    {
        title: "Build a Simple React Portfolio Site",
        description: "Create a personal portfolio website using React with responsive design and animations.",
        startingPrice: 800,
        image: "react-portfolio.png",
        subject: "Web Development",
        deadline: new Date('2025-10-12'),
        status: "open",
        category: "Programming & Software Development"
    },
    {
        title: "Data Cleaning & Visualization Project",
        description: "Clean a messy dataset and visualize key insights using Matplotlib and Seaborn.",
        startingPrice: 750,
        image: "data-viz.png",
        subject: "Data Science & Machine Learning",
        deadline: new Date('2025-10-18'),
        status: "open",
        category: "Data Science & Machine Learning"
    },
    {
        title: "Implement Linear Regression Model",
        description: "Develop a linear regression model to predict housing prices using Python and scikit-learn.",
        startingPrice: 900,
        image: "linear-regression.png",
        subject: "Machine Learning Models",
        deadline: new Date('2025-10-20'),
        status: "open",
        category: "Data Science & Machine Learning"
    },
    {
        title: "Build a Secure Login System",
        description: "Implement a secure login system with OAuth and JWT for a web application.",
        startingPrice: 1100,
        image: "secure-login.png",
        subject: "Secure Authentication",
        deadline: new Date('2025-10-22'),
        status: "open",
        category: "Cybersecurity"
    },
    {
        title: "Deploy Node.js App on AWS",
        description: "Deploy a Node.js application on AWS EC2 with proper security configurations.",
        startingPrice: 1200,
        image: "aws-deployment.png",
        subject: "Cloud Computing & DevOps",
        deadline: new Date('2025-10-25'),
        status: "open",
        category: "Cloud Computing & DevOps"
    },
    {
        title: "IoT Temperature Monitoring System",
        description: "Build an IoT system that monitors temperature and displays data on a web dashboard.",
        startingPrice: 950,
        image: "iot-temp.png",
        subject: "Interfacing Sensors",
        deadline: new Date('2025-10-28'),
        status: "open",
        category: "Internet of Things (IoT)"
    },
    {
        title: "Develop a Simple Solidity Smart Contract",
        description: "Write a smart contract in Solidity to manage simple transactions between users.",
        startingPrice: 1300,
        image: "solidity-contract.png",
        subject: "Smart Contract Development",
        deadline: new Date('2025-11-01'),
        status: "open",
        category: "Blockchain & Cryptocurrency"
    },
    {
        title: "Create Project Documentation and Gantt Chart",
        description: "Write comprehensive project documentation and prepare a Gantt chart for scheduling.",
        startingPrice: 600,
        image: "project-doc.png",
        subject: "Software Project Management",
        deadline: new Date('2025-11-05'),
        status: "open",
        category: "Software Project Management"
    },
    {
        title: "Probability Distribution Analysis",
        description: "Analyze real-world data using probability distributions and present a report.",
        startingPrice: 700,
        image: "probability.png",
        subject: "Probability Distributions",
        deadline: new Date('2025-11-10'),
        status: "open",
        category: "Mathematics & Statistics"
    },
    {
        title: "Design Responsive UI Wireframe",
        description: "Create wireframes and mockups for a responsive e-commerce website using Figma.",
        startingPrice: 850,
        image: "ui-wireframe.png",
        subject: "Wireframing",
        deadline: new Date('2025-11-15'),
        status: "open",
        category: "UI/UX Design"
    },
    {
        title: "Write a Technical Report on Cloud Security",
        description: "Prepare a well-structured technical report discussing cloud security best practices.",
        startingPrice: 500,
        image: "tech-report.png",
        subject: "Technical Report Writing",
        deadline: new Date('2025-11-20'),
        status: "open",
        category: "Communication & Soft Skills"
    },
  {
    title: "Write a Research Paper",
    description: "Need a comprehensive research paper on climate change and its effects.",
    startingPrice: 150,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2MVlq4uL1uoGrjb_VGfiiobT2T9fvsPiwUA&s",
    subject: "Environmental Science",
    deadlineOffsetDays: 7,
    category: "Research"
  },
  {
    title: "Create a Website",
    description: "Looking for a web developer to create a personal portfolio website.",
    startingPrice: 300,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
    subject: "Web Development",
    deadlineOffsetDays: 14,
    category: "Development"
  },
  {
    title: "Translate Document",
    description: "Need a document translated from English to Spanish.",
    startingPrice: 50,
    image: "https://plus.unsplash.com/premium_photo-1669904022334-e40da006a0a3?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXNzaWdubWVudHxlbnwwfHwwfHx8MA%3D%3D",
    subject: "Translation",
    deadlineOffsetDays: 3,
    category: "Translation"
  },
  { 
    title: "Graphic Design for Marketing",
    description: "Create a set of graphics for an upcoming marketing campaign.",
    startingPrice: 200,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShlHhA-rQANEfDl1RfBGJb3inORkkmaENn8w&s", 
    subject: "Graphic Design",
    deadlineOffsetDays: 10,
    category: "Design"
  },
  {
    title: "Social Media Management",
    description: "Manage social media accounts and create engaging content.",
    startingPrice: 100,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQFPfg2Ab6W-YM1xHcW743dYdCc84IRw18eQ&s", // Notebook workspace
    subject: "Marketing",
    deadlineOffsetDays: 30,
    category: "Marketing"
  }
];

module.exports = { data: initData };
