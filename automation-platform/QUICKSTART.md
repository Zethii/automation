# Quick Start Guide

Get your Income Automation Hub running in 5 minutes.

## 1. Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- PostgreSQL 12+ ([Download](https://www.postgresql.org/download/))
- Git ([Download](https://git-scm.com/))

## 2. Clone & Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd automation-platform

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## 3. Database Setup

```bash
# Create database
createdb automation_platform

# Run migrations
cd backend
npm run migrate
```

## 4. Configure Environment

```bash
# Copy environment template
cp backend/.env.example backend/.env

# Edit with your settings
nano backend/.env
```

**Minimum required:**
```
DATABASE_URL=postgresql://localhost/automation_platform
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## 5. Start the Application

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 6. First Steps

### Step 1: Generate Content
1. Go to "Content Hub" → "Generate"
2. Select niche (Tech, Finance, or Lifestyle)
3. Click "Generate Content"
4. Review and edit the generated content

### Step 2: Schedule Posts
1. Go to "Social Media" → "Schedule"
2. Select your generated content
3. Choose platforms (Instagram, TikTok, Twitter, etc.)
4. Set posting time
5. Click "Schedule"

### Step 3: Create Affiliate Links
1. Go to "Affiliate" → "Create Link"
2. Paste your affiliate URL
3. Select network (Amazon, CJ, ShareASale, Clickbank)
4. Set commission rate
5. Click "Create"

### Step 4: Add Products (E-commerce)
1. Go to "E-commerce" → "Add Product"
2. Fill in product details
3. Upload images
4. Set price and inventory
5. Click "Add Product"

### Step 5: Monitor Earnings
1. Go to "Analytics" → "Dashboard"
2. View real-time earnings
3. Check click-through rates
4. Monitor conversion rates

## 7. API Integration (Optional)

To enable AI content generation:

1. Get OpenAI API key: https://platform.openai.com/api-keys
2. Add to `.env`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```
3. Restart backend: `npm run dev`

## 8. Deploy to Production

### Option A: Heroku (Easiest)
```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set JWT_SECRET=your-secret
git push heroku main
heroku run npm run migrate
```

### Option B: Railway
1. Connect GitHub repo to Railway
2. Add PostgreSQL database
3. Set environment variables
4. Deploy

### Option C: Docker
```bash
docker-compose up -d
```

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for more options.

## 9. Compliance Checklist

Before going live:

- [ ] Add affiliate disclosures to all content
- [ ] Review platform terms of service
- [ ] Set up privacy policy
- [ ] Configure GDPR compliance
- [ ] Test all affiliate links
- [ ] Verify payment processing
- [ ] Set up email notifications

## 10. Common Tasks

### Generate Multiple Content Pieces
```bash
# Via API
curl -X POST http://localhost:3001/api/content/batch \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "niche": "tech",
    "count": 10,
    "platforms": ["instagram", "tiktok"]
  }'
```

### Check Earnings
```bash
# Via API
curl http://localhost:3001/api/affiliate/earnings \
  -H "Authorization: Bearer your-token"
```

### View Scheduled Posts
```bash
# Via API
curl http://localhost:3001/api/social/scheduled \
  -H "Authorization: Bearer your-token"
```

## 11. Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U postgres -d automation_platform

# Reset database
dropdb automation_platform
createdb automation_platform
npm run migrate
```

### Port Already in Use
```bash
# Find process using port 3001
lsof -i :3001

# Kill process
kill -9 <PID>
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 12. Next Steps

1. **Customize Content**: Edit templates in content generator
2. **Add More Platforms**: Integrate with additional social networks
3. **Expand Niches**: Add more content categories
4. **Scale Up**: Deploy to production and increase posting frequency
5. **Optimize**: Monitor analytics and refine strategy

## 13. Resources

- **Documentation**: See [README.md](README.md)
- **API Docs**: See [docs/API.md](docs/API.md)
- **Deployment**: See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- **Support**: Email support@automationhub.com

## 14. Important Reminders

⚠️ **Compliance is Critical**
- Always disclose affiliate relationships
- Follow platform terms of service
- Provide genuine value to your audience
- Monitor for policy violations
- Keep accurate financial records

✅ **Best Practices**
- Start small and test
- Monitor performance metrics
- Adjust strategy based on data
- Engage with your audience
- Build long-term relationships

---

**Ready to automate your income? Let's go! 🚀**
