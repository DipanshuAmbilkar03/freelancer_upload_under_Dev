const initData = [
    {
        title: "Implement Sorting Algorithms",
        description: "Implement and analyze various sorting algorithms such as Quick Sort, Merge Sort, and Heap Sort.",
        startingPrice: 500,
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
        subject: "Data Structures & Algorithms",
        deadline: new Date('2025-10-10'),
        status: "open",
        category: "Programming & Software Development"
    },
    {
        title: "Design a RESTful API for Library Management",
        description: "Create a RESTful API for managing books, users, and transactions in a library system using Node.js and Express.",
        startingPrice: 1000,
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
        subject: "RESTful API Development",
        deadline: new Date('2025-10-15'),
        status: "open",
        category: "Programming & Software Development"
    },
    {
        title: "Build a Simple React Portfolio Site",
        description: "Create a personal portfolio website using React with responsive design and animations.",
        startingPrice: 800,
        image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80", 
        subject: "Web Development",
        deadline: new Date('2025-10-12'),
        status: "open",
        category: "Programming & Software Development"
    },
    {
        title: "Data Cleaning & Visualization Project",
        description: "Clean a messy dataset and visualize key insights using Matplotlib and Seaborn.",
        startingPrice: 750,
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80",
        subject: "Data Science & Machine Learning",
        deadline: new Date('2025-10-18'),
        status: "open",
        category: "Data Science & Machine Learning"
    },
    {
        title: "Implement Linear Regression Model",
        description: "Develop a linear regression model to predict housing prices using Python and scikit-learn.",
        startingPrice: 900,
        image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=800&q=80",
        subject: "Machine Learning Models",
        deadline: new Date('2025-10-20'),
        status: "open",
        category: "Data Science & Machine Learning"
    },
    {
        title: "Build a Secure Login System",
        description: "Implement a secure login system with OAuth and JWT for a web application.",
        startingPrice: 1100,
        image: "https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=800&q=80", // ✅ Updated secure login image
        subject: "Secure Authentication",
        deadline: new Date('2025-10-22'),
        status: "open",
        category: "Cybersecurity"
    },
    {
        title: "Deploy Node.js App on AWS",
        description: "Deploy a Node.js application on AWS EC2 with proper security configurations.",
        startingPrice: 1200,
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
        subject: "Cloud Computing & DevOps",
        deadline: new Date('2025-10-25'),
        status: "open",
        category: "Cloud Computing & DevOps"
    },
    {
        title: "IoT Temperature Monitoring System",
        description: "Build an IoT system that monitors temperature and displays data on a web dashboard.",
        startingPrice: 950,
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
        subject: "Interfacing Sensors",
        deadline: new Date('2025-10-28'),
        status: "open",
        category: "Internet of Things (IoT)"
    },
    {
        title: "Develop a Simple Solidity Smart Contract",
        description: "Write a smart contract in Solidity to manage simple transactions between users.",
        startingPrice: 1300,
        image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=800&q=80", 
        deadline: new Date('2025-11-01'),
        status: "open",
        category: "Blockchain & Cryptocurrency"
    },
    {
        title: "Create Project Documentation and Gantt Chart",
        description: "Write comprehensive project documentation and prepare a Gantt chart for scheduling.",
        startingPrice: 600,
        image: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=800&q=80", // ✅ Updated documentation image
        subject: "Software Project Management",
        deadline: new Date('2025-11-05'),
        status: "open",
        category: "Software Project Management"
    },
    {
        title: "Probability Distribution Analysis",
        description: "Analyze real-world data using probability distributions and present a report.",
        startingPrice: 700,
        image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=800&q=80", // ✅ Updated math/statistics image
        subject: "Probability Distributions",
        deadline: new Date('2025-11-10'),
        status: "open",
        category: "Mathematics & Statistics"
    }
];

module.exports = { data: initData };
