import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TablePage from "./pages/tables/[id]";
import { Button } from "./components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { socket } from "./lib/socket";
import { Toaster } from "./components/ui/sonner";

function Home() {
  const [tables, setTables] = useState<{ tableId: number; count: number }[]>(
    []
  );

  // socket event handlers wrapped in useCallback (so cleanup works correctly)
  const handleConnect = useCallback(() => {
    console.log("connected to socket");
    socket.emit("join_overview");
  }, []);

  const handleTables = useCallback(
    (tables: { tableId: number; count: number; users: [] }[]) => {
      setTables(tables);
      console.log("tables:", tables);
    },
    []
  );

  useEffect(() => {
    // Register handlers
    socket.on("connect", handleConnect);
    socket.on("tables", handleTables);

    // If already connected (page reload case), immediately join
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      // Cleanup listeners
      socket.off("connect", handleConnect);
      socket.off("tables", handleTables);
    };
  }, [handleConnect, handleTables]);

  return (
    <div className="p-6 bg-transparent">
      <h2 className="text-2xl font-bold mb-4">انتخاب میز</h2>
      {tables.length === 0 ? (
        <p className="text-gray-500">هیچ میزی در دسترس نیست</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tables.map(
            ({ tableId, count }: { tableId: number; count: number }) => (
              <Link key={tableId} to={`/table/${tableId}`}>
                <Button className="relative w-full h-20 rounded-xl shadow-lg">
                  <div className="text-lg">میز {tableId}</div>
                  <span className="absolute bottom-2 text-sm opacity-80">
                    {count} نفر در حال حاضر
                  </span>
                </Button>
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/table/:id" element={<TablePage />} />
        </Routes>
      </Router>
      <Toaster richColors />
    </>
  );
}
