import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { DANCE_STYLES } from '@/types';
import { Check, X, RotateCcw } from 'lucide-react';

export default function Attendance() {
  const students = useStore((s) => s.students);
  const attendance = useStore((s) => s.attendance);
  const markAttendance = useStore((s) => s.markAttendance);
  const unmarkAttendance = useStore((s) => s.unmarkAttendance);

  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [filterStyle, setFilterStyle] = useState('全部');

  const activeStudents = students.filter((s) => {
    if (s.status !== '在读') return false;
    if (filterStyle !== '全部' && s.danceStyle !== filterStyle) return false;
    return true;
  });

  const todayRecords = attendance.filter((r) => r.date === date);
  const todayIds = new Set(todayRecords.map((r) => r.studentId));

  const handleToggle = (studentId: string) => {
    if (todayIds.has(studentId)) {
      const record = todayRecords.find((r) => r.studentId === studentId);
      if (record) unmarkAttendance(record.id);
    } else {
      markAttendance(studentId, date);
    }
  };

  const handleAllPresent = () => {
    activeStudents.forEach((s) => {
      if (!todayIds.has(s.id)) markAttendance(s.id, date);
    });
  };

  const handleReset = () => {
    todayRecords.forEach((r) => unmarkAttendance(r.id));
  };

  const checkedCount = activeStudents.filter((s) => todayIds.has(s.id)).length;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">上课打卡</h2>
        <p className="text-sm text-slate-500 mt-0.5">点击学生打卡，自动消耗 1 天课时</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm" />
        <select value={filterStyle} onChange={(e) => setFilterStyle(e.target.value)} className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm">
          <option>全部</option>
          {DANCE_STYLES.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-3">
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">已打卡 <span className="font-bold text-rose-600">{checkedCount}</span> / {activeStudents.length} 人</span>
          <div className="w-32 bg-slate-100 rounded-full h-2">
            <div className="bg-rose-400 h-2 rounded-full transition-all" style={{ width: `${activeStudents.length > 0 ? (checkedCount / activeStudents.length) * 100 : 0}%` }} />
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleAllPresent} className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-medium hover:bg-rose-100 transition-colors">
            <Check className="w-3 h-3" /> 全部打卡
          </button>
          <button onClick={handleReset} className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors">
            <RotateCcw className="w-3 h-3" /> 重置
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {activeStudents.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Check className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>该日期没有在读学生</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {activeStudents.map((s) => {
              const isChecked = todayIds.has(s.id);
              const remaining = s.totalDays - s.usedDays;
              return (
                <div key={s.id} onClick={() => handleToggle(s.id)} className={`flex items-center justify-between px-5 py-3.5 cursor-pointer transition-all hover:bg-slate-50 ${isChecked ? 'bg-emerald-50/30' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isChecked ? 'bg-emerald-500 text-white scale-110' : 'bg-slate-100 text-slate-400'}`}>
                      {isChecked ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{s.name}</p>
                      <p className="text-[10px] text-slate-400">{s.danceStyle} · {s.planType} · {s.usedDays}/{s.totalDays}天</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${remaining <= 5 ? 'text-red-500' : remaining <= 15 ? 'text-amber-500' : 'text-emerald-600'}`}>
                      {isChecked ? `剩余 ${remaining - 1} 天` : `剩余 ${remaining} 天`}
                    </p>
                    {remaining <= 0 && <p className="text-[10px] text-red-400">课时已用完</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}