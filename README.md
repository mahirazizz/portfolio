# Mahir Aziz Portfolio

A responsive personal portfolio website built with HTML, CSS, and JavaScript. It showcases skills, experience, projects, and contact information in a modern dark/light themed layout.

## Features

- Modern glassmorphism-inspired UI
- Responsive layout for mobile and desktop
- Animated scroll reveal sections
- Theme toggle for light/dark mode
- Project filtering by technology
- Scroll progress indicator
- Contact form with MongoDB storage and Telegram notifications

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Node.js, Express, MongoDB, and Telegram Bot API

## Project Structure

```text
portfolio/
├── index.html
├── styles.css
├── script.js
├── server.js
├── api/index.js
├── vercel.json
└── README.md
```

## How to Run Locally

1. Run `npm install`.
2. Copy `.env.example` to `.env` and add your private MongoDB and Telegram values.
3. Run `npm start`.
4. Open `http://localhost:3000`.

## Deploy to Vercel

1. Import the GitHub repository `mahirazizz/portfolio` into Vercel.
2. Keep the project root as the repository root. No build command is required.
3. Add these Production Environment Variables in Vercel:
   - `MONGODB_URI`
   - `MONGODB_DB`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
4. Deploy and open the generated URL.

The contact form and API use the same deployed domain. Check `/api/health` after deployment.

## Customization

To personalize the portfolio:

- Update your name, title, and bio in `index.html`
- Modify colors, spacing, and layout in `styles.css`
- Update social links and project details in `index.html`
- Add your own resume/contact links in the CTA buttons and contact section

## Notes

Keep `.env` private and never commit real credentials. `.env` is ignored by Git.

## License

This project is for personal portfolio use.
