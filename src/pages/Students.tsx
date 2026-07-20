import { useState } from 'react';
import { useStore } from '@/store/useStore';
import type { Student } from '@/types';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';

export default function Students() {
  const students = useStore((s) => s.students);
  const classes = useStore((s) => s.classes);
  const addStudent = useStore((s) => s.addStudent);
  const updateStudent = useStore((s) => s.updateStudent);
  const deleteStudent = useStore((s) => s.deleteStudent);

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form, setForm] = useState({ name: '', age: '', phone: '', enrolledClasses: [] as string[] });

  const filtered = students.filter(
    (s) => s.name.includes(search) || s.phone.includes(search)
  );

  const openAdd = () => {
    setEditingStudent(null);
    setForm({ name: '', age: '', phone: '', enrolledClasses: [] });
    setShowModal(true);
  };

  const openEdit = (s: Student) => {
    setEditingStudent(s);
    setForm({ name: s.name, age: String(s.age), phone: s.phone, enrolledClasses: [...s.enrolledClasses] });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.age.trim()) return;
    const age = parseInt(form.age);
    if (isNaN(age) || age < 3 || age > 18) return;

    if (editingStudent) {
      updateStudent({ ...editingStudent, name: form.name, age, phone: form.phone, enrolledClasses: form.enrolledClasses });
    } else {
      addStudent({ id: `s${Date.now()}`, name: form.name, age, phone: form.phone, enrolledClasses: form.enrolledClasses });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除该学生吗？相关考勤数据也会被清除。')) {
      deleteStudent(id);
    }
  };

  const toggleClass = (classId: string) => {
    setForm((f) => ({
      ...f,
      enrolledClasses: f.enrolledClasses.includes(classId)
        ? f.enrolledClasses.filter((c) => c !== classId)
        : [...f.enrolledClasses, classId],
    }));
  };

  const getClassName = (classId: string) => classes.find((c) => c.id === classId)?.name || '';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">学生管理</h2>
          <p className="text-sm text-slate-500 mt-0.5">管理学生信息与分班</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-400 to-rose-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-orange-200 transition-all"
        >
          <Plus className="w-4 h-4" />
          添加学生
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索学生姓名或手机号..."
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      {/* Student table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400">姓名</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400">年龄</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400">手机号</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-400">已报班级</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-400">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-rose-400 flex items-center justify-center text-white text-xs font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">{student.age}岁</td>
                  <td className="px-5 py-3 text-sm text-slate-500">{student.phone}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {student.enrolledClasses.length === 0 ? (
                        <span className="text-xs text-slate-400">未分班</span>
                      ) : (
                        student.enrolledClasses.map((cid) => (
                          <span key={cid} className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded-full">
                            {getClassName(cid)}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(student)} className="p-1.5 rounded-lg hover:bg-slate-100">
                        <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                      <button onClick={() => handleDelete(student.id)} className="p-1.5 rounded-lg hover:bg-red-50">
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">
                    {search ? '未找到匹配的学生' : '暂无学生，点击上方按钮添加'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-800 mb-4">{editingStudent ? '编辑学生' : '添加学生'}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">姓名</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="学生姓名"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">年龄</label>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="6-18"
                  min={3}
                  max={18}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">手机号</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="家长手机号"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">选择班级（可多选）</label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {classes.map((c) => (
                    <label key={c.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.enrolledClasses.includes(c.id)}
                        onChange={() => toggleClass(c.id)}
                        className="w-4 h-4 rounded accent-orange-500"
                      />
                      <span className="text-sm text-slate-700">{c.name}</span>
                      <span className="text-[10px] text-slate-400 ml-auto">{c.category}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">
                取消
              </button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-gradient-to-r from-orange-400 to-rose-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-orange-200 transition-all">
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}