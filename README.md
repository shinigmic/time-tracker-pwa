# 🕒 Personal Time Tracker (PWA)

Simple and convenient app to track daily activities and manage your time effectively.

---

## 🚀 Technology Stack

- **Frontend**: Vue 3, Pinia, Vite, Vuetify
- **Backend**: Node.js, Express.js, MongoDB Atla
- **Proxy/HTTPS**: Caddy
- **Containerization**: Docker & Docker Compose
- **Progressive Web App (PWA)** via VitePWA

---

## 🛠 Installation & Usage

### 🔧 Clone repository:

```bash
git clone <your-repo-url>
cd your-project
```

### ⚙️ Run with Docker Compose:

```bash
docker-compose up -d
```

> This will automatically launch:
>
> - Backend on port `3000` inside Docker
> - Caddy as a reverse proxy with HTTPS enabled for `https://localhost`

---

### 🌐 Access the application:

- **Frontend & Login Page**:  
  👉 `https://localhost`  
  ✅ No need to use any port. Caddy handles HTTPS and routing for you.

- **Backend (API endpoint via Caddy proxy)**:  
  👉 `https://localhost/api`

> If you try to open the backend directly at `http://localhost:3000`, it may be blocked by browser security due to CORS or mixed content. Always access through Caddy at `https://localhost`.

---

## 📦 Environment Variables

In the backend `.env` file (`./backend/.env`), add the following:

```env
# MongoDB connection URI
MONGODB_URI=mongodb://<your-db-uri>

# Random secret for JWT signing
JWT_KEY=change_this_to_a_random_secure_key
```

---

## 🚀 Features

- ⏱ Activity tracking with quick switch support
- 📊 Daily, weekly, and monthly reports
- 📱 Responsive mobile-first UI
- 📥 Installable as a PWA (Android/iOS)
- 🔐 Secure API via Caddy HTTPS proxy

---

## 📈 Future plans

- 🔔 Notifications integration
- 📊 Enhanced analytics and reporting
- 📤 Data export/import
- 📅 Calendar view with time blocks
