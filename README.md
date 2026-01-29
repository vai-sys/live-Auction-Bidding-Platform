
# Live Auction Bidding Platform

A real-time auction system where multiple users can bid on items in the final seconds of an auction.  
Built with Node.js, Socket.IO, Redis, MongoDB, and React.

## Features

- Real-time bidding with Socket.IO
- Concurrency-safe bid handling (race condition protected)
- Server-synced countdown timers (not client controlled)
- Instant UI feedback for new bids (winning/outbid states)
- Automatic seeding of demo auction items on server start
- Docker support for easy backend setup
- Deployed frontend and backend for live demo

## Tech Stack

- Backend: Node.js, Express, Socket.IO, MongoDB, Redis
- Frontend: React
- Infra: Docker, Render (backend), Vercel (frontend)

## API

### `GET /items`
Returns all auction items with:
- title
- startingPrice
- currentBid
- auctionEndTime

### Socket Events

- `BID_PLACED` → client sends a bid  
- `UPDATE_BID` → server broadcasts latest highest bid  
- Outbid/validation errors returned instantly to the bidder

## Race Condition Handling

Bids are validated atomically using Redis so if two equal bids arrive at the same time:
- first valid bid is accepted
- second bidder receives an immediate “OUTBID” response

## Server Time Sync

Clients sync with server time to render countdown timers, preventing client-side timer tampering.

## Run Locally (Backend)

```bash
# install deps
npm install

# start server
npm start
