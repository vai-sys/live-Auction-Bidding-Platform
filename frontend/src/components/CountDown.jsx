import { useEffect, useState } from "react";

export default function Countdown({
  auctionEndTime,
  serverTimeOffset,
  status,
  onExpire,
}) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (status === "ENDED") {
      setRemaining(0);
      return;
    }

    const end = new Date(auctionEndTime).getTime();

    const tick = () => {
      const now = Date.now() + serverTimeOffset;
      const diff = Math.max(0, end - now);

      setRemaining(diff);

      if (diff === 0 && onExpire) {
        onExpire();
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [auctionEndTime, serverTimeOffset, status]);

  if (status === "ENDED") {
    return <div className="text-red-600 font-semibold">Auction Ended</div>;
  }

  const s = Math.floor(remaining / 1000);
  return (
    <div className="font-mono font-bold">
      {Math.floor(s / 60)}:{String(s % 60).padStart(2, "0")}
    </div>
  );
}
