1. Project Title
SabhaVerse – Digital Sabha for Indian Knowledge Systems

2. Problem Statement
Students and enthusiasts of Indian Knowledge Systems (IKS) lack a centralized platform to share ideas, discuss topics, and engage in structured debates. Existing social media platforms are generic and don’t support meaningful discussions or role-based debates.
SabhaVerse aims to solve this by providing a digital sabha where users can post insights, participate in threaded debates, reply as proponents or opponents, and explore topics across categories like Indian history, Ayurveda, Music, and Philosophy. This creates a collaborative, interactive, and organized space for learning and discussion.


3. System Architecture
Frontend (React.js + React Router)  →  Backend (Node.js + Express + Prisma ORM) → Database (MySQL)  Authentication handled via JWT.
Frontend: React.js with React Router for navigation.
Backend: Node.js with Express.js and Prisma ORM
Database: MySQL 
Authentication: JWT-based secure authentication


Hosting:
Frontend → Vercel


Backend → Render / Railway


Database → MySQL


4. Key Features
Category
Features
Authentication & Authorization
User registration, login, logout via JWT.
CRUD Operations
Create, read, update, and delete posts, debates, and comments. Supports nested comments for threaded debates.
Frontend Routing
Pages: Home Feed, Post Details, Debate Thread, Category Feed, Profile, Login/Signup
Debate Threads
Participate in structured debates; reply as Proponent, Opponent, or Neutral.
Filtering & Sorting
Filter posts by category, search by keyword, sort by newest, most upvoted, or most popular.
Pagination
Load posts and comments incrementally for better performance.
Hosting
Frontend → Vercel; Backend → Render/Railway; Database → MySQL






5. Tech Stack
Layer
Technologies
Frontend
React.js, React Router, Axios, Bootstrap / plain CSS
Backend
Node.js, Express.js, Prisma ORM
Database
MySQL (relational, Prisma-managed)
Authentication
JWT (signup/login)
Hosting
Frontend → Vercel
Backend → Render / Railway
Database → MySQL 


6. API Overview
List a few sample APIs you plan to implement.


Endpoint
Method
Description
/api/auth/signup
POST
Register a new user using JWT authentication
/api/auth/login
POST
Authenticate user via issue JWT token
/api/auth/logout
POST
Logout user
/api/posts
GET
Fetch all posts with pagination, filtering, and sorting
/api/posts
POST
Create a new post (authenticated)
/api/posts/:id
PUT
Update a post (owner only)
/api/posts/:id
DELETE
Delete a post (owner/moderator only)
/api/comments
POST
Add a comment or reply to a post/debate
/api/comments/:postId
GET
Get all comments for a post (nested/threaded)
/api/debates
POST
Create a new debate (authenticated)
/api/debates/:id/comments
GET
Get all comments for a debate
/api/debates/:id/comments
POST
Add a comment to a debate with role tag (Proponent/Opponent/Neutral)


