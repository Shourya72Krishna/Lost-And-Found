# Lost & Found Item Management System
### MERN Stack - B.Tech 4th Sem MSE-2 Project

---

## Project Structure
```
lost-found/
├── backend/
│   ├── models/
│   │   ├── User.js          ← MongoDB User Schema
│   │   └── Item.js          ← MongoDB Item Schema
│   ├── routes/
│   │   ├── authRoutes.js    ← POST /api/register, POST /api/login
│   │   └── itemRoutes.js    ← All Item APIs
│   ├── middleware/
│   │   └── authMiddleware.js ← JWT Authentication
│   ├── server.js            ← Express Server
│   ├── .env                 ← Environment Variables
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── pages/
        │   ├── Register.js  ← Registration Form
        │   ├── Login.js     ← Login Form
        │   └── Dashboard.js ← Main Dashboard (Add/View/Search/Edit/Delete)
        ├── api.js           ← Axios instance with JWT interceptor
        ├── App.js           ← Routes with Protected Route
        └── index.js
```

---

## Setup & Run

### Step 1: Backend Setup
```bash
cd backend
npm install
# Edit .env → set your MONGO_URI and JWT_SECRET
npm run dev
```

### Step 2: Frontend Setup
```bash
cd frontend
npm install
npm start
```

---

## API Endpoints

### Auth APIs
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/register | Register new user |
| POST | /api/login | Login & get JWT token |

### Item APIs (All Protected - require JWT token)
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/items | Add new item |
| GET | /api/items | View all items |
| GET | /api/items/:id | View item by ID |
| PUT | /api/items/:id | Update item |
| DELETE | /api/items/:id | Delete item |
| GET | /api/items/search?name=xyz | Search items |

---

## Technologies Used
- **MongoDB** - Database
- **Express.js** - Backend framework
- **React.js** - Frontend
- **Node.js** - Runtime
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT Authentication
- **axios** - HTTP requests
- **Bootstrap 5** - UI Styling
