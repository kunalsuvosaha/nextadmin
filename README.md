# NextAdmin

NextAdmin is a Next.js App Router admin dashboard and CMS for managing jobs, homepage sliders, and media assets. It uses MongoDB with Mongoose, Cloudinary for image/video storage, and JWT authentication for protected admin access.

## Features

### Admin Panel

- JWT-based admin authentication with HTTP-only cookies.
- Admin registration with a company passkey.
- Admin profile dropdown with name, email, and role.
- Protected admin pages and admin APIs.
- Slider management with image upload, status toggle, delete, and bulk delete.
- Media gallery for images and videos with Cloudinary upload support.
- Job management with create, edit, view, delete, status toggle, and bulk delete.
- Active navigation highlighting.
- Loading spinner during admin navigation.
- Responsive admin layout.

### Public Site

- Public homepage.
- Dynamic homepage slider from active slider records.
- CSS Modules styling.

## Tech Stack

- Next.js 16 App Router
- React 19
- MongoDB Atlas
- Mongoose
- Cloudinary
- JWT with `jose`
- Password hashing with `bcrypt`
- CSS Modules

## Environment Variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority

JWT_SECRET=replace-with-a-long-random-secret
ADMIN_CREATION_KEY=123

CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Notes:

- `JWT_SECRET` must stay server-only. Do not prefix it with `NEXT_PUBLIC_`.
- `ADMIN_CREATION_KEY` is required for `/admin/register`.
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is used where the client needs the Cloudinary cloud name.
- On Vercel, add the same variables in Project Settings, then redeploy.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open:

- Public site: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`
- Admin register: `http://localhost:3000/admin/register`

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Admin Auth Flow

1. Register an admin at `/admin/register`.
2. Registration sends `name`, `email`, `password`, and `passkey` to `/api/auth/register`.
3. The API checks `passkey` against `ADMIN_CREATION_KEY`.
4. Passwords are hashed with `bcrypt` before saving.
5. Login at `/admin/login` sends email and password to `/api/auth/login`.
6. The API verifies the password and signs a JWT payload:

```js
{
  id,
  role: 'admin'
}
```

7. The JWT is stored in an HTTP-only cookie named `admin_token`.
8. `src/middleware.js` verifies the cookie before allowing `/admin/*` and `/api/admin/*`.
9. Logout calls `/api/admin/logout` and clears the auth cookie.

## Main Routes

### Admin Pages

- `/admin/login`
- `/admin/register`
- `/admin/slider`
- `/admin/jobs`
- `/admin/media`

### Auth APIs

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/admin/logout`

### Admin APIs

- `/api/admin/sliders`
- `/api/admin/jobs`
- `/api/admin/media`

## Project Structure

```text
src/
  app/
    admin/
      jobs/
      login/
      media/
      register/
      slider/
      layout.js
      loading.js
    api/
      admin/
      auth/
      public/
    page.js
  lib/
    auth.js
    cloudinary.js
    mongodb.js
  models/
    Admin.js
    Job.js
    Media.js
    Slider.js
  middleware.js
```

## Vercel Deployment

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add all required environment variables in Vercel Project Settings.
4. Redeploy after adding or changing environment variables.

Required Vercel variables:

```env
MONGODB_URI
JWT_SECRET
ADMIN_CREATION_KEY
CLOUDINARY_CLOUD_NAME
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

If MongoDB works locally but not on Vercel, check MongoDB Atlas Network Access. Vercel does not use your home IP address, so Atlas must allow the deployment to connect.

## Notes

- The admin panel uses JWT auth, not a plain session flag.
- Passwords are never stored as plain text.
- Admin-only APIs are protected by middleware.
- Next.js may warn that the `middleware` file convention is moving toward `proxy`; the current middleware still works for this project.
