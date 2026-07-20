import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { DANCE_STYLES } from '@/types';
import { TrendingUp } from 'lucide-react';

export default function Records() {
  const students = useStore((s) => s.students);
  const attendance = useStore((s) => s.attendance);
  const [selectedStudentId, setSelectedStudentId] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState('全部');

  const filtered = useMemo(() => {
    let records = attendance;
    if (selectedStudentId !== 'all') records = records.filter((r) => r.studentId === selectedStudentId);
    if (selectedStyle !== '全部') {
      const styleStudents = students.filter((s) => s.danceStyle === selectedStyle).map((s) => s.id);
      records = records.filter((r) => styleStudents.includes(r.studentId));
    }
    return records;
  }, [attendance, selectedStudentId, selectedStyle]);

  const grouped = useMemo(() => {
    const g: Record<string, typeof filtered> = {};
    filtered.forEach((r) => {
      if (!g[r.date]) g[r.date] = [];
      g[r.date].push(r);
    });
    return Object.entries(g).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  const studentStats = useMemo(() => {
    const stats: Record<string, number> = {};
    filtered.forEach((r) => {
      stats[r.studentId] = (stats[r.studentId] || 0) + 1;
    });
    return stats;
  }, [filtered]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">考勤记录</h2>
        <p className="text-sm text-slate-500 mt-0.5">查看学生上课打卡记录</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm">
          <option value="all">全部学生</option>
          {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.danceStyle})</option>)}
        </select>
        <select value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)} className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm">
          <option>全部</option>
          {DANCE_STYLES.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {grouped.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-100">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>暂无考勤记录</p>
          </div>
        ) : (
          grouped.map(([date, records]) => (
            <div key={date} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 bg-slate-50/50 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-700">{date}</span>
                <span className="text-xs text-slate-400">{records.length} 人打卡</span>
              </div>
              <div className="divide-y divide-slate-50">
                {records.map((r) => {
                  const s = students.find((x) => x.id === r.studentId);
                  return (
                    <div key={r.id} className="flex items-center justify-between px-5 py-2.5 hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-300 to-pink-400 flex items-center justify-center text-white text-[10px] font-bold">{s?.name?.charAt(0)}</div>
                        <div>
                          <p className="text-sm text-slate-700">{s?.name}</p>
                          <p className="text-[10px] text-slate-400">{s?.danceStyle} · {s?.planType} · {s?.usedDays}/{s?.totalDays}天</p>
                        </div>
                      </div>
                      <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">已打卡</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}