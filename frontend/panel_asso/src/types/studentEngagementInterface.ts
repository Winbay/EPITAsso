interface activity {
  text: string;
  hours: number | null;
}

export interface Position {
  id: number;
  name: string;
}

export interface Status {
  id: number;
  name: string;
}

export interface StudentEngagement {
  id: number;
  login: string;
  name: string;
  firstname: string;
  promotion: string;
  position: number;
  comment: string;
  activities: activity[];
  totalHours: number | null;
  totalDays: number | null;
  status: { id: number; comment: string};
}