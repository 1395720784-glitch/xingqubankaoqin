import type { Student, AttendanceRecord } from '@/types';

const today = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];

export const mockStudents: Student[] = [
  { id: 's1', name: '张小明', phone: '13800001001', danceStyle: '中国舞', planType: '半年班', totalDays: 180, usedDays: 35, startDate: '2026-03-01', endDate: '2026-09-01', amount: 4800, status: '在读' },
  { id: 's2', name: '李小红', phone: '13800001002', danceStyle: '芭蕾', planType: '全年班', totalDays: 360, usedDays: 60, startDate: '2026-01-01', endDate: '2027-01-01', amount: 8800, status: '在读' },
  { id: 's3', name: '王大力', phone: '13800001003', danceStyle: '街舞', planType: '暑假班', totalDays: 45, usedDays: 20, startDate: '2026-07-01', endDate: '2026-08-15', amount: 1800, status: '在读' },
  { id: 's4', name: '赵小美', phone: '13800001004', danceStyle: '中国舞', planType: '季度班', totalDays: 90, usedDays: 45, startDate: '2026-04-01', endDate: '2026-07-01', amount: 2400, status: '在读' },
  { id: 's5', name: '刘小宇', phone: '13800001005', danceStyle: '拉丁舞', planType: '半年班', totalDays: 180, usedDays: 80, startDate: '2026-02-01', endDate: '2026-08-01', amount: 4800, status: '在读' },
  { id: 's6', name: '陈小芳', phone: '13800001006', danceStyle: '民族舞', planType: '寒假班', totalDays: 30, usedDays: 30, startDate: '2026-01-15', endDate: '2026-02-15', amount: 1200, status: '已到期' },
  { id: 's7', name: '杨小刚', phone: '13800001007', danceStyle: '街舞', planType: '次卡', totalDays: 20, usedDays: 12, startDate: '2026-06-01', endDate: '2026-12-01', amount: 800, status: '在读' },
  { id: 's8', name: '周小文', phone: '13800001008', danceStyle: '爵士舞', planType: '暑假班', totalDays: 45, usedDays: 15, startDate: '2026-07-01', endDate: '2026-08-15', amount: 1800, status: '在读' },
  { id: 's9', name: '吴小丽', phone: '13800001009', danceStyle: '中国舞', planType: '全年班', totalDays: 360, usedDays: 120, startDate: '2025-09-01', endDate: '2026-09-01', amount: 8800, status: '在读' },
  { id: 's10', name: '郑小豪', phone: '13800001010', danceStyle: '现代舞', planType: '季度班', totalDays: 90, usedDays: 10, startDate: '2026-06-01', endDate: '2026-09-01', amount: 2400, status: '在读' },
];

export const mockAttendance: AttendanceRecord[] = [
  { id: 'a1', studentId: 's1', date: fmt(today), status: 'present' },
  { id: 'a2', studentId: 's2', date: fmt(today), status: 'present' },
  { id: 'a3', studentId: 's3', date: fmt(today), status: 'absent' },
  { id: 'a4', studentId: 's4', date: fmt(today), status: 'present' },
  { id: 'a5', studentId: 's5', date: fmt(today), status: 'present' },
];