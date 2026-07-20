import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { STATUS_LABELS, type AttendanceStatus } from '@/types';
import { Check, X, Clock, FileText, RotateCcw } from 'lucide-react';

const statusButtons: { status: AttendanceStatus; icon: typeof Check; label: string; activeClass: string }[] = [
  { status: 'present', icon: Check, label: '出勤', activeClass: 'bg-emerald-500 text-white' },
  { status: 'absent', icon: X, label: '缺勤', activeClass: 'bg-red-500 text-white' },
  { status: 'late', icon: Clock, label: '迟到', activeClass: 'bg-amber-500 text-white' },
  { status: 'leave', icon: FileText, label: '请假', activeClass: 'bg-blue-500 text-white' },
];

export default function Attendance() {
  const classes = useStore((s) => s.classes);
  const students = useStore((s) => s.students);
  const attendance = useStore((s) => s.attendance);
  const addAttendance = useStore((s) => s.addAttendance);
  const updateAttendance = useStore((s) => s.updateAttendance);

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);

  const classStudents = useMemo(
    () => students.filter((s) => s.enrolledClasses.includes(selectedClassId)),
    [students, selectedClassId]
  );

  const todayRecords = useMemo(
    () => attendance.filter((r) => r.classId === selectedClassId && r.date === date),
    [attendance, selectedClassId, date]
  );

  const hasRecords = todayRecords.length > 0;

  const getStatus = (studentId: string): AttendanceStatus => {
    const record = todayRecords.find((r) => r.studentId === studentId);
    return record?.status || 'present';
  };

  const getRecordId = (studentId: string): string | undefined => {
    return todayRecords.find((r) => r.studentId === studentId)?.id;
  };

  const handleInit = () => {
    const records = classStudents.map((s) => ({
      id: `${selectedClassId}-${s.id}-${date}`,
      classId: selectedClassId,
      studentId: s.id,
      date,
      status: 'present' as AttendanceStatus,
      remark: '',
    }));
    addAttendance(records);
  };

  const handleToggle = (studentId: string, newStatus: AttendanceStatus) => {
    const recordId = getRecordId(studentId);
    if (recordId) {
      updateAttendance(recordId, newStatus);
    }
  };

  const handleReset = () => {
    todayRecords.forEach((r) => updateAttendance(r.id, 'present'));
  };

  const stats = useMemo(() => {
    if (!hasRecords) return null;
    const total = todayRecords.length;
    const present = todayRecords.filter((r) => r.status === 'present').length;
    const absent = todayRecords.filter((r) => r.status === 'absent').length;
    const late = todayRecords.filter((r) => r.status === 'late').length;
    const leave = todayRecords.filter((r) => r.status === 'leave').length;
    return { total, present, absent, late, leave };
  }, [todayRecords, hasRecords]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">考勤打卡</h2>
        <p className="text-sm text-slate-500 mt-0.5">选择班级，记录学生出勤情况</p>
      </div>

      {/* Select class + date */}
      <div className="flex flex-wrap gap-3">
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-200"
        >
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>

      {/* Stats bar */}
      {stats && (
        <div className="flex gap-4 flex-wrap">
          <div className="bg-white rounded-xl border border-slate-100 px-4 py-2.5 flex items-center gap-2">
            <span className="text-xs text-slate-400">总人数</span>
            <span className="text-sm font-bold text-slate-700">{stats.total}</span>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 px-4 py-2.5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-400">出勤</span>
            <span className="text-sm font-bold text-emerald-600">{stats.present}</span>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 px-4 py-2.5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs text-slate-400">缺勤</span>
            <span className="text-sm font-bold text-red-600">{stats.absent}</span>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 px-4 py-2.5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs text-slate-400">迟到</span>
            <span className="text-sm font-bold text-amber-600">{stats.late}</span>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 px-4 py-2.5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-xs text-slate-400">请假</span>
            <span className="text-sm font-bold text-blue-600">{stats.leave}</span>
          </div>
        </div>
      )}

      {/* Student list */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        {!hasRecords ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-orange-400" />
            </div>
            <p className="text-slate-600 font-medium mb-1">开始考勤打卡</p>
            <p className="text-sm text-slate-400 mb-4">初始化后默认为全部出勤，可点击切换状态</p>
            <button
              onClick={handleInit}
              disabled={classStudents.length === 0}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-400 to-rose-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-orange-200 transition-all disabled:opacity-50"
            >
              {classStudents.length === 0 ? '该班级暂无学生' : '初始化考勤表'}
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-600">学生列表</span>
              <button onClick={handleReset} className="flex items-center gap-1 text-xs text-slate-400 hover:text-orange-500 transition-colors">
                <RotateCcw className="w-3 h-3" />
                重置为全部出勤
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {classStudents.map((student) => {
                const currentStatus = getStatus(student.id);
                return (
                  <div key={student.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-300 to-rose-400 flex items-center justify-center text-white text-xs font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{student.name}</p>
                        <p className="text-[10px] text-slate-400">{student.age}岁</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      {statusButtons.map((btn) => (
                        <button
                          key={btn.status}
                          onClick={() => handleToggle(student.id, btn.status)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            currentStatus === btn.status
                              ? btn.activeClass + ' shadow-sm'
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          <btn.icon className="w-3 h-3" />
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}