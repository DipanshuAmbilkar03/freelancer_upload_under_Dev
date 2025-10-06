# Freelancer Bidding Site

Welcome to the Freelancer Bidding Site project! This application allows users to post assignments, bid on them, and manage their profiles. Below are the details for setting up and using the application.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- User registration and login
- Post new assignments
- View all assignments
- Bid on assignments
- Dashboard for managing assignments and bids
- Profile management for users

## Technologies Used

- Node.js
- Express.js
- MongoDB (with Mongoose)
- EJS (Embedded JavaScript templating)
- CSS for styling
- JavaScript for client-side interactivity

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone https://github.com/yourusername/freelancer-bidding-site.git
   cd freelancer-bidding-site
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Create a `.env` file:**
   Copy the `.env.example` file to `.env` and fill in the required environment variables, such as your MongoDB connection string and session secret.

4. **Initialize the database:**
   Run the following command to set up the initial data and create a demo user:
   ```
   node init/index.js
   ```

5. **Start the server:**
   ```
   npm start
   ```

6. **Access the application:**
   Open your browser and go to `http://localhost:8080`.

## Usage

- **Register**: Create a new account by navigating to the registration page.
- **Login**: Access your account using your credentials.
- **Dashboard**: View all assignments, manage your posted assignments, and place bids on available assignments.
- **Post Assignment**: Use the dashboard to post new assignments for bidding.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.