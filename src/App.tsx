import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TablePage from "./pages/table/[id]";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import AdminPanel from "./pages/admin/panel/page";
import AdminTableView from "./pages/admin/table/[id]";

function Home() {
  const tables = [{ tableId: 1 }, { tableId: 2 }, { tableId: 3 }];

  // socket event handlers wrapped in useCallback (so cleanup works correctly)

  return (
    <div className="p-6 bg-transparent">
      <h2 className="text-2xl font-bold mb-4">انتخاب میز</h2>
      {tables.length === 0 ? (
        <p className="text-gray-500">هیچ میزی در دسترس نیست</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tables.map(({ tableId }: { tableId: number }) => (
            <Link key={tableId} to={`/table/${tableId}`}>
              <Button className="relative w-full h-20 rounded-xl shadow-lg">
                <div className="text-lg">میز {tableId}</div>
              </Button>
            </Link>
          ))}
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
          <Route path="/admin/panel" element={<AdminPanel />} />
          <Route path="/admin/table/:id" element={<AdminTableView />} />
        </Routes>
      </Router>
      <Toaster richColors />
    </>
  );
}
