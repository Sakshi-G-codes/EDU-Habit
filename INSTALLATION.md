# 🚀 Quick Installation Guide

## Prerequisites Checklist

Before starting, ensure you have:
- ✅ Node.js (v14 or higher) - [Download](https://nodejs.org/)
- ✅ MySQL (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/)
- ✅ Git - [Download](https://git-scm.com/)
- ✅ VS Code (recommended) - [Download](https://code.visualstudio.com/)

## Step-by-Step Installation

### Step 1: Verify Node.js Installation

Open Command Prompt and run:
```cmd
node --version
npm --version
```

You should see version numbers. If not, install Node.js first.

### Step 2: Setup MySQL Database

1. **Start MySQL Service:**
   - Open Services (Win + R, type `services.msc`)
   - Find "MySQL" service
   - Right-click and select "Start"

2. **Create Database:**
   - Open MySQL Workbench or Command Prompt
   - Login to MySQL:
   ```cmd
   mysql -u root -p
   ```
   - Enter your MySQL password
   - Run the following commands:
   ```sql
   CREATE DATABASE eduhabit;
   USE eduhabit;
   ```

3. **Import Database Schema:**
   - In MySQL, run all commands from `backend/database.sql`
   - Or from command prompt:
   ```cmd
   mysql -u root -p eduhabit < backend/database.sql
   ```

### Step 3: Backend Setup

1. **Navigate to backend folder:**
   ```cmd
   cd backend
   ```

2. **Install dependencies:**
   ```cmd
   npm install
   ```

3. **Configure environment variables:**
   - Open `backend/.env` file
   - Update with your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=eduhabit
   PORT=5000
   ```

4. **Start backend server:**
   ```cmd
   npm start
   ```
   
   You should see: `Server running on port 5000` and `MySQL Connected!`

### Step 4: Frontend Setup

1. **Open a NEW Command Prompt window**

2. **Navigate to frontend folder:**
   ```cmd
   cd frontend
   ```

3. **Install dependencies:**
   ```cmd
   npm install
   ```
   
   This may take 2-3 minutes.

4. **Start React development server:**
   ```cmd
   npm start
   ```
   
   The app will automatically open in your browser at `http://localhost:3000`

## Verification

### Backend is Running:
- Visit `http://localhost:5000` in browser
- You should see: "EduHabit API is running!"

### Frontend is Running:
- Browser opens automatically to `http://localhost:3000`
- You should see the Onboarding screen

## Common Issues & Solutions

### Issue 1: "Port 5000 already in use"
**Solution:**
- Find and kill the process using port 5000:
```cmd
netstat -ano | findstr :5000
taskkill /PID <process_id> /F
```

### Issue 2: "MySQL Connection Error"
**Solutions:**
- Verify MySQL service is running
- Check credentials in `.env` file
- Ensure database `eduhabit` exists
- Test connection:
```cmd
mysql -u root -p -e "SHOW DATABASES;"
```

### Issue 3: "Cannot find module 'react-router-dom'"
**Solution:**
```cmd
cd frontend
npm install react-router-dom axios
```

### Issue 4: Frontend can't connect to backend
**Solutions:**
- Ensure backend is running on port 5000
- Check browser console for errors
- Verify API URL in frontend code: `http://localhost:5000`

## Testing the Application

### 1. Create an Account
- Click "Get Started" on onboarding
- Click "Sign up"
- Enter name, email, and password
- Click "Sign Up"

### 2. Create Your First Goal
- Navigate to "Goals" from dashboard
- Click the "+" button
- Fill in goal details
- Click "Add Goal"

### 3. Log a Study Session
- Go to "Study Session"
- Select a subject
- Enter duration (e.g., 30 minutes)
- Click "Save Session"

### 4. Daily Check-In
- Return to Dashboard
- Click "Mark Today as Completed"
- See your streak increase!

## Development Mode

Both servers run in development mode with hot-reload:
- **Backend:** Changes require manual restart
- **Frontend:** Changes auto-refresh the browser

## Production Build

To create a production build:

```cmd
cd frontend
npm run build
```

The optimized files will be in `frontend/build/`

## Stopping the Servers

- Press `Ctrl + C` in each Command Prompt window
- Type `Y` when asked to terminate

## Next Steps

- Read the full [README.md](README.md) for features and usage
- Explore the code in VS Code
- Customize colors and styles in CSS files
- Add your own features!

## Need Help?

If you encounter issues:
1. Check the error message carefully
2. Verify all prerequisites are installed
3. Ensure MySQL is running
4. Check that both servers are running
5. Review the Troubleshooting section in README.md

---

**Happy Learning! 🎓**
