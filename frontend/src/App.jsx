import { useEffect, useState } from "react";
import { fetchItems, getServerTime } from "./api/items";
import { socket } from "./socket/socket";
import ItemCard from "./components/ItemCard";

export default function App() {
  const [items, setItems] = useState([]);
  const [serverTimeOffset, setServerTimeOffset] = useState(0);

  
  useEffect(() => {
    getServerTime().then((serverTime) => {
      setServerTimeOffset(serverTime - Date.now());
    });
  }, []);


  useEffect(() => {
    fetchItems().then(setItems);
  }, []);


  useEffect(() => {
    socket.on("UPDATE_BID", (data) => {
      setItems((prev) =>
        prev.map((item) =>
          item._id === data.itemId
            ? {
                ...item,
                currentBid: data.currentBid,
                highestBidderClientId: data.highestBidderClientId,
              }
            : item
        )
      );
    });

    socket.on("AUCTION_ENDED", (data) => {
      setItems((prev) =>
        prev.map((item) =>
          item._id === data.itemId
            ? {
                ...item,
                status: "ENDED",
                currentBid: data.finalBid,
                highestBidderClientId: data.winnerClientId,
              }
            : item
        )
      );
    });

    socket.on("BID_REJECTED", ({ reason, itemId }) => {
      if (reason === "ENDED") {
        setItems((prev) =>
          prev.map((item) =>
            item._id === itemId
              ? { ...item, status: "ENDED" }
              : item
          )
        );
      }
    });

    return () => {
      socket.off("UPDATE_BID");
      socket.off("AUCTION_ENDED");
      socket.off("BID_REJECTED");
    };
  }, []);

  const placeBid = (item) => {
    if (item.status === "ENDED") return;

    socket.emit("BID_PLACED", {
      itemId: item._id,
      bidAmount: item.currentBid + 10,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Live Auction Platform
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <ItemCard
            key={item._id}
            item={item}
            serverTimeOffset={serverTimeOffset}
            onBid={placeBid}
          />
        ))}
      </div>
    </div>
  );
}
