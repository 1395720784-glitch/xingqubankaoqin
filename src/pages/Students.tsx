import { useState } from 'react';
import { useStore } from '@/store/useStore';
import type { Student, DanceStyle, Plan } from '@/types';
import { DANCE_STYLES } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, X, ClipboardCheck, Settings } from 'lucide-react';

export default function Students() {
  const navigate = useNavigate();
  const students = useStore((s) => s.students);
  const attendance = useStore((s) => s.attendance);
  const plans = useStore((s) => s.plans);
  const addStudent = useStore((s) => s.addStudent);
  const updateStudent = useStore((s) => s.updateStudent);
  const deleteStudent = useStore((s) => s.deleteStudent);
  const markAttendance = useStore((s) => s.markAttendance);
  const unmarkAttendance = useStore((s) => s.unmarkAttendance);
  const addPlan = useStore((s) => s.addPlan);
  const updatePlan = useStore((s) => s.updatePlan);
  const deletePlan = useStore((s) => s.deletePlan);

  const today = new Date().toISOString().split('T')[0];
  const todayRecords = attendance.filter((r) => r.date === today);
  const todayIds = new Set(todayRecords.map((r) => r.studentId));

  const getPlanDays = (name: string) => plans.find((p) => p.name === name)?.days ?? 0;

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('全部');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form, setForm] = useState({
    name: '', phone: '', danceStyle: '中国舞' as DanceStyle,
    planType: '', amount: '', startDate: '', endDate: '',
  });

  const filtered = students.filter((s) => {
    const matchSearch = s.name.includes(search) || s.phone.includes(search);
    const matchStatus = filterStatus === '全部' || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openAdd = () => {
    setEditingStudent(null);
    setForm({ name: '', phone: '', danceStyle: '中国舞', planType: plans[0]?.name ?? '', amount: '', startDate: '', endDate: '' });
    setShowModal(true);
  };

  const openEdit = (s: Student) => {
    setEditingStudent(s);
    setForm({ name: s.name, phone: s.phone, danceStyle: s.danceStyle, planType: s.planType, amount: String(s.amount), startDate: s.startDate, endDate: s.endDate });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.planType) return;
    const totalDays = getPlanDays(form.planType);
    if (editingStudent) {
      updateStudent({
        ...editingStudent,
        name: form.name, phone: form.phone,
        danceStyle: form.danceStyle, planType: form.planType,
        totalDays, amount: Number(form.amount) || 0,
        startDate: form.startDate, endDate: form.endDate,
      });
    } else {
      addStudent({
        id: `s${Date.now()}`, name: form.name, phone: form.phone,
        danceStyle: form.danceStyle, planType: form.planType,
        totalDays, usedDays: 0, amount: Number(form.amount) || 0,
        startDate: form.startDate, endDate: form.endDate, status: '在读',
      });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定删除该学生吗？')) deleteStudent(id);
  };

  const handleCheckIn = (studentId: string) => {
    if (todayIds.has(studentId)) {
      const record = todayRecords.find((r) => r.studentId === studentId);
      if (record) unmarkAttendance(record.id);
    } else {
      markAttendance(studentId, today);
    }
  };

  // 套餐管理
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [planForm, setPlanForm] = useState({ name: '', days: '' });

  const openPlanAdd = () => {
    setEditingPlan(null);
    setPlanForm({ name: '', days: '' });
    setShowPlanModal(true);
  };

  const openPlanEdit = (p: Plan) => {
    setEditingPlan(p);
    setPlanForm({ name: p.name, days: String(p.days) });
    setShowPlanModal(true);
  };

  const handlePlanSave = () => {
    if (!planForm.name.trim() || !planForm.days) return;
    const days = Number(planForm.days);
    if (days <= 0) return;
    if (editingPlan) {
      const oldName = editingPlan.name;
      updatePlan({ ...editingPlan, name: planForm.name, days });
      // 更新所有使用旧套餐名的学生
      if (oldName !== planForm.name) {
        students.filter((s) => s.planType === oldName).forEach((s) => {
          updateStudent({ ...s, planType: planForm.name, totalDays: days });
        });
      }
    } else {
      addPlan({ id: `plan_${Date.now()}`, name: planForm.name, days });
    }
    setShowPlanModal(false);
  };

  const handlePlanDelete = (id: string, name: string) => {
    if (students.some((s) => s.planType === name)) {
      alert(`「${name}」套餐还有学生在使用，请先修改学生套餐后再删除`);
      return;
    }
    if (window.confirm(`确定删除「${name}」套餐吗？`)) deletePlan(id);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">学生管理</h2>
          <p className="text-sm text-slate-500 mt-0.5">管理学员信息、缴费与课时</p>
        </div>
        <div className="flex items-center gap-3">
        <button onClick={() => setShowPlanModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all">
          <Settings className="w-4 h-4" /> 管理套餐
        </button>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-rose-200 transition-all">
          <Plus className="w-4 h-4" /> 添加学生
        </button>
      </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索姓名或手机号..." className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-200" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-slate-400" /></button>}
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm">
          <option>全部</option><option>在读</option><option>已到期</option><option>已退费</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">姓名</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">舞种</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">套餐</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">已上/总天数</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">剩余</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">金额</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">状态</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-400">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((s) => {
                const remaining = s.totalDays - s.usedDays;
                const ratio = s.totalDays > 0 ? (s.usedDays / s.totalDays) * 100 : 0;
                return (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-300 to-pink-400 flex items-center justify-center text-white text-xs font-bold">{s.name.charAt(0)}</div>
                        <div>
                          <span className="text-sm font-medium text-slate-700">{s.name}</span>
                          <p className="text-[10px] text-slate-400">{s.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="text-xs bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full">{s.danceStyle}</span></td>
                    <td className="px-4 py-3 text-sm text-slate-600">{s.planType}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 rounded-full h-2">
                          <div className={`h-2 rounded-full transition-all ${remaining <= 5 ? 'bg-red-400' : remaining <= 15 ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${ratio}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">{s.usedDays}/{s.totalDays}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-bold ${remaining <= 5 ? 'text-red-500' : remaining <= 15 ? 'text-amber-500' : 'text-emerald-600'}`}>{remaining}天</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-700">¥{s.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.status === '在读' ? 'bg-emerald-50 text-emerald-600' : s.status === '已到期' ? 'bg-slate-100 text-slate-500' : 'bg-red-50 text-red-500'}`}>{s.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleCheckIn(s.id)}
                          className={`p-1.5 rounded-lg transition-all ${
                            todayIds.has(s.id)
                              ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                              : 'hover:bg-emerald-50 text-slate-400 hover:text-emerald-600'
                          }`}
                          title={todayIds.has(s.id) ? '已打卡，点击取消' : '上课打卡'}
                        >
                          <ClipboardCheck className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-slate-100"><Edit2 className="w-3.5 h-3.5 text-slate-400" /></button>
                        <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-slate-400">{search ? '未找到匹配学生' : '暂无学生'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-800 mb-4">{editingStudent ? '编辑学生' : '添加学生'}</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">姓名</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-200" placeholder="学生姓名" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">手机号</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-200" placeholder="家长手机号" />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">舞种</label>
                <select value={form.danceStyle} onChange={(e) => setForm({ ...form, danceStyle: e.target.value as DanceStyle })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                  {DANCE_STYLES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">套餐类型</label>
                <div className="grid grid-cols-3 gap-2">
                  {plans.map((p) => (
                    <button key={p.id} type="button" onClick={() => setForm({ ...form, planType: p.name })} className={`py-2 rounded-lg text-xs font-medium border transition-all ${form.planType === p.name ? 'border-rose-400 bg-rose-50 text-rose-600' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                      {p.name}<br /><span className="text-[10px] opacity-60">{p.days}天</span>
                    </button>
                  ))}
                  {plans.length === 0 && <p className="col-span-3 text-xs text-slate-400 py-2">暂无套餐，请先添加</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">缴费金额（元）</label>
                  <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="如：4800" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">总天数</label>
                  <input type="text" value={form.planType ? getPlanDays(form.planType) : '—'} disabled className="w-full px-3 py-2 border border-slate-100 rounded-lg text-sm bg-slate-50 text-slate-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">开始日期</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">到期日期</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">取消</button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-rose-200 transition-all">保存</button>
            </div>
          </div>
        </div>
      )}

      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowPlanModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-800 mb-4">管理套餐</h3>

            {/* 添加/编辑套餐 */}
            <div className="flex gap-2 mb-4">
              <input
                value={planForm.name}
                onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                placeholder="套餐名称"
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
              <input
                type="number"
                value={planForm.days}
                onChange={(e) => setPlanForm({ ...planForm, days: e.target.value })}
                placeholder="天数"
                className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
              <button
                onClick={handlePlanSave}
                className="px-4 py-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all whitespace-nowrap"
              >
                {editingPlan ? '更新' : '添加'}
              </button>
              {editingPlan && (
                <button
                  onClick={() => { setEditingPlan(null); setPlanForm({ name: '', days: '' }); }}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-500 hover:bg-slate-50"
                >
                  取消
                </button>
              )}
            </div>

            {/* 套餐列表 */}
            <div className="space-y-2">
              {plans.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl">
                  <div>
                    <span className="text-sm font-medium text-slate-700">{p.name}</span>
                    <span className="text-xs text-slate-400 ml-2">{p.days}天</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openPlanEdit(p)}
                      className="p-1.5 rounded-lg hover:bg-slate-200"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <button
                      onClick={() => handlePlanDelete(p.id, p.name)}
                      className="p-1.5 rounded-lg hover:bg-red-100"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
              {plans.length === 0 && (
                <p className="text-center py-4 text-sm text-slate-400">暂无套餐，请添加</p>
              )}
            </div>

            <button
              onClick={() => setShowPlanModal(false)}
              className="w-full mt-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}