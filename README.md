# Smart Commission Management System

A comprehensive web application for managing commissions, meetings, and notifications built with Laravel. This project includes advanced notification systems, user management, and commission tracking capabilities.

## 🚀 Features

- **Commission Management**: Create, track, and manage commissions with detailed workflows
- **Meeting Scheduling**: Schedule and manage meetings with automated notifications
- **Advanced Notification System**: Real-time notifications with browser alerts and email support
- **User Management**: Role-based access control and user authentication
- **Dashboard Analytics**: Comprehensive dashboard with statistics and insights
- **Responsive Design**: Modern, mobile-friendly interface
- **API Support**: RESTful API with JWT authentication

## 📋 Project Structure

```
projet pfe/
├── smart/              # Main Laravel application
├── template/           # Frontend template files
├── vendor/            # Composer dependencies (root level)
├── composer.json      # Root composer configuration
└── laravel.sql        # Database schema
```

## 🛠️ Technology Stack

- **Backend**: Laravel 11.x (PHP 8.2+)
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap
- **Database**: MySQL/SQLite
- **Authentication**: JWT (JSON Web Tokens)
- **PDF Generation**: DomPDF
- **Development Tools**: Vite, Composer, NPM

## 📦 Installation

### Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js & NPM
- MySQL or SQLite
- Web server (Apache/Nginx)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "projet pfe"
   ```

2. **Install PHP dependencies**
   ```bash
   cd smart
   composer install
   ```

3. **Install Node dependencies**
   ```bash
   npm install
   ```

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database Setup**
   ```bash
   # Configure your database in .env file
   php artisan migrate --seed
   ```

6. **Build Frontend Assets**
   ```bash
   npm run build
   ```

7. **Start the Development Server**
   ```bash
   php artisan serve
   ```

## 🔧 Configuration

### Environment Variables

Key environment variables to configure in `.env`:

```env
APP_NAME="Smart Commission Management"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=smart_commission
DB_USERNAME=root
DB_PASSWORD=

JWT_SECRET=your-jwt-secret-key

MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
```

### Notification System Setup

The application includes a sophisticated notification system that works without Laravel's task scheduler:

1. **Browser Notifications**: Enable in your browser for real-time alerts
2. **Email Notifications**: Configure SMTP settings in `.env`
3. **API Notifications**: Automatic polling for new notifications

For detailed notification setup, see [NOTIFICATION_GUIDE.md](smart/NOTIFICATION_GUIDE.md)

## 📱 Usage

### For End Users

1. **Login**: Access the system with your credentials
2. **Dashboard**: View your commissions and today's meetings
3. **Notifications**: Check the notification bell for updates
4. **Meetings**: View and manage your scheduled meetings
5. **Profile**: Update your profile and settings

### For Administrators

1. **User Management**: Create and manage user accounts
2. **Commission Oversight**: Monitor all commissions and their status
3. **System Settings**: Configure notification preferences
4. **Reports**: Generate and export various reports

## 🧪 Testing

Run the test suite:

```bash
cd smart
php artisan test
```

Test the notification system:

```bash
php test_notifications.php
php test_non_scheduler_notifications.php
```

## 📚 Documentation

- [Notification Guide](smart/NOTIFICATION_GUIDE.md) - User guide for notifications
- [Technical Documentation](smart/notification_docs.md) - Technical implementation details
- [Changelog](smart/NOTIFICATION_CHANGELOG.md) - Recent changes and updates

## 🚀 Deployment

### Production Setup

1. **Server Requirements**
   - PHP 8.2+ with required extensions
   - MySQL 8.0+ or PostgreSQL 13+
   - Nginx/Apache web server
   - SSL certificate (recommended)

2. **Environment Configuration**
   ```bash
   APP_ENV=production
   APP_DEBUG=false
   ```

3. **Optimization**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

### Scheduler Setup (Optional)

For enhanced functionality, you can set up the Laravel scheduler:

**Windows:**
```powershell
# Run as Administrator
.\setup-scheduler.ps1
```

**Linux/Mac:**
```bash
bash setup-scheduler.sh
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For support and questions:

- Create an issue in the GitHub repository
- Check the documentation in the `smart/` directory
- Review the notification guides for system-specific help

## 🙏 Acknowledgments

- Built with [Laravel](https://laravel.com/)
- UI components from [Bootstrap](https://getbootstrap.com/)
- Icons from [Font Awesome](https://fontawesome.com/)

---

**Smart Commission Management System** - Streamlining commission management with modern web technology.
