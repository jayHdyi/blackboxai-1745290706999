// Initialize localStorage if needed
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}

// Show notification function
function showNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg ${
        isError ? 'bg-red-500' : 'bg-green-500'
    } text-white z-50 transition-opacity duration-300`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Fade out and remove notification
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Validate email function
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Handle Registration Form
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Validate input
        if (!email || !password) {
            showNotification('Please fill in all fields', true);
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', true);
            return;
        }

        if (password.length < 6) {
            showNotification('Password must be at least 6 characters long', true);
            return;
        }

        try {
            // Get current users array
            let users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if user already exists
            if (users.find(user => user.email === email)) {
                showNotification('This email is already registered', true);
                return;
            }

            // Create new user
            const newUser = {
                email,
                password,
                attendance: [],
                lastLogin: new Date().toISOString(),
                registeredAt: new Date().toISOString()
            };

            // Add new user to array
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            showNotification('Registration successful! Please login.');
            
            // Close modal and clear form
            hideRegisterModal();
            e.target.reset();
        } catch (error) {
            showNotification('An error occurred during registration', true);
            console.error('Registration error:', error);
        }
    });
}

// Handle Login Form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        // Validate input
        if (!email || !password) {
            showNotification('Please fill in all fields', true);
            return;
        }

        try {
            // Get current users array
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Update last login and attendance
                user.lastLogin = new Date().toISOString();
                user.attendance.push({
                    date: new Date().toISOString(),
                    type: 'login'
                });
                
                // Update user in users array
                const userIndex = users.findIndex(u => u.email === email);
                users[userIndex] = user;
                
                // Update storage
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                showNotification('Login successful!');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                showNotification('Invalid email or password', true);
            }
        } catch (error) {
            showNotification('An error occurred during login', true);
            console.error('Login error:', error);
        }
    });
}

// Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Redirect if needed
    if (currentPath.includes('dashboard.html') && !currentUser) {
        window.location.href = 'index.html';
        return;
    } else if (currentPath.includes('index.html') && currentUser) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Update dashboard if on dashboard page
    if (currentPath.includes('dashboard.html') && currentUser) {
        // Display user email
        const userEmailElement = document.getElementById('userEmail');
        if (userEmailElement) {
            userEmailElement.textContent = currentUser.email;
        }

        // Display last login
        const lastLoginElement = document.getElementById('lastLogin');
        if (lastLoginElement) {
            lastLoginElement.textContent = new Date(currentUser.lastLogin).toLocaleString();
        }

        // Display total attendance
        const totalAttendanceElement = document.getElementById('totalAttendance');
        if (totalAttendanceElement) {
            totalAttendanceElement.textContent = currentUser.attendance.length;
        }

        // Display member since date
        const memberSinceElement = document.getElementById('memberSince');
        if (memberSinceElement) {
            memberSinceElement.textContent = new Date(currentUser.registeredAt).toLocaleDateString();
        }

        // Update attendance table
        const attendanceTable = document.getElementById('attendanceTable');
        if (attendanceTable) {
            attendanceTable.innerHTML = ''; // Clear existing records
            
            currentUser.attendance.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(record => {
                const row = document.createElement('tr');
                const dateObj = new Date(record.date);
                
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${dateObj.toLocaleDateString()}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${dateObj.toLocaleTimeString()}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            record.type === 'login' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }">
                            ${record.type === 'login' ? 'Login' : 'Manual Check-in'}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Present
                        </span>
                    </td>
                `;
                
                attendanceTable.appendChild(row);
            });
        }
    }

    // Update admin panel if on admin page
    if (currentPath.includes('admin.html')) {
        refreshUserList();
    }
});

// Mark Attendance Function
window.markAttendance = function() {
    // Get current users array and current user
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            // Add new attendance record
            const newRecord = {
                date: new Date().toISOString(),
                type: 'manual'
            };
            users[userIndex].attendance.push(newRecord);
            currentUser.attendance.push(newRecord);
            
            // Update storage
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Show notification
            showNotification('Attendance marked successfully!');
            
            // Refresh the page to update attendance table
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }
};

// Refresh User List Function for Admin Panel
window.refreshUserList = function() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userTable = document.getElementById('userTable');
    const totalUsersElement = document.getElementById('totalUsers');
    const todayAttendanceElement = document.getElementById('todayAttendance');
    
    if (userTable) {
        // Clear existing rows
        userTable.innerHTML = '';
        
        // Update stats
        if (totalUsersElement) {
            totalUsersElement.textContent = users.length;
        }
        
        // Calculate today's attendance
        const today = new Date().toDateString();
        const todayAttendance = users.reduce((count, user) => {
            return count + user.attendance.filter(record => 
                new Date(record.date).toDateString() === today
            ).length;
        }, 0);

        if (todayAttendanceElement) {
            todayAttendanceElement.textContent = todayAttendance;
        }

        // Display user information
        users.forEach(user => {
            const row = document.createElement('tr');
            const lastLoginDate = new Date(user.lastLogin);
            const memberSinceDate = new Date(user.registeredAt);
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <i class="fas fa-user-circle text-gray-400 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${lastLoginDate.toLocaleString()}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        ${user.attendance.length}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${memberSinceDate.toLocaleString()}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                    </span>
                </td>
            `;
            
            userTable.appendChild(row);
        });

        // Update last update time
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (lastUpdateElement) {
            lastUpdateElement.textContent = new Date().toLocaleTimeString();
        }
    }
};

// Logout Function
window.logout = function() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
};
