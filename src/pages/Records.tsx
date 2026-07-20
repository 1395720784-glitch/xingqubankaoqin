import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { STATUS_LABELS, STATUS_COLORS, type AttendanceStatus } from '@/types';
import { TrendingUp, ChevronDown } from 'lucide-react';

export default function Records() {
  const classes = useStore((s) => s.classes);
  const students = useStore((s) => s.students);
  const attendance = useStore((s) => s.attendance);

  const [selectedClassId, setSelectedClassId] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  const classStudents = useMemo(() => {
    if (selectedClassId === 'all') return students;
    return students.filter((s) => s.enrolledClasses.includes(selectedClassId));
  }, [students, selectedClassId]);

  const filteredRecords = useMemo(() => {
    let records = attendance;
    if (selectedClassId !== 'all') {
      records = records.filter((r) => r.classId === selectedClassId);
    }
    if (selectedDate) {
      records = records.filter((r) => r.date === selectedDate);
    }
    return records;
  }, [attendance, selectedClassId, selectedDate]);

  // Group by date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, typeof filteredRecords> = {};
    filteredRecords.forEach((r) => {
      if (!groups[r.date]) groups[r.date] = [];
      groups[r.date].push(r);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filteredRecords]);

  // Student stats
  const studentStats = useMemo(() => {
    const stats: Record<string, { total: number; present: number; absent: number; late: number; leave: number }> = {};
    filteredRecords.forEach((r) => {
      if (!stats[r.studentId]) stats[r.studentId] = { total: 0, present: 0, absent: 0, late: 0, leave: 0 };
      stats[r.studentId].total++;
      stats[r.studentId][r.status]++;
    });
    return stats;
  }, [filteredRecords]);

  const [viewMode, setViewMode] = useState<'detail' | 'summary'>('detail');

  // Get unique dates for date filter
  const uniqueDates = useMemo(() => {
    const dates = new Set(attendance.map((r) => r.date));
    return Array.from(dates).sort().reverse();
  }, [attendance]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">考勤记录</h2>
          <p className="text-sm text-slate-500 mt-0.5">查看历史考勤数据与统计</p>
        </div>
        <div className="flex bg-slate-100 rounded-xl p-1">
          <button
            onClick={() => setViewMode('detail')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'detail' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400'
            }`}
          >
            明细
          </button>
          <button
            onClick={() => setViewMode('summary')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'summary' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400'
            }`}
          >
            统计
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-200"
        >
          <option value="all">全部班级</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-200"
        >
          <option value="">全部日期</option>
          {uniqueDates.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {viewMode === 'detail' ? (
        /* Detail view - grouped by date */
        <div className="space-y-4">
          {groupedByDate.length === 0 ? (
            <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-100">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>暂无考勤记录</p>
            </div>
          ) : (
            groupedByDate.map(([date, records]) => {
              const present = records.filter((r) => r.status === 'present').length;
              const total = records.length;
              return (
                <div key={date} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 bg-slate-50/50 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-slate-700">{date}</span>
                      <span className="text-[10px] text-slate-400">{total} 人</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-emerald-600 font-medium">{present} 出勤</span>
                      <span className="text-slate-300">/</span>
                      <span className="text-slate-500">{total} 总</span>
                      <span className="text-emerald-600 font-medium ml-1">
                        {Math.round((present / total) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {records.map((r) => {
                      const student = students.find((s) => s.id === r.studentId);
                      const cls = classes.find((c) => c.id === r.classId);
                      return (
                        <div key={r.id} className="flex items-center justify-between px-5 py-2.5 hover:bg-slate-50">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-300 to-rose-400 flex items-center justify-center text-white text-[10px] font-bold">
                              {student?.name?.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm text-slate-700">{student?.name}</p>
                              <p className="text-[10px] text-slate-400">{cls?.name}</p>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[r.status]}`}>
                            {STATUS_LABELS[r.status]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Summary view - per student stats */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-slate-50/50 border-b border-slate-100">
            <span className="text-sm font-semibold text-slate-700">学生出勤统计</span>
          </div>
          {Object.keys(studentStats).length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>暂无统计数据</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {Object.entries(studentStats)
                .sort((a, b) => b[1].total - a[1].total)
                .map(([studentId, stats]) => {
                  const student = students.find((s) => s.id === studentId);
                  const rate = Math.round((stats.present / stats.total) * 100);
                  return (
                    <div key={studentId} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-rose-400 flex items-center justify-center text-white text-xs font-bold">
                          {student?.name?.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{student?.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-emerald-600">出勤 {stats.present}</span>
                          <span className="text-red-500">缺勤 {stats.absent}</span>
                          <span className="text-amber-600">迟到 {stats.late}</span>
                          <span className="text-blue-600">请假 {stats.leave}</span>
                        </div>
                        <div className="w-24 bg-slate-100 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full transition-all"
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-600 w-8 text-right">{rate}%</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}