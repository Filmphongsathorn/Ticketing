# Concert Ticket Booking — Frontend Structure

```
src/
├── api/
│   └── api.js                  # Axios instance w/ JWT interceptor
├── components/
│   ├── ConcertList/
│   │   ├── ConcertList.jsx     # Grid of concert cards (GET /api/events)
│   │   ├── ConcertCard.jsx     # Individual event card
│   │   └── ConcertList.css     # Spotlight & shimmer animations
│   ├── Checkout/
│   │   ├── Checkout.jsx        # Order form (POST /api/orders)
│   │   └── Checkout.css        # Form animations
│   └── ui/
│       ├── Spinner.jsx         # Loading indicator
│       ├── ErrorBanner.jsx     # Unified error display
│       └── Toast.jsx           # Success/error toast
├── context/
│   └── AuthContext.jsx         # JWT token + user state
├── hooks/
│   └── useAuth.js              # Convenience hook
├── pages/
│   ├── EventsPage.jsx          # ConcertList page
│   └── CheckoutPage.jsx        # Checkout page
├── App.jsx
├── main.jsx
└── index.css                   # Global theme, CSS variables
```
