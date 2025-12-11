# Film Shoot Tracker - Setup Guide

Your Film Shoot Tracking App is ready to run! Here's what has been implemented:

## Features Implemented

### Authentication System
- User signup and login with email/password
- Secure authentication using Supabase Auth
- Profile management with user details

### Film Shoot Management
- Create new film shoot postings with:
  - Project information
  - Shoot details and schedule
  - Location information
  - Contact and transportation info
  - Crew type requirements
- View upcoming shoots in a feed
- Filter shoots by crew type needed
- Search shoots by description or project name
- Filter by location (city/state)

### User Profiles
- View and edit profile information
- Select multiple crew type skills/roles
- Display skills on profile

### Database
- Full Supabase database setup with:
  - Users table
  - Crew types (20+ pre-populated roles)
  - Film projects
  - Film shoots
  - User skills tracking
  - Row Level Security (RLS) policies

## Running the Application

### Development Mode

To start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

To build for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Usage

1. **Sign Up**: Create a new account with your email and basic information
2. **Set Up Profile**: Add your skills and crew types you can work as
3. **Browse Shoots**: View all upcoming film shoots in your area
4. **Filter & Search**: Use filters to find shoots looking for your skills
5. **Post a Shoot**: Create your own film shoot posting with all details
6. **Connect**: Use contact information to reach out about opportunities

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Custom CSS with modern design
- **Backend**: Supabase (PostgreSQL database)
- **Authentication**: Supabase Auth
- **Routing**: React Router

## Next Steps to Enhance

Consider adding these features in the future:
- Image upload for shoot postings
- Geolocation-based distance calculations
- Direct messaging between users
- Shoot response/interest tracking
- Past shoots archive view
- Advanced search with more filters
- Mobile responsive improvements
- Calendar view of shoots

Enjoy using your Film Shoot Tracker!
