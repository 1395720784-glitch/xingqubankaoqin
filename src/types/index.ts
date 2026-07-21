export type DanceStyle = '中国舞' | '芭蕾' | '街舞' | '拉丁舞' | '爵士舞' | '民族舞' | '现代舞';

export interface Plan {
  id: string;
  name: string;
  days: number;
}

export interface Student {
  id: string;
  name: string;
  phone: string;
  danceStyle: DanceStyle;
  planType: string;
  totalDays: number;
  usedDays: number;
  startDate: string;
  endDate: string;
  amount: number;
  status: '在读' | '已到期' | '已退费';
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent';
}

export const DANCE_STYLES: DanceStyle[] = ['中国舞', '芭蕾', '街舞', '拉丁舞', '爵士舞', '民族舞', '现代舞'];

export const DEFAULT_PLANS: Plan[] = [
  { id: 'plan_1', name: '半年班', days: 180 },
  { id: 'plan_2', name: '全年班', days: 360 },
  { id: 'plan_3', name: '暑假班', days: 45 },
  { id: 'plan_4', name: '寒假班', days: 30 },
  { id: 'plan_5', name: '季度班', days: 90 },
  { id: 'plan_6', name: '次卡', days: 20 },
];