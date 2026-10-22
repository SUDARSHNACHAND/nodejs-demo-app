# 📌 Task 1: CI/CD Pipeline Automation (GitHub Actions + Docker)

Automated CI/CD pipeline built for **TaskPulse** — a React web application designed for personal daily task alerts and focus tracking. Every push to the `main` branch automatically tests, builds, and deploys the containerized application directly to **DockerHub**.

---

## 🎯 What I Did
- **Frontend App:** Built an interactive React application ("Personal DailyTask Alert") with custom Web Audio synthesized chimes, live countdown timers, and glowing priority alerts (`CRITICAL`, `HIGH`, `MEDIUM`).
- **Automated Testing:** Implemented automated unit tests with Vitest & React Testing Library (`npm test`). Tests run and pass before any build occurs.
- **Dockerization:** Packaged the application into a lightweight multi-stage `Dockerfile` (`node:22-alpine` ➔ `nginx:alpine`) with Gzip compression, SPA routing, and health checks.
- **CI/CD Pipeline:** Authored `.github/workflows/main.yml` with 4 automated stages triggered on pushes to `main`:
  1. **Test & Lint:** Validates code quality and runs unit tests in Node 20.
  2. **Build:** Compiles the production bundle and preserves build artifacts.
  3. **Docker Build & Push:** Authenticates via GitHub Secrets and pushes tagged images (`latest`, `commit-sha`) to DockerHub.
  4. **Deployment Status:** Generates a release report in GitHub Actions summary.

---

## 🛠️ Tech Stack
- **Frontend:** React 19, Vite, Vanilla CSS Glassmorphism, Lucide Icons
- **Testing:** Vitest, React Testing Library
- **DevOps & Containers:** Docker, Docker Compose, Nginx Alpine
- **CI/CD:** GitHub Actions, DockerHub Registry

---

## ⚡ Quick Start (Local Run)

### 1. Development Server
```bash
npm install
npm run dev
# App runs at: http://localhost:5173
```

### 2. Run Automated Unit Tests
```bash
npm test
```

### 3. Run with Docker
```bash
# Option A: Using Docker Compose
docker compose up --build

# Option B: Using Docker CLI
docker build -t personal-dailytask-alert .
docker run -d -p 8080:80 personal-dailytask-alert
# App runs at: http://localhost:8080 (Health check: http://localhost:8080/health)
```

---

## 🚀 GitHub Actions & DockerHub Deployment

1. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/<YOUR_USERNAME>/personal-dailytask-alert.git
   git push -u origin main
   ```

2. **Add GitHub Secrets** (`Settings` ➔ `Secrets and variables` ➔ `Actions`):
   - `DOCKERHUB_USERNAME`: Your DockerHub username
   - `DOCKERHUB_TOKEN`: DockerHub Personal Access Token (PAT)

3. **Pipeline Executes Automatically:**
   - Every push to `main` triggers: **Test ➔ Build ➔ Push to DockerHub ➔ Deploy Summary**.
   - Published container image: `docker.io/<DOCKERHUB_USERNAME>/personal-dailytask-alert:latest`.

---

## 📸 Screenshots & Evidence

Place your submission screenshots in the [`./screenshots/`](./screenshots/) folder using these file names:
- `screenshots/1_app_dashboard.png` — Main dashboard with live clock & task countdowns
- `screenshots/2_alert_modal.png` — Active alert popup & audio chime simulator
- `screenshots/3_github_actions_pipeline.png` — Passing 4-stage GitHub Actions workflow
- `screenshots/4_dockerhub_repository.png` — Published image repository on DockerHub
