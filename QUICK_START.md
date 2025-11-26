# ⚡ Quick Start Guide - EDU-HABIT

## 🎯 Get Running in 5 Minutes!

### Prerequisites Check
Before starting, make sure you have:
- ✅ Node.js installed → `node --version`
- ✅ MySQL installed and running
- ✅ Git installed (if cloning from repository)

---

## 🚀 Option 1: Automated Setup (Recommended)

### Step 1: Run Setup Script
Double-click `SETUP.bat` or run in Command Prompt:
```cmd
SETUP.bat
```
This installs all dependencies automatically (takes 2-3 minutes).

### Step 2: Configure Database
1. Open MySQL and create database:
```sql
CREATE DATABASE eduhabit;
```

2. Import schema:
```cmd
mysql -u root -p eduhabit < backend/database.sql
```

3. Update `backend/.env` with your MySQL password:
```env
DB_PASSWORD=your_mysql_password
```

### Step 3: Start the Application
1. Double-click `START_BACKEND.bat` (keep window open)
2. Double-click `START_FRONTEND.bat` (opens browser automatically)

**Done! 🎉** The app opens at `http://localhost:3000`

---

## 🔧 Option 2: Manual Setup

### Backend Setup
```cmd
cd backend
npm install
```

Edit `backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=eduhabit
PORT=5000
```

Start backend:
```cmd
npm start
```

### Frontend Setup (New Terminal)
```cmd
cd frontend
npm install
npm start
```

---

## ✅ Verify Installation

### Backend Check
Visit: `http://localhost:5000`  
Should see: "EduHabit API is running!"

### Frontend Check
Visit: `http://localhost:3000`  
Should see: Onboarding screen with "Build your learning habit"

---

## 🎮 First Time Usage

### 1. Create Account
- Click "Get Started"
- Click "Sign up"
- Enter: Name, Email, Password
- Click "Sign Up"

### 2. Explore Dashboard
- See your streak counter (starts at 0)
- View quick stats
- Read motivational quote

### 3. Create First Goal
- Click "Goals" card
- Click "+" button
- Fill in:
  - Title: "Learn React.js"
  - Category: Programming
  - Target Date: (pick a date)
  - Description: (optional)
- Click "Add Goal"

### 4. Add Tasks
- Click on your goal
- Click "Add Task"
- Enter task name: "Complete React tutorial"
- Click "Add"
- Check the box when done!

### 5. Daily Check-In
- Go back to Dashboard
- Click "Mark Today as Completed"
- See your streak increase! 🔥

### 6. Log Study Time
- Click "Study Session"
- Select subject: Programming
- Enter duration: 30 (minutes)
- Click "Save Session"

---

## 🎨 Screen Navigation Map

```
Onboarding
    ↓
Login/Signup
    ↓
Dashboard (Home)
    ├── Goals → Goal Details → Tasks
    ├── Study Session
    ├── Check-In → Calendar
    └── Badges
```

---

## 🐛 Quick Troubleshooting

### "Port 5000 already in use"
```cmd
netstat -ano | findstr :5000
taskkill /PID <number> /F
```

### "MySQL Connection Error"
- Check MySQL is running (Services → MySQL)
- Verify password in `.env`
- Test: `mysql -u root -p`

### "Cannot find module"
```cmd
cd frontend
npm install
```

### Frontend won't connect
- Ensure backend is running (port 5000)
- Check browser console for errors
- Verify API URL: `http://localhost:5000`

---

## 📂 Project Structure Overview

```
eduhabit/
├── 📄 SETUP.bat              ← Run this first!
├── 📄 START_BACKEND.bat      ← Start server
├── 📄 START_FRONTEND.bat     ← Start app
├── 📄 README.md              ← Full documentation
├── 📄 INSTALLATION.md        ← Detailed setup
├── 📄 FEATURES.md            ← Feature list
│
├── backend/
│   ├── server.js             ← API endpoints
│   ├── database.sql          ← Database schema
│   ├── .env                  ← Configuration
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── screens/          ← 10 screen components
    │   ├── App.js            ← Main app
    │   └── App.css           ← Global styles
    └── package.json
```

---

## 🎯 Key Features to Try

1. **Goal Management**
   - Create, edit, delete goals
   - Track progress with tasks
   - Set target dates

2. **Daily Habits**
   - Check in daily
   - Build streaks
   - View calendar

3. **Study Tracking**
   - Log study sessions
   - Track time per subject
   - View total study time

4. **Achievements**
   - Unlock badges
   - View achievements
   - Track milestones

---

## 📱 Mobile Testing

The app is mobile-first! Test on:
- Chrome DevTools (F12 → Toggle Device Toolbar)
- Your phone's browser (use your computer's IP)
- Responsive design works on all screen sizes

---

## 🎓 Learning Resources

**Included Documentation:**
- `README.md` - Complete project guide
- `INSTALLATION.md` - Detailed setup instructions
- `FEATURES.md` - All features explained
- `PROJECT_SUMMARY.md` - Technical overview

**Code Structure:**
- `backend/server.js` - API endpoints with comments
- `frontend/src/screens/` - React components
- `backend/database.sql` - Database schema

---

## 💡 Pro Tips

1. **Keep both terminals open** - Backend and frontend need to run simultaneously
2. **Check browser console** - Helpful for debugging (F12)
3. **Use MySQL Workbench** - Visual database management
4. **Customize colors** - Edit CSS files to match your style
5. **Add more badges** - Modify database.sql to create custom achievements

---

## 🆘 Need Help?

1. Check error messages carefully
2. Review INSTALLATION.md for detailed steps
3. Verify all prerequisites are installed
4. Ensure MySQL is running
5. Check that both servers are running

---

## 🎉 You're Ready!

**Start building your learning habit today!**

1. Run `SETUP.bat` (one time only)
2. Start backend: `START_BACKEND.bat`
3. Start frontend: `START_FRONTEND.bat`
4. Create account and start learning!

---

**Happy Learning! 🎓📚✨**

For detailed documentation, see [README.md](README.md)
