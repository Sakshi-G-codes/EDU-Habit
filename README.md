# 🎓 EDU-HABIT – Daily Learning Tracker

A modern, clean, and motivational mobile-first web application designed to help students build consistent learning habits through goal tracking, daily check-ins, study sessions, and gamification.

![EDU-HABIT](https://img.shields.io/badge/EDU--HABIT-Learning%20Tracker-blue)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-Database-orange?logo=mysql)

## 📋 Project Overview

**Project Title:** EduHabit – Daily Learning Tracker  
**Broad Area:** Educational Technology / Productivity Applications  
**Type:** Full-Stack Web Application (MERN-like Stack)

### Objectives

1. **Personalized Learning** - Allow users to create and manage goals based on their subjects, interests, and available time
2. **Motivation Through Gamification** - Use streaks, badges, and progress bars to make studying engaging and rewarding
3. **CRUD Operations** - Implement full Create, Read, Update, Delete functionalities for managing goals efficiently

### Key Features

- ✅ User authentication (Login/Signup)
- 🎯 Goal creation and management (CRUD operations)
- 📅 Daily check-in system with calendar view
- 🔥 Streak tracking to encourage consistency
- ⏱️ Study session logging
- 🏆 Badge system for achievements
- 📊 Progress visualization with charts and stats
- 🔔 Notifications and reminders
- 📱 Mobile-first responsive design
- 🎨 Clean, modern UI with soft colors and rounded components

## 🛠️ Technology Stack

### Frontend
- **React.js** (v19.2.0) - UI library
- **React Router DOM** (v6.20.0) - Navigation
- **Axios** - HTTP client
- **CSS3** - Styling with custom design system

### Backend
- **Node.js** - Runtime environment
- **Express.js** (v5.1.0) - Web framework
- **MySQL2** (v3.15.3) - Database driver
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Database
- **MySQL** - Relational database

## 📁 Project Structure

```
eduhabit/
├── backend/
│   ├── server.js           # Express server with API routes
│   ├── database.sql        # Database schema
│   ├── package.json        # Backend dependencies
│   └── .env               # Environment variables
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── screens/
│   │   │   ├── Onboarding.js       # Welcome screen
│   │   │   ├── Login.js            # Login screen
│   │   │   ├── Signup.js           # Registration screen
│   │   │   ├── Dashboard.js        # Main dashboard
│   │   │   ├── Goals.js            # Goals list
│   │   │   ├── GoalDetails.js      # Goal details with tasks
│   │   │   ├── CheckIn.js          # Daily check-in
│   │   │   ├── StudySession.js     # Study session logger
│   │   │   ├── Badges.js           # Achievements
│   │   │   └── Notifications.js    # Notifications
│   │   ├── App.js          # Main app component
│   │   ├── App.css         # Global styles
│   │   └── index.js        # Entry point
│   └── package.json        # Frontend dependencies
│
└── README.md              # Project documentation
```

## 💻 System Requirements

### Hardware Requirements
- **Processor:** Intel i3 or Higher
- **Memory:** Minimum 8GB RAM
- **Storage:** 500MB free space
- **Internet:** Stable internet connection

### Software Requirements
- **Operating System:** Windows 10/11
- **Node.js:** v14.0.0 or higher
- **MySQL:** v8.0 or higher
- **Browser:** Chrome, Firefox, Edge (latest versions)
- **Code Editor:** VS Code (recommended)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd eduhabit
```

### 2. Database Setup

1. Install MySQL and start the MySQL service
2. Open MySQL Workbench or command line
3. Run the database schema:

```bash
mysql -u root -p < backend/database.sql
```

Or manually execute the SQL commands in `backend/database.sql`

### 3. Backend Setup

```bash
cd backend
npm install
```

Configure environment variables in `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=eduhabit
PORT=5000
```

Start the backend server:

```bash
npm start
```

The API will run on `http://localhost:5000`

### 4. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Start the React development server:

```bash
npm start
```

The app will open at `http://localhost:3000`

## 📱 Application Screens

### 1. **Onboarding Screen**
- Motivational illustration with studying icon
- Title: "Build your learning habit"
- Subtitle: "Track goals, stay consistent, improve daily"
- Get Started button

### 2. **Login/Signup Screen**
- Clean form with email and password fields
- Brand logo (🎓 EDU-HABIT)
- Toggle between Login and Signup

### 3. **Home Dashboard**
- Today's date display
- Streak counter with fire emoji (🔥)
- Daily check-in button
- Progress cards showing:
  - Tasks completed
  - Today's study time
  - Active goals count
- Motivational quote section
- Quick navigation to all features

### 4. **Goals Screen**
- List of all goals in card layout
- Each card displays:
  - Goal title
  - Category badge
  - Progress bar
  - Target date
  - Delete option
- Floating "+" button to add new goals

### 5. **Goal Details Screen**
- Goal title, category, and description
- Progress bar
- Target date
- Task list with checkboxes
- Add task functionality
- Progress updates automatically

### 6. **Daily Check-In Screen**
- 30-day calendar view
- Completed days highlighted
- Daily note entry (optional)
- Mark as completed button

### 7. **Study Session Screen**
- Subject/topic dropdown selector
- Duration input (minutes)
- Save session button
- Study tips section

### 8. **Badges Screen**
- Grid layout of achievement badges
- Locked and unlocked states
- Badge descriptions
- Unlock dates for earned badges

### 9. **Notifications Screen**
- List of reminders and alerts
- Unread/read status indicators
- Different notification types (reminders, achievements, goals, streaks)

## 🎨 Design System

### Color Palette
- **Primary Gradient:** `#667eea` to `#764ba2` (Purple-Blue)
- **Success:** `#4caf50` (Green)
- **Warning:** `#ffeaa7` to `#fdcb6e` (Yellow)
- **Accent:** `#ff6b6b` to `#ee5a6f` (Red-Pink)
- **Background:** White `#ffffff`
- **Text:** Dark `#333333`, Medium `#666666`, Light `#999999`

### Typography
- **Font Family:** Poppins (Google Fonts)
- **Weights:** 300, 400, 500, 600, 700

### Components
- **Border Radius:** 12-24px (rounded corners)
- **Shadows:** Soft shadows for depth
- **Cards:** White background with rounded corners
- **Buttons:** Gradient backgrounds with hover effects
- **Inputs:** 2px border, rounded, focus states

## 🔌 API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login

### Goals (CRUD)
- `POST /api/goals` - Create new goal
- `GET /api/goals/:userId` - Get all user goals
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/:goalId` - Get goal tasks
- `PUT /api/tasks/:id` - Update task status

### Check-ins
- `POST /api/checkins` - Create check-in
- `GET /api/checkins/:userId` - Get user check-ins

### Study Sessions
- `POST /api/sessions` - Log study session
- `GET /api/sessions/:userId` - Get user sessions

### Badges
- `GET /api/badges/:userId` - Get user badges

### Statistics
- `GET /api/stats/:userId` - Get user statistics

## 📊 Database Schema

### Tables
1. **users** - User accounts
2. **goals** - Learning goals
3. **tasks** - Goal tasks
4. **checkins** - Daily check-ins
5. **study_sessions** - Study time logs
6. **badges** - Achievement badges

See `backend/database.sql` for complete schema.

## 🎯 Usage Guide

### Creating Your First Goal

1. Navigate to Goals screen
2. Click the floating "+" button
3. Fill in:
   - Goal title (e.g., "Master React.js")
   - Category (Programming, Math, etc.)
   - Target date
   - Description (optional)
4. Click "Add Goal"

### Tracking Daily Progress

1. Go to Dashboard
2. Click "Mark Today as Completed"
3. Your streak counter will update
4. Check the calendar in Check-In screen

### Logging Study Sessions

1. Navigate to Study Session
2. Select subject/topic
3. Enter duration in minutes
4. Click "Save Session"
5. View stats on Dashboard

### Managing Tasks

1. Open a goal from Goals screen
2. Click "Add Task"
3. Enter task title
4. Check off tasks as you complete them
5. Progress bar updates automatically

## 🔧 Development Tools

- **VS Code** - Code editor
- **Git & GitHub** - Version control
- **Chrome DevTools** - Debugging
- **Postman** - API testing (optional)
- **MySQL Workbench** - Database management

## 🐛 Troubleshooting

### Backend won't start
- Check if MySQL is running
- Verify database credentials in `.env`
- Ensure port 5000 is not in use

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check CORS configuration
- Ensure API URLs are correct

### Database connection errors
- Confirm MySQL service is active
- Check database name and credentials
- Run database.sql to create tables

## 🚀 Future Enhancements

- [ ] Timer functionality for study sessions
- [ ] Data visualization with charts
- [ ] Social features (share progress)
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Dark mode
- [ ] Export data functionality
- [ ] AI-powered study recommendations

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

Created as part of an Educational Technology project.

## 🙏 Acknowledgments

- Design inspiration from modern productivity apps
- Icons: Emoji-based for simplicity
- Fonts: Google Fonts (Poppins)

---

**Built with ❤️ for students who want to build better learning habits**

For questions or support, please open an issue in the repository.
