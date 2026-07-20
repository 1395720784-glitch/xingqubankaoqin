export interface InterestClass {
  id: string;
  name: string;
  category: string;
  schedule: string;
  time: string;
  location: string;
  studentCount: number;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  phone: string;
  enrolledClasses: string[];
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  remark: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave';

export const STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: '出勤',
  absent: '缺勤',
  late: '迟到',
  leave: '请假',
};

export const STATUS_COLORS: Record<AttendanceStatus, string> = {
  present: 'bg-emerald-100 text-emerald-700',
  absent: 'bg-red-100 text-red-700',
  late: 'bg-amber-100 text-amber-700',
  leave: 'bg-blue-100 text-blue-700',
};