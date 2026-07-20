import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { InterestClass, Student, AttendanceRecord } from '@/types';
import { mockClasses, mockStudents, mockAttendance } from '@/data/mockData';

interface AppState {
  classes: InterestClass[];
  students: Student[];
  attendance: AttendanceRecord[];

  addClass: (c: InterestClass) => void;
  updateClass: (c: InterestClass) => void;
  deleteClass: (id: string) => void;

  addStudent: (s: Student) => void;
  updateStudent: (s: Student) => void;
  deleteStudent: (id: string) => void;

  addAttendance: (records: AttendanceRecord[]) => void;
  updateAttendance: (id: string, status: AttendanceRecord['status']) => void;
  getAttendanceByDate: (classId: string, date: string) => AttendanceRecord[];
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      classes: mockClasses,
      students: mockStudents,
      attendance: mockAttendance,

      addClass: (c) => set((s) => ({ classes: [...s.classes, c] })),
      updateClass: (c) => set((s) => ({ classes: s.classes.map((x) => (x.id === c.id ? c : x)) })),
      deleteClass: (id) =>
        set((s) => ({
          classes: s.classes.filter((x) => x.id !== id),
          students: s.students.map((stu) => ({
            ...stu,
            enrolledClasses: stu.enrolledClasses.filter((cid) => cid !== id),
          })),
          attendance: s.attendance.filter((x) => x.classId !== id),
        })),

      addStudent: (stu) => set((s) => ({ students: [...s.students, stu] })),
      updateStudent: (stu) => set((s) => ({ students: s.students.map((x) => (x.id === stu.id ? stu : x)) })),
      deleteStudent: (id) =>
        set((s) => ({
          students: s.students.filter((x) => x.id !== id),
          attendance: s.attendance.filter((x) => x.studentId !== id),
          classes: s.classes.map((c) => ({
            ...c,
            studentCount: s.students.filter((stu) => stu.id !== id && stu.enrolledClasses.includes(c.id)).length,
          })),
        })),

      addAttendance: (records) => set((s) => ({ attendance: [...s.attendance, ...records] })),
      updateAttendance: (id, status) =>
        set((s) => ({
          attendance: s.attendance.map((r) => (r.id === id ? { ...r, status } : r)),
        })),
      getAttendanceByDate: (classId, date) =>
        get().attendance.filter((r) => r.classId === classId && r.date === date),
    }),
    { name: 'interest-class-attendance' }
  )
);