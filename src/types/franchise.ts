export type FranchiseStatus = 'Active' | 'Pending' | 'Rejected';

export type Franchise = {
  id: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  city: string;
  outlets: number;
  revenue: number;
  status: FranchiseStatus;
  createdAt: string;
  initialInvestment?: number;
  agreementStartDate: string;
};
