import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { STATUS_LABELS } from '@/types';
import { BookOpen, Users, ClipboardCheck, TrendingUp, ChevronRight, Calendar } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const classes = useStore((s) => s.classes);
  const students = useStore((s) => s.students);
  const attendance = useStore((s) => s.attendance);

  const today = new Date().toISOString().split('T')[0];
  const todayRecords = attendance.filter((r) => r.date === today);
  const presentCount = todayRecords.filter((r) => r.status === 'present').length;
  const totalToday = todayRecords.length || 1;

  const recentRecords = attendance
    .filter((r) => r.date === today)
    .slice(0, 5);

  const stats = [
    { label: '班级总数', value: classes.length, icon: BookOpen, color: 'from-orange-400 to-rose-500' },
    { label: '学生总数', value: students.length, icon: Users, color: 'from-violet-400 to-indigo-500' },
    { label: '今日出勤率', value: `${Math.round((presentCount / totalToday) * 100)}%`, icon: TrendingUp, color: 'from-emerald-400 to-teal-500' },
    { label: '今日签到', value: `${presentCount}/${totalToday}`, icon: ClipboardCheck, color: 'from-sky-400 to-cyan-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">工作台</h2>
          <p className="text-sm text-slate-500 mt-0.5">欢迎回来，今日课程概览</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          <Calendar className="w-4 h-4" />
          {today}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1.5">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions + Today's classes */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">快捷操作</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/attendance')}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center">
                <ClipboardCheck className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-700">考勤打卡</p>
                <p className="text-[10px] text-slate-400">记录今日考勤</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/records')}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-violet-50 hover:bg-violet-100 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-violet-500 flex items-center justify-center">
                <TrendingUp className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-700">查看记录</p>
                <p className="text-[10px] text-slate-400">历史考勤统计</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/students')}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center">
                <Users className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-700">学生管理</p>
                <p className="text-[10px] text-slate-400">管理学生信息</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/classes')}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-sky-50 hover:bg-sky-100 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-sky-500 flex items-center justify-center">
                <BookOpen className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-700">班级管理</p>
                <p className="text-[10px] text-slate-400">管理兴趣班级</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Today's attendance */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">今日考勤动态</h3>
            <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {recentRecords.length} 条记录
            </span>
          </div>
          {recentRecords.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <ClipboardCheck className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">今日暂无考勤记录</p>
              <button onClick={() => navigate('/attendance')} className="text-xs text-orange-500 mt-1 hover:underline">
                去打卡
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {recentRecords.map((r) => {
                const student = students.find((s) => s.id === r.studentId);
                const cls = classes.find((c) => c.id === r.classId);
                return (
                  <div key={r.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-rose-400 flex items-center justify-center text-white text-xs font-bold">
                        {student?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{student?.name}</p>
                        <p className="text-[10px] text-slate-400">{cls?.name}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      r.status === 'present' ? 'bg-emerald-100 text-emerald-700' :
                      r.status === 'absent' ? 'bg-red-100 text-red-700' :
                      r.status === 'late' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {STATUS_LABELS[r.status]}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}