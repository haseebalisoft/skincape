# 🌿 SkinScape PK - Luxury Aesthetic Dermatology Clinic Website

A top 1% globally designed, emotionally calming, and medically trustworthy website for SkinScape PK, Pakistan's premier aesthetic dermatology clinic.

![SkinScape PK](public/logo.png)

## ✨ Features

### 🎨 **Premium Design**
- **Luxury Aesthetic**: Sage green color palette with gold accents
- **Glassmorphism UI**: Modern, translucent design elements
- **Smooth Animations**: Framer Motion for buttery-smooth interactions
- **Responsive Design**: Mobile-first approach, perfect on all devices
- **Custom Typography**: Playfair Display (headings) + Inter (body)

### 🏥 **Core Functionality**
- **Hero Section**: Animated headline with floating trust badges
- **Services Showcase**: 8 treatments with detailed modal information
- **Before/After Gallery**: Interactive slider with patient results
- **Doctor Story**: Trust-building narrative section
- **Appointment Booking**: Real-time slot availability checking
- **Testimonials**: Auto-scrolling patient reviews
- **WhatsApp Integration**: Floating contact button

### 🔒 **Security & Trust**
- HTTPS ready
- Input validation
- Rate limiting
- Medical disclaimers
- Privacy-first approach
- JWT authentication for admin

### 🛠️ **Tech Stack**

#### Frontend
- **React 19** with Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Query** for data management
- **Lucide React** for icons
- **React Router** for navigation

#### Backend
- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** authentication
- **Helmet** for security
- **Express Rate Limit**
- **Bcrypt** for password hashing

## 📁 Project Structure

```
skinscapepk/
├── src/                          # Frontend source
│   ├── components/               # React components
│   │   ├── Hero.jsx             # Hero section with animations
│   │   ├── TrustIndicators.jsx  # Trust badges
│   │   ├── Services.jsx         # Treatment cards with modals
│   │   ├── BeforeAfter.jsx      # Image slider
│   │   ├── DoctorStory.jsx      # About section
│   │   ├── Appointment.jsx      # Booking form
│   │   ├── Testimonials.jsx     # Patient reviews
│   │   ├── Footer.jsx           # Footer with contact info
│   │   └── WhatsAppFloat.jsx    # Floating WhatsApp button
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles + Tailwind
├── backend/                      # Backend API
│   ├── models/                  # MongoDB models
│   │   ├── Appointment.js       # Appointment schema
│   │   ├── Service.js           # Service schema
│   │   ├── Testimonial.js       # Testimonial schema
│   │   └── User.js              # Admin user schema
│   ├── routes/                  # API routes
│   │   ├── appointments.js      # Appointment endpoints
│   │   ├── services.js          # Service endpoints
│   │   ├── testimonials.js      # Testimonial endpoints
│   │   └── auth.js              # Authentication endpoints
│   ├── server.js                # Express server
│   ├── package.json             # Backend dependencies
│   └── .env.example             # Environment variables template
├── public/                       # Static assets
│   └── logo.png                 # SkinScape logo
├── package.json                  # Frontend dependencies
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd skinscapepk
```

2. **Install Frontend Dependencies**
```bash
npm install --legacy-peer-deps
```

3. **Install Backend Dependencies**
```bash
cd backend
npm install
```

4. **Setup Environment Variables**
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### Running the Application

#### Development Mode

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

#### Production Build

**Frontend:**
```bash
npm run build
npm run preview
```

**Backend:**
```bash
cd backend
npm start
```

## 🎨 Design System

### Color Palette
```css
Sage Green:    #9DB5B2  /* Primary brand color */
Forest Green:  #1F3D36  /* Text and accents */
Off-White:     #FAFAF8  /* Background */
Warm Gray:     #E6E8E7  /* Borders and subtle elements */
Accent Gold:   #C9B37E  /* Premium highlights */
```

### Typography
- **Headings**: Playfair Display (Serif)
- **Body**: Inter (Sans-serif)
- **Line Height**: 1.7 (airy, breathable)

### Components
- **Border Radius**: 12px (luxury) / 16px (cards)
- **Shadows**: Soft, subtle depth
- **Animations**: 0.3-0.8s ease-out transitions

## 📡 API Endpoints

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - Get all appointments (Admin)
- `GET /api/appointments/available-slots?date=YYYY-MM-DD` - Check availability
- `PATCH /api/appointments/:id` - Update appointment (Admin)

### Services
- `GET /api/services` - Get all active services
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create service (Admin)
- `PATCH /api/services/:id` - Update service (Admin)

### Testimonials
- `GET /api/testimonials` - Get approved testimonials
- `POST /api/testimonials` - Submit testimonial
- `PATCH /api/testimonials/:id` - Update testimonial (Admin)

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Register admin (should be protected)

## 🔐 Security Features

- **Helmet.js**: Security headers
- **Rate Limiting**: Prevents abuse
- **Input Validation**: Express-validator
- **Password Hashing**: Bcrypt
- **JWT Tokens**: Secure authentication
- **CORS**: Configured for frontend domain

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎯 Key UX Principles

1. **No Clutter**: Generous white space
2. **Soft Shadows**: Subtle depth
3. **Rounded Cards**: 12-16px border radius
4. **Gentle Animations**: Smooth, non-jarring
5. **Trust First**: Medical disclaimers everywhere
6. **Privacy**: "Your privacy matters. Always."

## 📞 Contact Configuration

Update these in the code:
- **Phone**: Search for `+923001234567` and replace
- **Email**: Search for `info@skinscapepk.com` and replace
- **WhatsApp**: Update in `WhatsAppFloat.jsx` and `Appointment.jsx`
- **Address**: Update in `Footer.jsx`
- **Google Maps**: Add iframe in `Footer.jsx`

## 🖼️ Adding Real Content

### Before/After Images
1. Add images to `public/before-after/`
2. Update `BeforeAfter.jsx` with image paths

### Doctor Photo
1. Add photo to `public/team/`
2. Update `DoctorStory.jsx` with image path

### Service Icons
Icons are from Lucide React. Update in `Services.jsx`

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the 'dist' folder
```

### Backend (Heroku/Railway/DigitalOcean)
```bash
cd backend
# Set environment variables
# Deploy with your platform's CLI
```

### Database (MongoDB Atlas)
1. Create cluster at mongodb.com
2. Update `MONGODB_URI` in backend `.env`

## 📊 Admin Dashboard (Future Enhancement)

Planned features:
- View/manage appointments
- Approve testimonials
- Update services
- Upload before/after images
- Analytics dashboard

## 🤝 Contributing

This is a client project. For modifications, please contact the development team.

## 📄 License

Proprietary - SkinScape PK © 2026

## 💡 Support

For technical support or inquiries:
- **Email**: dev@skinscapepk.com
- **Phone**: +92 300 1234567

---

**Built with ❤️ for SkinScape PK**

*Where Skin Science Meets Timeless Beauty*
