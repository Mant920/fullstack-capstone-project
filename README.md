# GiftLink — Full-Stack Capstone Project

A community gift-sharing platform built with React, Node.js/Express, and MongoDB.

## Project Structure

```
fullstack-capstone-project/
├── giftlink-backend/          # Express REST API (port 3060)
│   ├── app.js                 # Main server entry point
│   ├── db.js                  # MongoDB connection helper
│   ├── routes/
│   │   ├── giftRoutes.js      # GET /api/gifts, GET /api/gifts/:id
│   │   ├── searchRoutes.js    # GET /api/search
│   │   ├── authRoutes.js      # POST /api/auth/register|login, PUT /api/auth/update
│   │   └── commentsRoutes.js  # GET|POST /api/comments
│   ├── util/import-mongo/     # Seed script + gifts.json data
│   └── Dockerfile
├── giftlink-frontend/         # React app (port 3000 dev / 9000 prod)
│   ├── src/
│   │   ├── App.js
│   │   ├── context/AuthContext.js
│   │   ├── config.js
│   │   └── components/
│   │       ├── Navbar/
│   │       ├── MainPage/
│   │       ├── LoginPage/
│   │       ├── RegisterPage/
│   │       ├── DetailsPage/
│   │       ├── SearchPage/
│   │       └── Profile/
│   └── public/
│       ├── home.html          # Static landing page
│       └── static/home.css
├── sentiment/                 # NLP microservice (port 3001)
│   └── index.js
├── giftwebsite/               # Production frontend server (port 9000)
│   ├── index.js
│   └── Dockerfile
├── deploymongo.yml            # Kubernetes: MongoDB deployment
└── deployment.yml             # Kubernetes: Backend deployment
```

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017

### 1. Start MongoDB
```bash
# Using MongoDB locally
mongod --dbpath /data/db

# OR using Docker
docker run -d -p 27017:27017 --name mongodb mongo:6.0
```

### 2. Seed the database
```bash
cd giftlink-backend/util/import-mongo
cp .env.sample .env
# Edit .env: MONGO_URL=mongodb://localhost:27017
npm install
npm start
# Expected: Connected successfully to server / Inserted documents: 16
```

### 3. Start the backend
```bash
cd giftlink-backend
npm install
npm start
# Running on http://localhost:3060
```

### 4. Start the sentiment service (optional)
```bash
cd sentiment
npm install
npm start
# Running on http://localhost:3001
```

### 5. Start the frontend
```bash
cd giftlink-frontend
npm install
# Ensure .env has: REACT_APP_BACKEND_URL=http://localhost:3060
npm start
# Running on http://localhost:3000
```

### 6. View the landing page
Open: http://localhost:3000/home.html
Click **Get Started** to enter the main app.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/gifts | Fetch all gifts |
| GET | /api/gifts/:id | Fetch one gift by id |
| GET | /api/search | Search gifts (name, category, condition, age_years) |
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login, returns JWT |
| PUT | /api/auth/update | Update user name (requires email header + Bearer token) |
| GET | /api/comments/:giftId | Get comments for a gift |
| POST | /api/comments | Post a comment |
| POST | /sentiment (port 3001) | Analyze sentiment of a sentence |

## Test the Search API
```bash
curl "http://localhost:3060/api/search?name=&age_years=6&category=Office&condition=Older"
```

## Test Login
```bash
curl -X POST http://localhost:3060/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Production Build & Docker

### Build backend image
```bash
cd giftlink-backend
docker build -t us.icr.io/$MY_NAMESPACE/giftapp:latest .
docker push us.icr.io/$MY_NAMESPACE/giftapp:latest
```

### Build React app & frontend image
```bash
cd giftlink-frontend
npm run build   # builds + copies to giftwebsite/build/

cd ../giftwebsite
docker build -t us.icr.io/$MY_NAMESPACE/giftwebsite:latest .
docker push us.icr.io/$MY_NAMESPACE/giftwebsite:latest
```

### Deploy to Kubernetes
```bash
# Deploy MongoDB
kubectl apply -f deploymongo.yml

# Deploy backend (edit deployment.yml image name first)
kubectl apply -f deployment.yml

# Port-forward to test
kubectl port-forward deployment.apps/giftapp 3060:3060
```

### Deploy frontend to IBM Code Engine
```bash
ibmcloud ce application create \
  --name giftwebsite \
  --image us.icr.io/${SN_ICR_NAMESPACE}/giftwebsite \
  --registry-secret icr-secret \
  --port 9000
```

## Environment Variables

### Backend `.env`
```
MONGO_URL=mongodb://localhost:27017
JWT_SECRET=your_secret_key_here
PORT=3060
```

### Frontend `.env`
```
REACT_APP_BACKEND_URL=http://localhost:3060
```
