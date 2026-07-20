import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Student, AttendanceRecord } from '@/types';
import { mockStudents, mockAttendance } from '@/data/mockData';

interface AppState {
  students: Student[];
  attendance: AttendanceRecord[];

  addStudent: (s: Student) => void;
  updateStudent: (s: Student) => void;
  deleteStudent: (id: string) => void;

  markAttendance: (studentId: string, date: string) => void;
  unmarkAttendance: (id: string) => void;
  getTodayAttendance: (date: string) => AttendanceRecord[];
  getStudentAttendance: (studentId: string) => AttendanceRecord[];
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      students: mockStudents,
      attendance: mockAttendance,

      addStudent: (s) => set((state) => ({ students: [...state.students, s] })),
      updateStudent: (s) =>
        set((state) => ({
          students: state.students.map((x) => (x.id === s.id ? s : x)),
        })),
      deleteStudent: (id) =>
        set((state) => ({
          students: state.students.filter((x) => x.id !== id),
          attendance: state.attendance.filter((x) => x.studentId !== id),
        })),

      markAttendance: (studentId, date) => {
        const state = get();
        // 检查今天是否已打卡
        const existing = state.attendance.find(
          (a) => a.studentId === studentId && a.date === date
        );
        if (existing) return;

        const newRecord: AttendanceRecord = {
          id: `${studentId}-${date}`,
          studentId,
          date,
          status: 'present',
        };
        set((s) => ({
          attendance: [...s.attendance, newRecord],
          students: s.students.map((stu) =>
            stu.id === studentId ? { ...stu, usedDays: stu.usedDays + 1 } : stu
          ),
        }));
      },

      unmarkAttendance: (id) => {
        const state = get();
        const record = state.attendance.find((a) => a.id === id);
        if (!record) return;
        set((s) => ({
          attendance: s.attendance.filter((a) => a.id !== id),
          students: s.students.map((stu) =>
            stu.id === record.studentId && stu.usedDays > 0
              ? { ...stu, usedDays: stu.usedDays - 1 }
              : stu
          ),
        }));
      },

      getTodayAttendance: (date) =>
        get().attendance.filter((a) => a.date === date),

      getStudentAttendance: (studentId) =>
        get().attendance.filter((a) => a.studentId === studentId),
    }),
    { name: 'dance-class-manager' }
  )
);