# Tween Agency Backend

Python Flask backend for the Tween Digital Agency website.

## Features

- **Contact Form API**: Handle contact form submissions
- **Newsletter API**: Manage newsletter subscriptions  
- **Services API**: Retrieve service information
- **Analytics API**: Basic analytics data
- **Database**: SQLite for data persistence

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Backend**:
   ```bash
   python app.py
   ```

3. **Server**: Runs on `http://localhost:5000`

## API Endpoints

### POST /api/contact
Handle contact form submissions
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "subject": "Inquiry",
  "message": "Hello, I need help with..."
}
```

### POST /api/newsletter  
Handle newsletter subscriptions
```json
{
  "email": "user@example.com"
}
```

### GET /api/services
Get all services
```json
{
  "success": true,
  "services": [...]
}
```

### GET /api/analytics
Get basic analytics
```json
{
  "success": true,
  "analytics": {
    "total_contacts": 150,
    "total_newsletter_subscribers": 75
  }
}
```

### GET /health
Health check endpoint
```json
{
  "status": "healthy",
  "timestamp": "2024-03-15T10:30:00",
  "version": "1.0.0"
}
```

## Database Schema

- **contacts**: id, name, email, subject, message, created_at
- **newsletter**: id, email, created_at  
- **services**: id, name, description, image_url, created_at

## Frontend Integration

Update your frontend forms to send requests to:
- Contact form: `POST /api/contact`
- Newsletter: `POST /api/newsletter`
- Services data: `GET /api/services`
