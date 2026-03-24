import type { Order } from '../types/order';

export const ordersMock: Order[] = [
  {
    id: 'ORD001',
    customerName: 'John Doe',
    restaurantName: 'Spice Villa',
    status: 'Completed',
  },
  {
    id: 'ORD002',
    customerName: 'Jane Smith',
    restaurantName: 'Urban Bites',
    status: 'Pending',
  },
  {
    id: 'ORD003',
    customerName: 'Amit Jain',
    restaurantName: 'Food Hub',
    status: 'Cancelled',
  },
];
