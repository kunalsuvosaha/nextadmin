# NextAdmin - Professional Admin Dashboard & CMS

NextAdmin is a modern, responsive, and robust Content Management System (CMS) built with **Next.js 15**, **MongoDB**, and **Cloudinary**. It features a comprehensive Admin Panel for managing Job listings, Media assets, and Homepage Sliders, coupled with a high-performance public-facing landing page.

![NextAdmin](/public/next.svg)

## 🚀 Key Features

### 🛡️ Admin Panel
- **Dashboard**: Centralized management interface.
- **Job Management**: Create, edit, delete, and toggle status of job postings.
- **Media Library**: 
  - Unified gallery for Images and Videos.
  - **Cloudinary Integration** for optimized media storage and delivery.
  - Bulk delete capabilities.
- **Slider Management**: customize the homepage hero slider with active/inactive toggles.
- **Mobile Responsive**: Fully optimized layout for mobile administration on the go.

### 🌐 Public Frontend
- **Dynamic Hero Slider**: Fetches real-time active sliders from the backend.
- **Modern UI**: Clean, responsive design using CSS Modules.
- **Optimized Performance**: Server-side rendering and dynamic content delivery.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) (Mongoose ODM)
- **Starage**: [Cloudinary](https://cloudinary.com/) (Image & Video CDN)
- **Styling**: Vanilla CSS Modules (Responsive Design)
- **Language**: JavaScript (ES6+)

---

## ⚙️ Prerequisites

Before running the project, ensure you have the following environment variables set up in a `.env.local` file:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/nextadmin

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 📦 Installation & Running

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/nextadmin.git
   cd nextadmin
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Access the Application**:
   - **Public Home**: [http://localhost:3000](http://localhost:3000)
   - **Admin Panel**: [http://localhost:3000/admin/slider](http://localhost:3000/admin/slider)

---

## 🚀 Deployment (Vercel)

This project is optimized for deployment on [Vercel](https://vercel.com).

1. Push your code to a GitHub repository.
2. Import the project in Vercel.
3. Add the **Environment Variables** (MONGODB, CLOUDINARY) in the Vercel Project Settings.
4. Deploy!

> **Note:** The homepage (`src/app/page.js`) is configured with `export const dynamic = 'force-dynamic'` to ensure fresh content is served on every request, avoiding static build errors with database connections.

---

## 📂 Project Structure

```
src/
├── app/
│   ├── admin/          # Admin Panel Routes
│   │   ├── jobs/       # Job Management
│   │   ├── media/      # Media Gallery
│   │   └── slider/     # Slider Config
│   ├── api/            # Backend API Routes
│   └── page.js         # Public Homepage
├── lib/
│   ├── db.js           # Database Utilities
│   ├── mongodb.js      # MongoDB Connection
│   └── cloudinary.js   # Cloudinary Config
├── models/             # Mongoose Schemas (Job, Media, Slider)
└── styles/             # CSS Modules
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is licensed under the MIT License. kunal
