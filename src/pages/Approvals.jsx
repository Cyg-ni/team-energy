import { MainLayout } from '../layouts/MainLayout'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'

const approvalItems = [
  {
    id: 'APP-2041',
    provider: 'BENECO',
    period: 'July 2026',
    amount: '₱3,245.50',
    status: 'Pending Review',
    reviewer: 'Approver',
  },
  {
    id: 'APP-2042',
    provider: 'MERALCO',
    period: 'August 2026',
    amount: '₱4,890.10',
    status: 'Awaiting Validation',
    reviewer: 'Admin',
  },
  {
    id: 'APP-2043',
    provider: 'NUVELCO',
    period: 'July 2026',
    amount: '₱2,150.45',
    status: 'Approved',
    reviewer: 'Admin',
  },
]

export function ApprovalsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Approvals</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Approval queue</h1>
          </div>
          <Badge variant="warning">3 pending</Badge>
        </div>

        <div className="grid gap-5">
          {approvalItems.map((item) => (
            <Card key={item.id}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-bold text-slate-900">{item.provider}</p>
                    <Badge
                      variant={
                        item.status === 'Approved'
                          ? 'success'
                          : item.status === 'Pending Review'
                            ? 'warning'
                            : 'info'
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    {item.id} • {item.period} • Reviewed by {item.reviewer}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Amount</p>
                    <p className="text-xl font-bold text-slate-900">{item.amount}</p>
                  </div>
                  <Button variant={item.status === 'Approved' ? 'secondary' : 'primary'}>
                    {item.status === 'Approved' ? 'View' : 'Review'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
