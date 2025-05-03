export interface Goal {
  id?: number;  // Make id optional
  content: string;
  priority: number;
  deadline: string;
  status: boolean;
  email: string;
}
