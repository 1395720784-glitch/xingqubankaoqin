import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Users, TrendingUp, DollarSign, Calendar, ChevronRight, ClipboardCheck } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const students = useStore((s) => s.students);
  const attendance = useStore((s) => s.attendance);

  const today = new Date().toISOString().split('T')[0];
  const todayRecords = attendance.filter((r) => r.date === today);
  const activeStudents = students.filter((s) => s.status === '在读');
  const totalRevenue = students.reduce((sum, s) => sum + s.amount, 0);
  const totalDays = students.reduce((sum, s) => sum + s.totalDays, 0);
  const usedDays = students.reduce((sum, s) => sum + s.usedDays, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">工作台</h2>
          <p className="text-sm text-slate-500 mt-0.5">舞蹈班学员管理概览</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          <Calendar className="w-4 h-4" />
          {today}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '在读学员', value: activeStudents.length, icon: Users, color: 'from-rose-400 to-pink-500' },
          { label: '今日打卡', value: `${todayRecords.length}人`, icon: ClipboardCheck, color: 'from-emerald-400 to-teal-500' },
          { label: '总营收', value: `¥${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'from-amber-400 to-orange-500' },
          { label: '剩余课时', value: `${totalDays - usedDays}天`, icon: TrendingUp, color: 'from-violet-400 to-indigo-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
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

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">快捷操作</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { to: '/attendance', icon: ClipboardCheck, label: '上课打卡', desc: '记录今日上课', color: 'bg-rose-50 hover:bg-rose-100', iconBg: 'bg-rose-500' },
              { to: '/students', icon: Users, label: '学生管理', desc: '添加/编辑学生', color: 'bg-violet-50 hover:bg-violet-100', iconBg: 'bg-violet-500' },
              { to: '/records', icon: TrendingUp, label: '考勤记录', desc: '查看上课记录', color: 'bg-emerald-50 hover:bg-emerald-100', iconBg: 'bg-emerald-500' },
            ].map((item) => (
              <button
                key={item.to}
                onClick={() => navigate(item.to)}
                className={`flex items-center gap-3 p-3.5 rounded-xl transition-colors group ${item.color}`}
              >
                <div className={`w-9 h-9 rounded-lg ${item.iconBg} flex items-center justify-center`}>
                  <item.icon className="w-4.5 h-4.5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-700">{item.label}</p>
                  <p className="text-[10px] text-slate-400">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700">今日打卡</h3>
            <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{todayRecords.length} 人</span>
          </div>
          {todayRecords.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <ClipboardCheck className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">今日暂无打卡</p>
              <button onClick={() => navigate('/attendance')} className="text-xs text-rose-500 mt-1 hover:underline">去打卡</button>
            </div>
          ) : (
            <div className="space-y-1">
              {todayRecords.map((r) => {
                const student = students.find((s) => s.id === r.studentId);
                return (
                  <div key={r.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-300 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
                        {student?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{student?.name}</p>
                        <p className="text-[10px] text-slate-400">{student?.danceStyle} · {student?.planType}</p>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">已打卡</span>
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