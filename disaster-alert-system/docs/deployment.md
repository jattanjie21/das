# Disaster Alert System Deployment Guide

## Prerequisites

- Node.js 18.x or later
- PostgreSQL 14.x or later
- Supabase account
- Mapbox account
- Vercel account (recommended for deployment)

## Environment Setup

1. **Clone Repository**
```bash
git clone https://github.com/your-org/disaster-alert-system.git
cd disaster-alert-system
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Variables**
Create a `.env` file with the following variables:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Mapbox Configuration
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

## Database Setup

1. **Create Supabase Project**
   - Go to Supabase Dashboard
   - Create new project
   - Note down connection details

2. **Run Migrations**
   - Copy SQL from `src/lib/supabase/schema.sql`
   - Run in Supabase SQL Editor
   - Verify tables are created

3. **Configure RLS Policies**
   - Review and apply RLS policies
   - Test with different user roles

## Development Deployment

1. **Local Development**
```bash
# Start development server
npm run dev

# Run tests
npm test

# Build application
npm run build
```

2. **Testing**
   - Run unit tests
   - Test API endpoints
   - Verify real-time updates
   - Check permissions

## Production Deployment

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   - Import project to Vercel
   - Configure environment variables
   - Select Node.js version

2. **Deploy**
   - Trigger deployment
   - Monitor build logs
   - Verify deployment

3. **Domain Setup**
   - Configure custom domain
   - Set up SSL certificate
   - Update DNS records

### Option 2: Self-Hosted

1. **Server Requirements**
   - Ubuntu 20.04 LTS
   - 2 CPU cores
   - 4GB RAM
   - 20GB SSD

2. **Server Setup**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Setup application
git clone https://github.com/your-org/disaster-alert-system.git
cd disaster-alert-system
npm install
npm run build
```

3. **Process Management**
```bash
# Start with PM2
pm2 start npm --name "disaster-alert" -- start

# Monitor application
pm2 monitor

# Setup auto-restart
pm2 startup
pm2 save
```

4. **Nginx Configuration**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring & Maintenance

1. **Application Monitoring**
   - Set up error tracking (e.g., Sentry)
   - Configure performance monitoring
   - Set up uptime monitoring

2. **Database Maintenance**
   - Regular backups
   - Performance optimization
   - Index maintenance

3. **Security**
   - Regular security updates
   - SSL certificate renewal
   - Access log monitoring

4. **Backup Strategy**
   - Daily database backups
   - File system backups
   - Backup verification

## Scaling

1. **Horizontal Scaling**
   - Load balancer setup
   - Multiple application instances
   - Database replication

2. **Performance Optimization**
   - CDN integration
   - Cache implementation
   - Query optimization

3. **Resource Monitoring**
   - CPU usage
   - Memory utilization
   - Network bandwidth

## Troubleshooting

1. **Common Issues**
   - Database connection errors
   - Real-time update failures
   - Authentication issues

2. **Logs**
   - Application logs
   - Nginx logs
   - Database logs

3. **Debug Tools**
   - Browser DevTools
   - API testing tools
   - Database monitoring

## Rollback Procedure

1. **Version Control**
   - Maintain release tags
   - Document dependencies
   - Keep configuration backups

2. **Rollback Steps**
```bash
# Switch to previous version
git checkout v1.x.x

# Rebuild application
npm install
npm run build

# Restart service
pm2 restart disaster-alert
```

## Maintenance Windows

1. **Schedule**
   - Regular updates: Monthly
   - Security patches: As needed
   - Database maintenance: Weekly

2. **Communication**
   - User notifications
   - Status page updates
   - Maintenance logs

## Support

- Technical support contact
- Emergency procedures
- Escalation matrix
- Documentation updates 