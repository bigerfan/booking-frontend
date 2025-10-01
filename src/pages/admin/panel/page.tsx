import { Header } from "@/components/header/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { socket } from "@/lib/socket";
import type { session } from "@/types/reservation";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AdminPanel = () => {
  const [tables, setTables] = useState<{ tableId: number; count: number }[]>(
    []
  );
  const [sessions, setSessions] = useState<session[]>([]);

  // socket event handlers
  const handleConnect = useCallback(() => {
    console.log("connected to socket");
    socket.emit("join-overview");
  }, []);

  const handleTables = useCallback(
    (data: {
      tableRooms: { tableId: number; count: number; users: [] }[];
      todaySessions: session[];
    }) => {
      setTables(data.tableRooms);
      setSessions(data.todaySessions);
      // console.log("tables:", data);
    },
    []
  );

  useEffect(() => {
    socket.on("connect", handleConnect);
    socket.on("adminInfo", handleTables);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("adminInfo", handleTables);
    };
  }, [handleConnect, handleTables]);

  return (
    <div className="p-6 bg-transparent space-y-10">
      {/* Active tables */}
      <Header pageTitle="پنل ادمین" />
      <section>
        <h2 className="text-2xl font-bold mb-4">میزهای فعال</h2>
        {tables.length === 0 ? (
          <p className="text-gray-500">هیچ میزی فعال نیست</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tables.map(({ tableId, count }) => (
              <Link key={tableId} to={`/admin/table/${tableId}`}>
                <Button className="relative w-full h-20 rounded-xl shadow-lg">
                  <div className="text-lg">میز {tableId}</div>
                  <span className="absolute bottom-2 text-sm opacity-80">
                    {count} نفر در حال حاضر
                  </span>
                </Button>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Today's Sessions */}
      <section>
        <h2 className="text-2xl font-bold mb-4">جلسه‌های امروز</h2>
        {sessions.length === 0 ? (
          <p className="text-gray-500">امروز جلسه‌ای ثبت نشده</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((s, idx) => (
              <Card key={idx} className="shadow-md rounded-xl">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <div className="flex justify-between">
                      <span>{s.title ?? "جلسه بدون عنوان"}</span>
                      <p dir="ltr">
                        🕒{" "}
                        {new Date(s.started_time).toLocaleTimeString("fa-IR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {new Date(s.end_time).toLocaleTimeString("fa-IR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xl text-gray-900">
                  <p> میز {s.table_id}</p>

                  {s.invited_people && s.invited_people.length > 0 && (
                    <div className="mt-1">
                      <p className="font-semibold text-gray-700 text-lg mb-1">
                        دعوت‌شدگان:
                      </p>
                      <ul className="list-disc list-inside text-lg max-h-16 overflow-hidden">
                        {s.invited_people.slice(0, 5).map((p, i) => (
                          <li key={i}>{p.fullName}</li>
                        ))}
                        {s.invited_people.length > 5 && (
                          <li>و {s.invited_people.length - 5} نفر دیگر...</li>
                        )}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminPanel;
