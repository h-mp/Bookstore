/**
 * This module contains the options object for the session middleware.
 */

// Options object for the session middleware.
export const sessionOptions = {
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: false, // Resave even if a request is not changing the session.
  saveUninitialized: false, // Don't save a created but not modified session.
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: 'strict',
    httpOnly: true
  }
}

if (process.env.NODE_ENV === 'production') {
  sessionOptions.cookie.secure = true // serve secure cookies
}
