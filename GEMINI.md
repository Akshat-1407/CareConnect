# GEMINI.md

Before making significant changes, read `README.md` and treat it as the single source of truth for the MVP.

## Development Rules

- Keep the project simple and focused on the MVP only.
- Do not add features that are not required in `README.md`.
- Use Next.js App Router, React with JavaScript/JSX, Tailwind CSS, and shadcn/ui for the frontend.
- Use Django, Django REST Framework, Django Channels, and MySQL for the backend.
- Use JWT authentication with `djangorestframework-simplejwt`.
- Store JWT access and refresh tokens in HttpOnly cookies, not `localStorage` or `sessionStorage`.
- Use Django as the only backend. Do not add a Node.js backend.
- Use WebRTC for video/audio and Django Channels WebSockets only for signaling.
- Keep the admin login hidden from normal public navigation, but always enforce admin authorization on the backend.
- Keep React code modular. Avoid large `page.jsx` files and monolithic components.
- Keep API calls in `services/`, authentication state in `context/`, and WebRTC/WebSocket logic in hooks or `lib/`.
- The UI should look modern, polished, responsive, and visually appealing. Use good spacing, typography, cards, icons, hover states, loading states, subtle animations, and smooth interactions so the app feels dynamic without becoming flashy or over-engineered.
- Maintain a consistent healthcare-oriented design across patient, doctor, and admin portals.
- Do not add Redis, Docker, notifications, chat, analytics, AI features, refunds, invoices, or other non-MVP features unless explicitly requested.
- Test the application after making changes and fix errors, but do not create automated test files unless explicitly requested.
- Do not change the architecture or add dependencies unnecessarily.
- If your implementation changes an important project decision, update `README.md` accordingly.

When given a phase-specific prompt, implement only that phase and avoid starting future phases unless explicitly asked.