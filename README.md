# Resumio Server - Backend API

[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.19.1-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Google AI](https://img.shields.io/badge/Google_Gemini-AI-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![ImageKit](https://img.shields.io/badge/ImageKit-Image_Storage-FF6B6B)](https://imagekit.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Backend REST API for Resumio - an AI-powered online resume builder with intelligent optimization and image processing capabilities.

## Features

- **User Authentication** - JWT-based secure authentication with bcrypt password hashing
- **Resume CRUD Operations** - Create, read, update, and delete resumes
- **AI Integration** - Google Gemini AI for resume content optimization
- **Image Processing** - ImageKit integration for profile image uploads and background removal
- **Public Resume Sharing** - Generate shareable public resume links
- **PDF Processing** - Extract text from uploaded PDF resumes
- **Secure Endpoints** - Protected routes with JWT middleware

## Tech Stack

- **Node.js** - JavaScript runtime environment
- **Express 5.1.0** - Fast, minimalist web framework
- **MongoDB 8.19.1** - NoSQL database with Mongoose ODM
- **JWT 9.0.2** - JSON Web Tokens for authentication
- **Bcrypt 6.0.0** - Password hashing and encryption
- **Google Gemini AI 1.40.0** - AI-powered content enhancement
- **ImageKit 7.1.1** - Image upload and processing
- **Multer 2.0.2** - Multipart/form-data file upload handling
- **CORS 2.8.5** - Cross-Origin Resource Sharing
- **Nodemon 3.1.10** - Development auto-restart utility

## API Endpoints

### User Routes (`/api/users`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /data` - Get authenticated user data (protected)
- `GET /resumes` - Get all user resumes (protected)

### Resume Routes (`/api/resumes`)
- `POST /create` - Create new resume (protected)
- `PUT /update` - Update resume with image upload (protected)
- `DELETE /delete/:resumeId` - Delete resume (protected)
- `GET /get/:resumeId` - Get resume by ID (protected)
- `GET /public/:resumeId` - Get public resume (no auth required)

### AI Routes (`/api/ai`)
- `POST /enhance-pro-sum` - Enhance professional summary (protected)
- `POST /enhance-job-desc` - Enhance job description (protected)
- `POST /upload-resume` - Upload and parse PDF resume (protected)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB instance (local or Atlas)
- Google Gemini API key
- ImageKit account credentials

### Installation

1. Clone the repository
```bash
git clone https://github.com/JOSIAHTHEPROGRAMMER/Resumio-server.git
cd Resumio-server
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory:
```env
PORT=3000
JWT_SECRET=your_jwt_secret_key
MONGODB_URI=your_mongodb_connection_string

IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-pro
```

4. Start the development server
```bash
npm run dev
```

The server will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with nodemon (auto-restart)
- `npm start` - Start production server

## Project Structure

```
Resumio-server/
├── configs/
│   ├── ai.js              # Google Gemini AI configuration
│   ├── db.js              # MongoDB connection setup
│   ├── imageKit.js        # ImageKit configuration
│   └── multer.js          # Multer file upload configuration
├── controllers/
│   ├── aiController.js    # AI enhancement logic
│   ├── ResumeController.js # Resume CRUD operations
│   └── userController.js  # User authentication logic
├── middlewares/
│   └── authMiddleware.js  # JWT authentication middleware
├── models/
│   ├── Resume.js          # Resume schema and model
│   └── User.js            # User schema and model
├── routes/
│   ├── aiRoute.js         # AI endpoints
│   ├── resumeRoutes.js    # Resume endpoints
│   └── userRoutes.js      # User endpoints
├── .gitignore
├── package.json
├── server.js              # Main application entry point
└── vercel.json            # Vercel deployment configuration
```

## Data Models

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  timestamps: true
}
```

### Resume Schema
```javascript
{
  userId: ObjectId,
  title: String,
  public: Boolean,
  template: String,
  accent_color: String,
  professional_summary: String,
  skills: [String],
  personal_info: {
    image, full_name, profession, email, 
    phone, location, linkedin, website
  },
  experience: [{
    company, position, start_date, 
    end_date, description, is_current
  }],
  project: [{
    name, type, description
  }],
  education: [{
    institution, degree, field, 
    graduation_date, gpa
  }],
  timestamps: true
}
```

## Security Features

- **Password Hashing** - Bcrypt encryption for secure password storage
- **JWT Authentication** - Stateless authentication with JSON Web Tokens
- **Protected Routes** - Middleware-based route protection
- **CORS Configuration** - Controlled cross-origin access
- **Environment Variables** - Sensitive data stored securely

## Deployment

The application is configured for deployment on Vercel. Ensure all environment variables are set in your deployment platform.

```bash
# Build for production
npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Related Projects

- [Resumio Client](https://github.com/JOSIAHTHEPROGRAMMER/Resumio) - Frontend React application

## Acknowledgments

- Google Gemini AI for intelligent content optimization
- ImageKit for seamless image processing
- MongoDB for flexible data storage
- All open-source contributors

## Support

If you find this project helpful, please give it a star on [GitHub](https://github.com/JOSIAHTHEPROGRAMMER/Resumio-server)!
