# Mailchimp & GetResponse Integration API

A Node.js (Express + Mongoose) REST API that enables users to securely connect to and retrieve data from their **Mailchimp** and **GetResponse** accounts. Built with ES6 modules, encrypted API key storage, and clean error handling.

---

## 🚀 Features

- Save and validate ESP (Email Service Provider) API credentials
- Securely **encrypt API keys** in MongoDB
- Verify connection to Mailchimp or GetResponse
- Retrieve all lists/audiences from connected accounts
- Centralized error handling with proper HTTP codes

---

## 📦 Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- AES-256 encryption (for API keys)
- Mailchimp & GetResponse API integrations

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/khalid225/esp-integration.git
cd mail-esp-integration
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set environment variables

Create a `.env` file in the root folder with:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/mail-esp-integration
ENCRYPTION_KEY=your-32-byte-secret-key-here
```

### 4. Run the server

```bash
npm run dev   # with nodemon
# or
npm start
```

API will be available at `http://localhost:3000`

---

## 📌 API Endpoints

### Save & Validate Integration

```http
POST /api/integrations/esp
```

**Body:**

```json
{
	"provider": "mailchimp", // or "getresponse"
	"apiKey": "api-key",
	"owner": "khalid"
}
```

**Response:**

```json
{
  "success": true,
  "integration": { ... }
}
```

---

### Get Lists

```http
GET /api/integrations/esp/lists/:id
```

**Response:**

```json
{
  "success": true,
  "provider": "mailchimp",
  "lists": [ ... ]
}
```

---

## 🗄️ Database Schema

Database Schema Overview:

Integration Collection:

- userId: String (required)
- provider: String (enum: mailchimp, getresponse)
- owner: Sring
- apiKey: String (required)
- meta: Object
- validated: Boolean
- lastValidatedAt: Date
- isActive: Boolean
- createdAt: Date

```js
{
  provider: "mailchimp" | "getresponse",
  apiKey: "<encrypted>",
  owner: "khalid",
  meta: { dc: "us20" },
  validated: true,
  lastValidatedAt: Date,
  isActive: true,
  createdAt: Date
}
```

---

## 🛡️ Security

- API keys are stored **encrypted with AES-256**
- Keys are decrypted only when making API calls
- Never exposed in API responses

---

## 📖 Scripts

```bash
npm start     # Run server
npm run dev   # Run with nodemon (hot reload)
```

---
