# Deployment Guide

This guide covers deploying the Income Automation Hub to various hosting platforms.

## Prerequisites

- Git repository with code pushed
- PostgreSQL database
- Environment variables configured
- API keys for integrations

## Option 1: Heroku (Recommended for Beginners)

### Setup

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
heroku create your-app-name
```

4. **Add PostgreSQL Database**
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

5. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-key
heroku config:set OPENAI_API_KEY=your-key
# Add other API keys as needed
```

6. **Deploy**
```bash
git push heroku main
```

7. **Run Migrations**
```bash
heroku run npm run migrate
```

### Monitoring

```bash
# View logs
heroku logs --tail

# Check app status
heroku ps

# Scale dynos
heroku ps:scale web=2
```

---

## Option 2: Railway

### Setup

1. **Connect GitHub**
   - Go to railway.app
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Authorize and select your repository

2. **Add PostgreSQL**
   - Click "Add Service"
   - Select "PostgreSQL"
   - Railway will auto-connect

3. **Configure Environment**
   - Go to "Variables"
   - Add all environment variables from `.env.example`
   - Railway will auto-set `DATABASE_URL`

4. **Deploy**
   - Railway auto-deploys on push to main
   - Monitor deployment in "Deployments" tab

### Custom Domain

1. Go to "Settings"
2. Add custom domain
3. Update DNS records at your registrar

---

## Option 3: Render

### Setup

1. **Create Web Service**
   - Go to render.com
   - Click "New Web Service"
   - Connect GitHub repository

2. **Configure**
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
   - **Region**: Choose closest to users

3. **Add Database**
   - Click "New PostgreSQL"
   - Render will provide `DATABASE_URL`

4. **Environment Variables**
   - Add all variables in "Environment" tab
   - Render auto-injects `DATABASE_URL`

5. **Deploy**
   - Click "Deploy"
   - Monitor in "Logs" tab

---

## Option 4: DigitalOcean App Platform

### Setup

1. **Create App**
   - Go to DigitalOcean console
   - Click "Create" → "App"
   - Connect GitHub repository

2. **Configure**
   - Set build command: `npm install && npm run build`
   - Set run command: `npm start`

3. **Add Database**
   - Click "Add Component"
   - Select "Database"
   - Choose PostgreSQL
   - Set database name: `automation_platform`

4. **Environment Variables**
   - Add all variables
   - DigitalOcean provides `DATABASE_URL`

5. **Deploy**
   - Click "Deploy"

---

## Option 5: AWS (EC2 + RDS)

### Setup Backend

1. **Launch EC2 Instance**
```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

2. **Clone Repository**
```bash
git clone your-repo-url
cd automation-platform/backend
npm install
npm run build
```

3. **Create RDS Database**
   - AWS Console → RDS
   - Create PostgreSQL instance
   - Note the endpoint and credentials
   - Update `.env` with connection string

4. **Configure PM2**
```bash
pm2 start "npm start" --name "automation-platform"
pm2 startup
pm2 save
```

5. **Setup Nginx Reverse Proxy**
```bash
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

6. **Enable SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

7. **Restart Nginx**
```bash
sudo systemctl restart nginx
```

---

## Option 6: Self-Hosted VPS

### Setup on Ubuntu/Debian

1. **Install Dependencies**
```bash
sudo apt update
sudo apt install -y curl wget git nodejs npm postgresql postgresql-contrib nginx
```

2. **Create Database**
```bash
sudo -u postgres createdb automation_platform
sudo -u postgres psql -c "CREATE USER app_user WITH PASSWORD 'strong_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE automation_platform TO app_user;"
```

3. **Clone and Setup App**
```bash
git clone your-repo-url
cd automation-platform/backend
npm install
npm run build

# Create .env file
cp .env.example .env
nano .env  # Update with your values
```

4. **Setup PM2**
```bash
sudo npm install -g pm2
pm2 start "npm start" --name "automation-platform"
pm2 startup
pm2 save
```

5. **Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/automation-platform
```

Add configuration (see AWS section above)

6. **Enable and Start Services**
```bash
sudo systemctl enable nginx
sudo systemctl start nginx
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

7. **Setup SSL**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Docker Deployment

### Build Docker Image

```bash
docker build -t automation-platform:latest .
```

### Run with Docker Compose

```bash
docker-compose up -d
```

### Push to Docker Hub

```bash
docker tag automation-platform:latest your-username/automation-platform:latest
docker push your-username/automation-platform:latest
```

### Deploy to Kubernetes

1. **Create Deployment**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: automation-platform
spec:
  replicas: 3
  selector:
    matchLabels:
      app: automation-platform
  template:
    metadata:
      labels:
        app: automation-platform
    spec:
      containers:
      - name: app
        image: your-username/automation-platform:latest
        ports:
        - containerPort: 3001
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
```

2. **Deploy**
```bash
kubectl apply -f deployment.yaml
```

---

## Post-Deployment

### 1. Run Migrations
```bash
npm run migrate
```

### 2. Seed Initial Data (Optional)
```bash
npm run seed
```

### 3. Setup Monitoring
- Enable application monitoring
- Set up error tracking (Sentry, etc.)
- Configure logging (ELK, CloudWatch, etc.)

### 4. Backup Strategy
- Daily database backups
- Store backups in S3 or similar
- Test restore procedures

### 5. Security Hardening
- Enable HTTPS/SSL
- Set up firewall rules
- Configure rate limiting
- Enable CORS properly
- Use environment variables for secrets

### 6. Performance Optimization
- Enable caching (Redis)
- Use CDN for static assets
- Optimize database queries
- Monitor and scale as needed

---

## Troubleshooting

### Database Connection Issues
```bash
# Test connection
psql -h your-host -U your-user -d automation_platform

# Check logs
tail -f /var/log/postgresql/postgresql.log
```

### Application Won't Start
```bash
# Check Node.js version
node --version

# Check for port conflicts
lsof -i :3001

# Check logs
pm2 logs automation-platform
```

### Memory Issues
```bash
# Monitor memory
free -h

# Check Node.js memory usage
ps aux | grep node

# Increase swap if needed
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## Scaling

### Horizontal Scaling
- Deploy multiple instances behind load balancer
- Use session management (Redis)
- Ensure database can handle connections

### Vertical Scaling
- Increase server resources
- Optimize code and queries
- Use caching strategically

### Database Scaling
- Read replicas for read-heavy workloads
- Connection pooling
- Query optimization
- Partitioning for large tables

---

## Monitoring & Alerts

### Key Metrics to Monitor
- CPU usage
- Memory usage
- Database connections
- Response time
- Error rate
- Conversion rate
- Revenue

### Setup Alerts
- CPU > 80%
- Memory > 85%
- Error rate > 5%
- Response time > 2s
- Database connection pool full

---

## Support

For deployment issues:
- Check logs first
- Review error messages carefully
- Test locally before deploying
- Use staging environment
- Contact support if stuck
