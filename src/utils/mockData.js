export const mockBills = [
  {
    id: '1',
    billNumber: 'BILL-001',
    vendor: 'Electric Company',
    amount: 1250.50,
    dueDate: '2024-02-15',
    status: 'paid',
    date: '2024-01-15',
    description: 'Monthly electricity bill',
  },
  {
    id: '2',
    billNumber: 'BILL-002',
    vendor: 'Water Authority',
    amount: 320.75,
    dueDate: '2024-02-20',
    status: 'pending',
    date: '2024-01-20',
    description: 'Monthly water bill',
  },
  {
    id: '3',
    billNumber: 'BILL-003',
    vendor: 'Internet Service',
    amount: 89.99,
    dueDate: '2024-02-01',
    status: 'overdue',
    date: '2024-01-01',
    description: 'Monthly internet subscription',
  },
  {
    id: '4',
    billNumber: 'BILL-004',
    vendor: 'Gas Company',
    amount: 450.25,
    dueDate: '2024-02-25',
    status: 'pending',
    date: '2024-01-25',
    description: 'Monthly gas bill',
  },
  {
    id: '5',
    billNumber: 'BILL-005',
    vendor: 'Property Management',
    amount: 2500.0,
    dueDate: '2024-02-05',
    status: 'paid',
    date: '2024-01-05',
    description: 'Monthly rent',
  },
]

export const mockDashboardSummary = {
  totalBills: 45,
  pendingBills: 12,
  paidBills: 28,
  overdueBills: 5,
  totalAmount: 12750.5,
  pendingAmount: 3250.75,
  paidAmount: 8950.0,
  overdueAmount: 549.75,
}

export const mockRecentActivity = [
  {
    id: '1',
    type: 'bill_paid',
    title: 'Bill Paid',
    description: 'Electric Company bill #BILL-001 was marked as paid',
    timestamp: '2024-01-15T10:30:00',
    icon: 'checkCircle',
  },
  {
    id: '2',
    type: 'bill_uploaded',
    title: 'Bill Uploaded',
    description: 'Water Authority bill #BILL-002 was uploaded',
    timestamp: '2024-01-14T14:15:00',
    icon: 'upload',
  },
  {
    id: '3',
    type: 'alert_overdue',
    title: 'Overdue Alert',
    description: 'Internet Service bill #BILL-003 is now overdue',
    timestamp: '2024-01-13T09:00:00',
    icon: 'alertTriangle',
  },
  {
    id: '4',
    type: 'bill_due_soon',
    title: 'Due Soon',
    description: 'Gas Company bill #BILL-004 is due on Feb 25',
    timestamp: '2024-01-12T08:00:00',
    icon: 'calendar',
  },
]

export const mockAlerts = [
  {
    id: '1',
    title: 'Overdue Bill',
    description: 'Internet Service bill BILL-003 ($89.99) is overdue by 15 days',
    type: 'critical',
    status: 'unread',
    dueDate: '2024-02-01',
    billId: '3',
    createdAt: '2024-01-15T10:00:00',
  },
  {
    id: '2',
    title: 'Payment Due Tomorrow',
    description: 'Electric Company bill BILL-001 ($1,250.50) is due tomorrow',
    type: 'warning',
    status: 'read',
    dueDate: '2024-02-15',
    billId: '1',
    createdAt: '2024-01-14T16:00:00',
  },
  {
    id: '3',
    title: 'New Bill Uploaded',
    description: 'Gas Company bill BILL-004 has been successfully uploaded',
    type: 'info',
    status: 'read',
    dueDate: '2024-02-25',
    billId: '4',
    createdAt: '2024-01-13T11:30:00',
  },
  {
    id: '4',
    title: 'Weekly Summary',
    description: 'You have 3 bills due this week with a total of $2,560.74',
    type: 'info',
    status: 'unread',
    dueDate: null,
    billId: null,
    createdAt: '2024-01-15T09:00:00',
  },
]

export const mockUser = {
  id: '1',
  email: 'user@example.com',
  name: 'John Doe',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  company: 'Tech Corp',
  role: 'Manager',
  phone: '+1 (555) 123-4567',
  joinedDate: '2023-01-15',
}

export const mockChartData = {
  billsOverTime: [
    { month: 'Jan', value: 3200 },
    { month: 'Feb', value: 2800 },
    { month: 'Mar', value: 3500 },
    { month: 'Apr', value: 3000 },
    { month: 'May', value: 4200 },
    { month: 'Jun', value: 3800 },
  ],
  billsByStatus: [
    { name: 'Paid', value: 28 },
    { name: 'Pending', value: 12 },
    { name: 'Overdue', value: 5 },
  ],
  billsByVendor: [
    { vendor: 'Electric Company', amount: 1250.5 },
    { vendor: 'Water Authority', amount: 320.75 },
    { vendor: 'Gas Company', amount: 450.25 },
    { vendor: 'Internet Service', amount: 89.99 },
    { vendor: 'Property Management', amount: 2500.0 },
  ],
}

export const mockNotifications = [
  {
    id: '1',
    message: 'Your bill has been processed',
    type: 'success',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    message: 'New payment received',
    type: 'info',
    timestamp: new Date().toISOString(),
  },
  {
    id: '3',
    message: 'Urgent: Bill payment overdue',
    type: 'error',
    timestamp: new Date().toISOString(),
  },
]
