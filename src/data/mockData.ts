import type { InterestClass, Student, AttendanceRecord } from '@/types';

const today = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return fmt(d);
};

export const mockClasses: InterestClass[] = [
  { id: 'c1', name: '少儿美术基础班', category: '美术', schedule: '每周一、三', time: '16:00-17:30', location: '美术教室A', studentCount: 8 },
  { id: 'c2', name: '钢琴入门班', category: '音乐', schedule: '每周二、四', time: '17:00-18:00', location: '琴房1', studentCount: 5 },
  { id: 'c3', name: '篮球兴趣班', category: '体育', schedule: '每周六', time: '09:00-10:30', location: '体育馆', studentCount: 12 },
  { id: 'c4', name: '少儿编程启蒙', category: '科技', schedule: '每周日', time: '14:00-15:30', location: '电脑教室', studentCount: 6 },
  { id: 'c5', name: '中国舞初级班', category: '舞蹈', schedule: '每周五、六', time: '16:30-18:00', location: '舞蹈室', studentCount: 10 },
  { id: 'c6', name: '硬笔书法班', category: '书法', schedule: '每周三', time: '16:00-17:00', location: '书法教室', studentCount: 7 },
];

export const mockStudents: Student[] = [
  { id: 's1', name: '张小明', age: 8, phone: '13800001001', enrolledClasses: ['c1', 'c4'] },
  { id: 's2', name: '李小红', age: 7, phone: '13800001002', enrolledClasses: ['c1', 'c5'] },
  { id: 's3', name: '王大力', age: 9, phone: '13800001003', enrolledClasses: ['c2', 'c3'] },
  { id: 's4', name: '赵小美', age: 8, phone: '13800001004', enrolledClasses: ['c1', 'c5'] },
  { id: 's5', name: '刘小宇', age: 10, phone: '13800001005', enrolledClasses: ['c3', 'c4'] },
  { id: 's6', name: '陈小芳', age: 7, phone: '13800001006', enrolledClasses: ['c1', 'c6'] },
  { id: 's7', name: '杨小刚', age: 9, phone: '13800001007', enrolledClasses: ['c3'] },
  { id: 's8', name: '周小文', age: 8, phone: '13800001008', enrolledClasses: ['c2', 'c6'] },
  { id: 's9', name: '吴小丽', age: 7, phone: '13800001009', enrolledClasses: ['c1', 'c5'] },
  { id: 's10', name: '郑小豪', age: 10, phone: '13800001010', enrolledClasses: ['c3', 'c4'] },
  { id: 's11', name: '孙小雅', age: 8, phone: '13800001011', enrolledClasses: ['c5'] },
  { id: 's12', name: '马小涛', age: 9, phone: '13800001012', enrolledClasses: ['c3'] },
];

export const mockAttendance: AttendanceRecord[] = [
  ...['c1', 'c2', 'c3', 'c4', 'c5', 'c6'].flatMap((classId) => {
    const classStudents = mockStudents.filter((s) => s.enrolledClasses.includes(classId));
    return [0, 1, 3, 4, 6, 7].flatMap((daysBack) => {
      const d = new Date(today);
      d.setDate(d.getDate() - daysBack);
      if (d.getDay() === 0 || d.getDay() === 6) return [];
      return classStudents.map((student) => ({
        id: `${classId}-${student.id}-${daysAgo(daysBack)}`,
        classId,
        studentId: student.id,
        date: daysAgo(daysBack),
        status: (Math.random() > 0.15 ? 'present' : Math.random() > 0.5 ? 'absent' : 'late') as AttendanceRecord['status'],
        remark: '',
      }));
    });
  }),
];