
Built by https://www.blackbox.ai

---

```markdown
# Attendify - Attendance Tracker

## Project Overview
Attendify is a web-based application designed to facilitate attendance tracking for teams. It allows users to log in or sign up, and administrators can manage user data and monitor attendance statistics. The application features an admin panel for oversight as well as a user dashboard for individual attendance records.

## Installation
To set up Attendify locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd attendify
   ```

2. **Open in browser**:
   Open `index.html` in a web browser to access the application. Since this project does not require a backend server, you can run it directly from your file system.

## Usage
1. Open the `index.html` file in your web browser.
2. Users can sign up for a new account by filling in the registration form.
3. Existing users can log in using their credentials.
4. Admin users can access the admin panel to view and manage registered users and attendance data.

## Features
- User registration and login functionality.
- Admin panel to monitor total users and today's attendance.
- Dynamic attendance reporting in user dashboards.
- Store user data locally in the browser using Local Storage.
- Notification system for success and error messages.
- Responsive design using Tailwind CSS for a better user experience.

## Dependencies
The project uses the following dependencies:
- **Tailwind CSS** - A utility-first CSS framework for rapid UI development.
- **Font Awesome** - For the icons used throughout the application.

## Project Structure
```
attendify/
├── index.html          # Login and Registration page
├── dashboard.html      # User dashboard for attendance tracking
├── admin.html          # Admin panel for managing users
├── app.js              # JavaScript file containing core functionality
└── styles.css (optional) # Custom CSS styles if needed beyond Tailwind
```

### Additional Information
- The application stores user data, including email, password, login times, and attendance in `localStorage`.
- Each user has an individual attendance history that can be viewed on their dashboard.
- Administration functions include visibility into total users and today's check-ins.

Feel free to contribute to the project or report issues if you find any bugs or feature requests.
```