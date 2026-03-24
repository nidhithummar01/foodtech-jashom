export type Report = {
  id: string;
  title: string;
  type: 'Sales' | 'Users' | 'Orders';
  createdAt: string;
  status: 'Ready' | 'Generating' | 'Failed';
};
