import type { Report } from '../types/report';

export const reportsMock: Report[] = [
  {
    id: 'REP-001',
    title: 'Weekly Sales Snapshot',
    type: 'Sales',
    createdAt: '2026-03-21',
    status: 'Ready',
  },
  {
    id: 'REP-002',
    title: 'User Growth Overview',
    type: 'Users',
    createdAt: '2026-03-22',
    status: 'Generating',
  },
  {
    id: 'REP-003',
    title: 'Order Fulfillment Detail',
    type: 'Orders',
    createdAt: '2026-03-23',
    status: 'Failed',
  },
];
