import React, { useState, useEffect } from "react";
import { systemLogAPI } from "../../api";
import { AlertCircle, Info, AlertTriangle } from "lucide-react";

export default function SystemLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await systemLogAPI.getSystemLogs();
        if (data.success) {
          setLogs(data.logs);
        }
      } catch (error) {
        console.error("시스템 로그 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const getLevelIcon = (level) => {
    switch (level) {
      case "ERROR": return <AlertCircle className="text-red-500" size={18} />;
      case "WARN": return <AlertTriangle className="text-yellow-500" size={18} />;
      default: return <Info className="text-blue-500" size={18} />;
    }
  };

  if (loading) return <div className="p-8">로딩 중...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">시스템 에러 로그</h1>
        <p className="text-slate-500 mt-1">서버에서 발생한 최근 에러 내역을 추적합니다.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
            <tr>
              <th className="px-4 py-3 font-semibold w-16">레벨</th>
              <th className="px-4 py-3 font-semibold w-40">발생 시각</th>
              <th className="px-4 py-3 font-semibold w-40">라우트</th>
              <th className="px-4 py-3 font-semibold">메시지</th>
              <th className="px-4 py-3 font-semibold w-24">사용자ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {logs.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                  기록된 로그가 없습니다.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-4 py-3 flex items-center justify-center">
                    {getLevelIcon(log.level)}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-indigo-600 truncate max-w-[150px]" title={log.route}>
                    {log.route || "-"}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    <div className="truncate max-w-md" title={log.message}>
                      {log.message}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-center">
                    {log.userId || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
