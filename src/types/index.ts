export type DanceStyle = '中国舞' | '芭蕾' | '街舞' | '拉丁舞' | '爵士舞' | '民族舞' | '现代舞';

export type PlanType = '半年班' | '暑假班' | '寒假班' | '全年班' | '季度班' | '次卡';

export interface Student {
  id: string;
  name: string;
  phone: string;
  danceStyle: DanceStyle;
  planType: PlanType;
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

export const PLAN_TYPES: PlanType[] = ['半年班', '暑假班', '寒假班', '全年班', '季度班', '次卡'];

export const PLAN_DAYS: Record<PlanType, number> = {
  '半年班': 180,
  '暑假班': 45,
  '寒假班': 30,
  '全年班': 360,
  '季度班': 90,
  '次卡': 20,
};