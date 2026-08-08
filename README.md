# BASECAMP — Adventure Activity Booking Website

College project for **BE05000281 – Web Application Development**, based on the faculty demo brief (Project style: multi-section site + CRUD via Local Storage).

## Folder structure
```
adventure-booking/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Features
- Home / hero section with trip-booking pitch
- Activities section: 6 adventure activities (trek, raft, paraglide, climb, camp, zip-line), each with difficulty badge, duration, altitude/grade, and price — filterable by difficulty
- "How it works" 3-step explainer
- Photo gallery
- Booking form: name, email, phone, activity, participants, date, notes — validated, saved to `localStorage`
- **My Bookings** panel: search + filter (All / Upcoming / Cancelled), cancel a booking — full CRUD pattern like the To-Do app demo, but for bookings
- Contact form (demo only)
- Dark/light mode toggle (bonus feature from brief)
- Fully responsive down to mobile, with a mobile nav menu

## Technologies used
- HTML5, CSS3 (custom properties, CSS Grid/Flexbox, no framework)
- Vanilla JavaScript (ES6), `localStorage` for persistence
- Google Fonts: Big Shoulders Display, Public Sans, JetBrains Mono

## How to run
Open `index.html` directly in a browser — no build step or server required.

## Possible enhancements (per brief's "Project Enhancement Ideas")
- Backend with Node.js/Express + MongoDB to persist bookings server-side
- User authentication (login/signup) for a personal booking history
- Payment gateway integration (Stripe/Razorpay)
- Admin dashboard to manage activities and view all bookings
- Email/SMS booking confirmations
