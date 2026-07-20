import { useState } from 'react';
import { useStore } from '@/store/useStore';
import type { InterestClass } from '@/types';
import { Plus, Edit2, Trash2, Users, MapPin, Clock, BookOpen } from 'lucide-react';

const categories = ['全部', '美术', '音乐', '体育', '科技', '舞蹈', '书法'];

export default function Classes() {
  const classes = useStore((s) => s.classes);
  const addClass = useStore((s) => s.addClass);
  const updateClass = useStore((s) => s.updateClass);
  const deleteClass = useStore((s) => s.deleteClass);

  const [activeCategory, setActiveCategory] = useState('全部');
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState<InterestClass | null>(null);
  const [form, setForm] = useState({ name: '', category: '美术', schedule: '', time: '', location: '' });

  const filtered = activeCategory === '全部' ? classes : classes.filter((c) => c.category === activeCategory);

  const openAdd = () => {
    setEditingClass(null);
    setForm({ name: '', category: '美术', schedule: '', time: '', location: '' });
    setShowModal(true);
  };

  const openEdit = (c: InterestClass) => {
    setEditingClass(c);
    setForm({ name: c.name, category: c.category, schedule: c.schedule, time: c.time, location: c.location });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editingClass) {
      updateClass({ ...editingClass, ...form });
    } else {
      addClass({ id: `c${Date.now()}`, ...form, studentCount: 0 });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除该班级吗？相关考勤数据也会被清除。')) {
      deleteClass(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">班级管理</h2>
          <p className="text-sm text-slate-500 mt-0.5">管理兴趣班班级信息</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-400 to-rose-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-orange-200 transition-all"
        >
          <Plus className="w-4 h-4" />
          添加班级
        </button>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-white text-slate-500 border border-slate-200 hover:border-orange-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Class grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-5 group">
            <div className="flex items-start justify-between mb-3">
              <span className="text-[10px] font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                {c.category}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-slate-100">
                  <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            </div>
            <h3 className="text-base font-semibold text-slate-800 mb-3">{c.name}</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>{c.schedule} {c.time}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5" />
                <span>{c.location}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Users className="w-3.5 h-3.5" />
                <span>{c.studentCount} 名学生</span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>暂无班级，点击上方按钮添加</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">{editingClass ? '编辑班级' : '添加班级'}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">班级名称</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="如：少儿美术基础班"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">类别</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                >
                  {categories.filter((c) => c !== '全部').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">上课时间</label>
                <input
                  value={form.schedule}
                  onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="如：每周一、三"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">具体时段</label>
                <input
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="如：16:00-17:30"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">上课地点</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="如：美术教室A"
                />
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

