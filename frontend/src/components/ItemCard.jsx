import { useState, useEffect } from "react";
import Countdown from "./CountDown";
import { clientId } from "../socket/socket";

export default function ItemCard({ item, serverTimeOffset, onBid }) {
  const [flashGreen, setFlashGreen] = useState(false);
  const [prevBid, setPrevBid] = useState(item.currentBid);
  const [wasWinning, setWasWinning] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  
  const isWinning = item.highestBidderClientId === clientId && item.status !== "ENDED";
  const isOutbid = wasWinning && !isWinning && item.status !== "ENDED";
  const isEnded = item.status === "ENDED" || timerExpired;
  const didWin = isEnded && item.highestBidderClientId === clientId;

  const handleTimerExpire = () => {
    setTimerExpired(true);
  };

  useEffect(() => {
    if (item.currentBid !== prevBid) {
      setFlashGreen(true);
      setPrevBid(item.currentBid);
      
      const timer = setTimeout(() => setFlashGreen(false), 500);
      return () => clearTimeout(timer);
    }
  }, [item.currentBid, prevBid]);

  useEffect(() => {
    if (isWinning) {
      setWasWinning(true);
    }
    if (isOutbid) {
      const timer = setTimeout(() => setWasWinning(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isWinning, isOutbid]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-5 relative">
     
        {!isEnded && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-red-600 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
            <span className="text-white text-xs font-semibold">LIVE</span>
          </div>
        )}

    
        <h3 className="text-lg font-bold text-gray-800 mb-3">{item.name}</h3>
        
       
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">Current Price</p>
          <div
            className={`text-3xl font-bold transition-all duration-300 ${
              flashGreen
                ? "text-green-500 scale-110"
                : isOutbid
                ? "text-red-600"
                : "text-gray-900"
            }`}
          >
            ${item.currentBid}
          </div>
        </div>

      
        <div className="mb-3 h-8 flex items-center">
          {didWin ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500 text-white rounded-full font-semibold text-sm">
              You Won!
            </div>
          ) : isEnded ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-400 text-white rounded-full font-semibold text-sm">
              Auction Ended
            </div>
          ) : isWinning ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500 text-white rounded-full font-semibold text-sm">
              Winning
            </div>
          ) : isOutbid ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white rounded-full font-semibold text-sm">
              Outbid
            </div>
          ) : null}
        </div>

      
        {!isEnded && (
          <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
            <p className="text-xs text-gray-500 mb-1 font-medium">
              TIME REMAINING
            </p>
            <Countdown
              auctionEndTime={item.auctionEndTime}
              serverTimeOffset={serverTimeOffset}
              status={item.status}
              onExpire={handleTimerExpire}
            />
          </div>
        )}

       
        {isEnded && (
          <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
            <p className="text-xs text-gray-500 mb-1 font-medium">
              FINAL PRICE
            </p>
            <p className="text-xl font-bold text-gray-900">
              ${item.currentBid}
            </p>
          </div>
        )}

       
        <button
          onClick={() => onBid(item)}
          disabled={isEnded}
          className={`w-full py-2.5 px-4 rounded-lg font-semibold transition-all ${
            isEnded
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow hover:shadow-md"
          }`}
        >
          {isEnded ? "Auction Ended" : "Bid +$10"}
        </button>
      </div>
    </div>
  );
}