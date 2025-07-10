# Smart Commission Management System

[![Laravel](https://img.shields.io/badge/Laravel-11.x-red.svg)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.2+-blue.svg)](https://php.net)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A comprehensive web application for managing commissions, meetings, and notifications built with Laravel. This project includes advanced notification systems, user management, and commission tracking capabilities designed for organizations that need to efficiently manage commission-based workflows.

## 🚀 Features

### Core Functionality
- **Commission Management**: Create, track, and manage commissions with detailed workflows and status tracking
- **Meeting Scheduling**: Schedule and manage meetings with automated notifications and calendar integration
- **Team Management**: Organize users into departments and teams (Finance, IT, Marketing, HR, R&D, etc.)
- **Service Management**: Define and manage different services with custom colors and descriptions
- **Document Generation**: Generate PDF reports and documents using DomPDF integration

### Advanced Notification System
- **Real-time Notifications**: Browser notifications that work without Laravel scheduler
- **Smart Triggers**: Automatic notifications on login and app interaction
- **Meeting Alerts**: Desktop notifications for meetings scheduled today
- **API-Driven**: Frontend periodically checks for new notifications
- **Email Integration**: SMTP support for email notifications

### Technical Features
- **JWT Authentication**: Secure API authentication with JSON Web Tokens
- **Role-based Access Control**: Different permission levels for users and administrators
- **Responsive Dashboard**: Modern, mobile-friendly interface with analytics
- **RESTful API**: Comprehensive API endpoints for all major functionality
- **Database Agnostic**: Supports MySQL, PostgreSQL, and SQLite

## 📋 Project Structure

```
projet-pfe/
├── smart/                  # Main Laravel application
│   ├── app/               # Application core files
│   │   ├── Console/       # Artisan commands
│   │   ├── Http/          # Controllers, middleware, requests
│   │   ├── Models/        # Eloquent models
│   │   ├── Notifications/ # Notification classes
│   │   └── Providers/     # Service providers
│   ├── config/            # Configuration files
│   ├── database/          # Migrations, seeders, factories
│   │   ├── migrations/    # Database schema migrations
│   │   ├── seeders/       # Database seeders (Teams, Users, etc.)
│   │   └── schema/        # Database schema files
│   ├── public/            # Public web directory
│   ├── resources/         # Views, assets, language files
│   │   ├── css/           # Stylesheets
│   │   ├── js/            # JavaScript files
│   │   └── views/         # Blade templates
│   ├── routes/            # Route definitions
│   │   ├── api.php        # API routes
│   │   ├── web.php        # Web routes
│   │   └── test-routes.php # Test routes
│   ├── storage/           # Storage for logs, cache, uploads
│   ├── tests/             # PHPUnit tests
│   └── vendor/            # Composer dependencies
├── template/              # Frontend template and assets
│   ├── src/               # Template source files
│   ├── public/            # Template public assets
│   └── package.json       # NPM dependencies for template
├── vendor/                # Root level Composer dependencies
├── composer.json          # Root Composer configuration
├── laravel.sql           # Database schema and sample data
└── README.md             # This file
```

## 🛠️ Technology Stack

### Backend
- **Framework**: Laravel 11.x
- **PHP Version**: 8.2+
- **Database**: MySQL/PostgreSQL/SQLite
- **Authentication**: JWT (Tymon JWT-Auth)
- **PDF Generation**: DomPDF (barryvdh/laravel-dompdf)
- **HTTP Client**: Guzzle HTTP

### Frontend
- **Template Engine**: Blade
- **CSS Framework**: Bootstrap 5
- **JavaScript**: Vanilla JS with modern ES6+
- **Build Tool**: Vite
- **Icons**: Font Awesome

### Development & Testing
- **Testing**: PHPUnit
- **Code Quality**: Laravel Pint
- **Development Environment**: Laravel Sail (optional)
- **Debugging**: Laravel Telescope (optional)

## 📦 Installation & Setup

### Prerequisites

Ensure you have the following installed on your system:

- **PHP 8.2 or higher** with extensions:
  - BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML
- **Composer** (latest version)
- **Node.js 18+** & **NPM**
- **Database**: MySQL 8.0+, PostgreSQL 13+, or SQLite 3.8+
- **Web Server**: Apache, Nginx, or PHP built-in server

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/smart-commission-management.git
   cd smart-commission-management
   ```

2. **Navigate to the Laravel application**
   ```bash
   cd smart
   ```

3. **Install PHP dependencies**
   ```bash
   composer install
   ```

4. **Install Node.js dependencies**
   ```bash
   npm install
   ```

5. **Environment setup**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Generate application key
   php artisan key:generate
   
   # Generate JWT secret key
   php artisan jwt:secret
   ```

6. **Configure your environment**
   
   Edit the `.env` file with your database and application settings:
   ```env
   APP_NAME="Smart Commission Management"
   APP_ENV=local
   APP_DEBUG=true
   APP_URL=http://localhost:8000
   
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=smart_commission
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_here
   JWT_TTL=60
   
   # Mail Configuration (for notifications)
   MAIL_MAILER=smtp
   MAIL_HOST=localhost
   MAIL_PORT=1025
   MAIL_USERNAME=null
   MAIL_PASSWORD=null
   MAIL_ENCRYPTION=null
   ```

7. **Set up the database**
   ```bash
   # Run migrations and seed the database
   php artisan migrate --seed
   ```

8. **Build frontend assets**
   ```bash
   # For development
   npm run dev
   
   # For production
   npm run build
   ```

9. **Start the development server**
   ```bash
   php artisan serve
   ```

Your application will be available at `http://localhost:8000`

### Database Seeding

The application comes with comprehensive seeders that populate the database with:

- **Team/Department data**: Finance, IT, Marketing, HR, R&D departments
- **Sample users**: Test users with different roles
- **Initial services**: Predefined services with colors and descriptions
- **Test meetings**: Sample meetings for demonstration

### Testing the Installation

After setup, you can test various components:

```bash
# Test basic functionality
php artisan route:list

# Test notifications system
php test_notifications.php

# Test non-scheduler notifications
php test_non_scheduler_notifications.php

# Run the test suite
php artisan test
```

## ⚙️ Configuration

### Core Configuration Files

- **`config/app.php`**: Main application settings
- **`config/database.php`**: Database connection settings  
- **`config/mail.php`**: Email notification settings
- **`config/jwt.php`**: JWT authentication configuration
- **`config/cors.php`**: Cross-Origin Resource Sharing settings

### Environment Variables

Essential environment variables for the `.env` file:

```env
# Application
APP_NAME="Smart Commission Management"
APP_ENV=production  # or local for development
APP_DEBUG=false     # true for development
APP_URL=https://yourdomain.com

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=smart_commission
DB_USERNAME=your_username
DB_PASSWORD=your_password

# JWT Authentication
JWT_SECRET=your_super_secure_jwt_secret_key
JWT_TTL=60                    # Token lifetime in minutes
JWT_REFRESH_TTL=20160        # Refresh token lifetime in minutes
JWT_ALGO=HS256               # Algorithm for signing tokens

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com     # or your SMTP server
MAIL_PORT=587
MAIL_USERNAME=your_email@domain.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"

# Cache & Session
CACHE_DRIVER=file
SESSION_DRIVER=file
SESSION_LIFETIME=120

# Queue (for background jobs)
QUEUE_CONNECTION=sync        # Use 'database' or 'redis' for production
```

### Advanced Notification System

The notification system is designed to work without Laravel's task scheduler, making it highly portable:

#### Features
- **Login-triggered notifications**: Checks for today's meetings when users log in
- **API polling**: Frontend periodically checks for new notifications
- **Browser notifications**: Desktop alerts with permission management
- **Email notifications**: SMTP-based email alerts
- **Fallback mechanisms**: Multiple notification delivery methods

#### Configuration
```env
# Notification settings (optional)
NOTIFICATION_CHECK_INTERVAL=30000    # Frontend polling interval (ms)
NOTIFICATION_ENABLE_BROWSER=true     # Enable browser notifications
NOTIFICATION_ENABLE_EMAIL=true       # Enable email notifications
```

#### Browser Notification Setup
1. Users will be prompted for notification permission on first visit
2. Notifications appear for meetings scheduled for the current day
3. Configurable through the application settings

### Scheduler Setup (Optional Enhancement)

While the notification system works without it, you can set up Laravel's task scheduler for additional features:

#### Windows Setup
```powershell
# Run the PowerShell script as Administrator
.\smart\setup-scheduler.ps1
```

#### Linux/macOS Setup
```bash
# Add to crontab
crontab -e

# Add this line:
* * * * * cd /path/to/your/project/smart && php artisan schedule:run >> /dev/null 2>&1
```

#### Manual Scheduler Testing
```bash
cd smart
php artisan schedule:list
php artisan schedule:work
```

## 📱 Usage Guide

### For End Users

#### Getting Started
1. **Access the Application**: Navigate to the application URL
2. **Login**: Use your provided credentials to access the system
3. **Dashboard Overview**: View your personalized dashboard with:
   - Today's meetings count
   - Recent notifications
   - Commission status updates
   - Quick action buttons

#### Core Features

**Commission Management**
- View assigned commissions
- Track commission status and progress
- Submit commission-related documents
- Receive notifications for commission updates

**Meeting Participation**
- View scheduled meetings
- Receive meeting reminders via browser notifications
- Access meeting details and documentation
- Join virtual meetings (if integrated)

**Notification Center**
- Click the notification bell to view all notifications
- Automatic notifications for:
  - Meetings scheduled for today (shown on login)
  - Commission status changes
  - System announcements
- Enable browser notifications for real-time alerts

**Profile Management**
- Update personal information
- Change password
- Configure notification preferences
- View team and department assignments

#### Browser Notifications Setup
1. When accessing the dashboard, allow notification permissions when prompted
2. For manual setup:
   - **Chrome**: Settings → Privacy and Security → Site Settings → Notifications
   - **Firefox**: Settings → Privacy & Security → Permissions → Notifications
   - **Edge**: Settings → Site Permissions → Notifications

### For Administrators

#### User Management
- **Create Users**: Add new users with appropriate roles
- **Manage Teams**: Assign users to departments (Finance, IT, Marketing, HR, R&D)
- **Role Assignment**: Configure user permissions and access levels
- **User Monitoring**: Track user activity and login statistics

#### Commission Oversight
- **Commission Dashboard**: Overview of all commissions in the system
- **Status Tracking**: Monitor commission progress across all departments
- **Report Generation**: Create PDF reports for commission activities
- **Workflow Management**: Configure commission approval workflows

#### System Administration
- **Notification Management**: Configure system-wide notification settings
- **Service Management**: Define and manage service offerings
- **System Monitoring**: View application logs and performance metrics
- **Database Management**: Access database statistics and maintenance tools

#### Advanced Features
- **API Management**: Monitor API usage and generate API tokens
- **Export Functions**: Export data to various formats (PDF, Excel)
- **Audit Trails**: Track system changes and user activities
- **Backup Management**: Configure and monitor system backups

### API Usage

The application provides a comprehensive RESTful API with JWT authentication:

#### Authentication
```bash
# Login to get JWT token
curl -X POST http://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Use token for authenticated requests
curl -X GET http://your-domain.com/api/commissions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Key API Endpoints
- **Authentication**: `/api/auth/*` (login, logout, refresh, user profile)
- **Commissions**: `/api/commissions/*` (CRUD operations)
- **Meetings**: `/api/meetings/*` (schedule, view, update)
- **Notifications**: `/api/notifications/*` (fetch, mark as read)
- **Users**: `/api/users/*` (user management - admin only)

#### API Documentation
For complete API documentation, visit `/api/documentation` (if API documentation is enabled) or check the `routes/api.php` file for available endpoints.

## 🧪 Testing & Quality Assurance

### Running Tests

The application includes comprehensive testing suites:

```bash
# Run all PHPUnit tests
cd smart
php artisan test

# Run specific test suites
php artisan test --testsuite=Feature
php artisan test --testsuite=Unit

# Run tests with coverage (requires Xdebug)
php artisan test --coverage

# Run specific test files
php artisan test tests/Feature/AuthTest.php
```

### Notification System Testing

Test the notification system with the provided scripts:

```bash
cd smart

# Test complete notification system
php test_notifications.php

# Test notifications without scheduler dependency
php test_non_scheduler_notifications.php

# Test specific notification types
php test_commission_notification.php
php test_manual_notification.php
php test_join_meeting.php
```

### Database Testing

```bash
# Check database connection and statistics
php check_db_stats.php

# Verify data integrity
php check_data.php
php check_test_data.php

# Test meeting functionality
php check_meetings.php
```

### Performance Testing

```bash
# Check application performance
php artisan route:list
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Clear caches during development
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Code Quality

```bash
# Format code with Laravel Pint
./vendor/bin/pint

# Check for common issues
php artisan insights
```

## 🚀 Deployment

### Production Requirements

**Server Specifications**
- **PHP**: 8.2+ with required extensions (see installation section)
- **Memory**: Minimum 512MB, recommended 1GB+
- **Database**: MySQL 8.0+, PostgreSQL 13+, or SQLite 3.8+
- **Web Server**: Nginx (recommended) or Apache
- **SSL Certificate**: Required for production (Let's Encrypt recommended)

**PHP Extensions Required**
```
BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML, GD, Zip
```

### Production Deployment Steps

1. **Server Setup**
   ```bash
   # Clone repository to production server
   git clone https://github.com/your-username/smart-commission-management.git
   cd smart-commission-management/smart
   
   # Install dependencies (production only)
   composer install --optimize-autoloader --no-dev
   npm ci --production
   ```

2. **Environment Configuration**
   ```bash
   # Create production environment file
   cp .env.example .env
   
   # Edit .env with production settings
   nano .env
   ```

   **Critical Production Settings**:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://yourdomain.com
   
   # Use strong, unique keys
   APP_KEY=base64:your_generated_app_key
   JWT_SECRET=your_super_secure_jwt_secret
   
   # Production database settings
   DB_CONNECTION=mysql
   DB_HOST=your_db_host
   DB_DATABASE=your_production_db
   DB_USERNAME=your_db_user
   DB_PASSWORD=your_secure_password
   
   # Production mail settings
   MAIL_MAILER=smtp
   MAIL_HOST=your_smtp_server
   ```

3. **Database Migration**
   ```bash
   # Run migrations on production database
   php artisan migrate --force
   
   # Seed initial data (optional, review seeders first)
   php artisan db:seed --force
   ```

4. **Optimization**
   ```bash
   # Generate application key
   php artisan key:generate
   
   # Generate JWT secret
   php artisan jwt:secret
   
   # Cache configuration for performance
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   
   # Build production assets
   npm run build
   ```

5. **File Permissions**
   ```bash
   # Set proper permissions
   chmod -R 755 storage
   chmod -R 755 bootstrap/cache
   chown -R www-data:www-data storage
   chown -R www-data:www-data bootstrap/cache
   ```

### Web Server Configuration

#### Nginx Configuration
```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name yourdomain.com;
    root /path/to/smart-commission-management/smart/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

#### Apache Configuration
```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /path/to/smart-commission-management/smart/public
    
    <Directory /path/to/smart-commission-management/smart/public>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

### Monitoring & Maintenance

**Log Monitoring**
```bash
# Monitor application logs
tail -f storage/logs/laravel.log

# Check web server logs
tail -f /var/log/nginx/error.log
```

**Regular Maintenance**
```bash
# Update dependencies (test in staging first)
composer update
npm update

# Clear old logs
php artisan log:clear

# Optimize application
php artisan optimize
```

### SSL Certificate Setup

```bash
# Using Let's Encrypt with Certbot
sudo certbot --nginx -d yourdomain.com

# Auto-renewal setup
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📚 Documentation

### Project Documentation
- **[Main README](README.md)** - This comprehensive guide
- **[Notification Guide](smart/NOTIFICATION_GUIDE.md)** - End-user guide for the notification system
- **[Technical Documentation](smart/notification_docs.md)** - Technical implementation details
- **[Notification Changelog](smart/NOTIFICATION_CHANGELOG.md)** - Recent changes and updates

### Code Documentation
- **API Routes**: Check `smart/routes/api.php` for all API endpoints
- **Database Schema**: Review `smart/database/migrations/` for database structure
- **Models**: Explore `smart/app/Models/` for data relationships
- **Controllers**: Located in `smart/app/Http/Controllers/`

### Additional Resources
- **Laravel Documentation**: [https://laravel.com/docs](https://laravel.com/docs)
- **JWT Auth Package**: [https://jwt-auth.readthedocs.io](https://jwt-auth.readthedocs.io)
- **DomPDF Documentation**: [https://github.com/barryvdh/laravel-dompdf](https://github.com/barryvdh/laravel-dompdf)

## 🤝 Contributing

We welcome contributions to the Smart Commission Management System! Here's how you can help:

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/smart-commission-management.git
   cd smart-commission-management
   ```

3. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-new-feature
   ```

4. **Set up development environment**:
   ```bash
   cd smart
   composer install
   npm install
   cp .env.example .env
   php artisan key:generate
   php artisan jwt:secret
   php artisan migrate --seed
   ```

### Contribution Guidelines

**Code Standards**
- Follow PSR-12 coding standards
- Use meaningful variable and method names
- Write comprehensive comments for complex logic
- Follow Laravel best practices and conventions

**Testing Requirements**
- Write tests for new features
- Ensure all existing tests pass
- Maintain test coverage above 80%
- Test notification features thoroughly

**Pull Request Process**
1. **Update documentation** for any new features
2. **Run the test suite** and ensure all tests pass
3. **Run code formatting**:
   ```bash
   ./vendor/bin/pint
   ```
4. **Write clear commit messages** describing your changes
5. **Submit a detailed pull request** with:
   - Description of changes
   - Screenshots (for UI changes)
   - Testing instructions
   - Any breaking changes

### Development Guidelines

**Database Changes**
- Always create migrations for database changes
- Include rollback functionality in migrations
- Update seeders if necessary
- Test migrations on different database engines

**API Development**
- Maintain RESTful conventions
- Include proper error handling
- Document new endpoints
- Test with different user roles

**Frontend Changes**
- Ensure responsive design
- Test across different browsers
- Maintain accessibility standards
- Optimize for performance

### Reporting Issues

When reporting bugs or requesting features:

1. **Check existing issues** to avoid duplicates
2. **Use descriptive titles** and provide detailed descriptions
3. **Include steps to reproduce** for bugs
4. **Provide system information** (PHP version, database, etc.)
5. **Add screenshots or logs** when relevant

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

- ✅ **Use**: Commercial and private use allowed
- ✅ **Modify**: Modification and distribution allowed
- ✅ **Distribute**: Distribution allowed
- ✅ **Private Use**: Private use allowed
- ❗ **Liability**: Limited liability and warranty
- ❗ **Attribution**: License and copyright notice required

## 🙏 Acknowledgments

### Built With
- **[Laravel](https://laravel.com/)** - The elegant PHP framework
- **[Bootstrap](https://getbootstrap.com/)** - Responsive CSS framework
- **[Font Awesome](https://fontawesome.com/)** - Icon library
- **[Chart.js](https://www.chartjs.org/)** - Data visualization
- **[jQuery](https://jquery.com/)** - JavaScript library

### Special Thanks
- Laravel team for the amazing framework
- JWT-Auth contributors for authentication package
- DomPDF team for PDF generation capabilities
- The open-source community for various packages and tools

### Contributors
- **Trabelsi Mohamed Amine** - Initial development and project lead
- Contributors welcome! See [Contributing](#-contributing) section

## 📞 Support & Contact

### Getting Help
- **Documentation**: Start with this README and the documentation links
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and community support

### Professional Support
For professional support, custom development, or enterprise features:
- Create an issue with the `support` label
- Provide detailed requirements and timelines
- Include your contact information for follow-up

### Community
- **GitHub Discussions**: Ask questions and share ideas
- **Issue Tracker**: Report bugs and request features
- **Pull Requests**: Contribute code improvements

---

## 🚀 Quick Links

- **[Live Demo](#)** (if available)
- **[Documentation](smart/NOTIFICATION_GUIDE.md)**
- **[API Documentation](#api-usage)**
- **[Contributing Guidelines](#-contributing)**
- **[Issue Tracker](https://github.com/your-username/smart-commission-management/issues)**
- **[Releases](https://github.com/your-username/smart-commission-management/releases)**

---

**Smart Commission Management System** - Streamlining commission management with modern web technology and intelligent notifications.

Made with ❤️ using Laravel
