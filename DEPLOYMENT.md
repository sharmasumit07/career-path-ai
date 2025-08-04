# Deployment Guide for CareerGuide AI

This guide covers different deployment options for the CareerGuide AI application.

## 🚀 Quick Deployment Options

### Option 1: Replit (Recommended for Testing)

1. Fork this repository on Replit
2. Set environment variables in the Secrets tab:
   ```
   OPENAI_API_KEY=your_key_here
   DATABASE_URL=postgresql://... (optional)
   SESSION_SECRET=your_secure_secret
   ```
3. Click Run to start the application

### Option 2: Vercel + Neon Database

#### Database Setup (Neon)
1. Create account at [Neon.tech](https://neon.tech)
2. Create a new database project
3. Copy the connection string

#### Vercel Deployment
1. Fork this repository to GitHub
2. Connect to Vercel
3. Set environment variables:
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://... (from Neon)
   OPENAI_API_KEY=your_key_here
   SESSION_SECRET=your_secure_secret
   ```
4. Deploy

### Option 3: Railway

1. Fork repository to GitHub
2. Connect to Railway
3. Add PostgreSQL service
4. Set environment variables
5. Deploy

### Option 4: DigitalOcean App Platform

1. Fork repository
2. Create new app on DigitalOcean
3. Add managed PostgreSQL database
4. Configure environment variables
5. Deploy

## 🔧 Environment Variables

Required variables for production:

```env
# Required
NODE_ENV=production
SESSION_SECRET=your-very-secure-secret-key-here

# AI Service (at least one required)
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key

# Database (required for production)
DATABASE_URL=postgresql://user:password@host:port/database

# Optional
PORT=5000
```

## 🗄️ Database Setup

### Automatic Setup
The application will automatically create tables if they don't exist when using Drizzle ORM.

### Manual Setup
If you need to set up the database manually:

```bash
npm run db:push
```

## 🚀 Build and Start

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

## 🔒 Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure session secret (min 32 characters)
- [ ] Configure CORS if needed
- [ ] Set up rate limiting (already configured)
- [ ] Use environment variables for secrets
- [ ] Regularly update dependencies
- [ ] Monitor for security vulnerabilities

## 📊 Performance Optimization

### Already Implemented
- ✅ Response compression
- ✅ Rate limiting
- ✅ Request size limits
- ✅ Database connection pooling
- ✅ Error handling and logging
- ✅ Production build optimization

### Additional Recommendations
- Use CDN for static assets
- Enable caching headers
- Monitor application performance
- Set up log aggregation

## 🔍 Monitoring and Health Checks

### Health Check Endpoint
```
GET /health
```

Returns:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "memory": {...},
  "version": "1.0.0"
}
```

### Monitoring Setup
1. Set up uptime monitoring (e.g., UptimeRobot)
2. Monitor `/health` endpoint
3. Set up error tracking (e.g., Sentry)
4. Monitor database performance
5. Track API response times

## 🐛 Troubleshooting

### Common Issues

**Build Fails**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Database Connection Issues**
- Verify DATABASE_URL format
- Check network connectivity
- Ensure database exists
- Verify credentials

**AI Service Issues**
- Verify API keys are correct
- Check API rate limits
- Monitor API usage
- Application falls back to demo mode if APIs fail

**Performance Issues**
- Check database query performance
- Monitor memory usage
- Verify rate limiting settings
- Check for memory leaks

### Logs and Debugging

**Production Logs**
```bash
# View logs (depends on platform)
# Vercel: View in dashboard
# Railway: railway logs
# Heroku: heroku logs --tail
```

**Debug Mode**
Set `NODE_ENV=development` to enable:
- Detailed error messages
- Stack traces in responses
- Verbose logging

## 📈 Scaling

### Horizontal Scaling
- Application is stateless (except for in-memory session storage)
- Use database sessions for multi-instance deployment
- Load balancer compatible
- Can run multiple instances

### Database Scaling
- Use connection pooling (configured in Drizzle)
- Consider read replicas for heavy read workloads
- Monitor query performance
- Index optimization

### Caching Strategy
- API responses can be cached
- Static assets are pre-compressed
- Consider Redis for session storage at scale

## 🔄 Updates and Maintenance

### Regular Maintenance
```bash
# Update dependencies
npm update

# Security audit
npm audit

# Check for outdated packages
npm outdated
```

### Database Migrations
```bash
# Generate migration
npx drizzle-kit generate

# Push changes
npm run db:push
```

## 📞 Support

For deployment issues:
1. Check this guide first
2. Review application logs
3. Check environment variables
4. Verify external service connectivity
5. Open an issue in the repository

## 🚀 Production Checklist

Before going live:

- [ ] Environment variables configured
- [ ] Database connected and tested
- [ ] AI services configured
- [ ] Health check responds correctly
- [ ] HTTPS configured
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Security review completed
- [ ] Performance testing done
- [ ] Error tracking configured