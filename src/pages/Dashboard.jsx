import { motion } from 'framer-motion'
import { FaArrowRight, FaLightbulb, FaLeaf, FaChartLine, FaBolt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { mockDashboardMetrics, mockBillHistory } from '../utils/mockData'
import { formatCurrency } from '../utils/helpers'
import { useAuthStore } from '../store/authStore'

function ConsumptionCard({ icon: Icon, title, value, unit, detail, accent }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 250 }}>
      <Card className="h-full">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <div className="mt-3">
              <span className="text-3xl font-bold text-slate-900">{value}</span>
              <span className="ml-2 text-sm text-slate-500">{unit}</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">{detail}</p>
          </div>
          <div className={`rounded-xl p-3 ${accent}`}>
            <Icon size={22} />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

function EnergyGoalCard() {
  const target = mockDashboardMetrics.energyReductionGoal
  const achieved = mockDashboardMetrics.currentReductionAchieved
  const remaining = target - achieved
  const progressPercent = (achieved / target) * 100

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 250 }}>
      <Card className="h-full">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Energy Reduction Goal</h3>
            <Badge variant="success">In Progress</Badge>
          </div>

          <div className="space-y-3">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Target Reduction</span>
                <span className="text-sm font-bold text-slate-900">{target}%</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-sm">
              <div className="rounded-lg bg-emerald-50 p-3">
                <p className="text-xs font-medium uppercase text-emerald-600">Achieved</p>
                <p className="mt-1 text-xl font-bold text-emerald-900">{achieved}%</p>
              </div>
              <div className="rounded-lg bg-amber-50 p-3">
                <p className="text-xs font-medium uppercase text-amber-600">Remaining</p>
                <p className="mt-1 text-xl font-bold text-amber-900">{remaining.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <p className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800">
            Great progress! You've achieved <strong>{achieved}%</strong> reduction. Keep uploading your bills to track and improve your energy consumption.
          </p>
        </div>
      </Card>
    </motion.div>
  )
}

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const role = user?.role || 'Staff'

  const actionsByRole = {
    Admin: [
      { label: 'Upload bill', link: '/bills/logging', variant: 'primary' },
      { label: 'Review approvals', link: '/approvals', variant: 'secondary' },
      { label: 'Organization accounts', link: '/organization-accounts', variant: 'outline' },
    ],
    Approver: [
      { label: 'Review approvals', link: '/approvals', variant: 'primary' },
      { label: 'Bill history', link: '/bills/history', variant: 'secondary' },
      { label: 'Settings', link: '/settings', variant: 'outline' },
    ],
    Staff: [
      { label: 'Upload bill', link: '/bills/logging', variant: 'primary' },
      { label: 'Bill history', link: '/bills/history', variant: 'secondary' },
      { label: 'Settings', link: '/settings', variant: 'outline' },
    ],
    Viewer: [
      { label: 'Bill history', link: '/bills/history', variant: 'primary' },
      { label: 'Dashboard', link: '/dashboard', variant: 'secondary' },
      { label: 'Settings', link: '/settings', variant: 'outline' },
    ],
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Overview</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">Energy dashboard</h1>
            <p className="mt-2 text-sm text-slate-500">Signed in as {role}</p>
          </div>
          <div className="flex gap-3">
            {actionsByRole[role]?.slice(0, 2).map((action) => (
              <Link key={action.label} to={action.link}>
                <Button variant={action.variant}>{action.label}</Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <ConsumptionCard
            icon={FaLightbulb}
            title="Current Consumption"
            value={mockDashboardMetrics.currentConsumption}
            unit="kWh"
            detail="This billing period"
            accent="bg-blue-100 text-blue-600"
          />
          <ConsumptionCard
            icon={FaChartLine}
            title="Average Consumption"
            value={mockDashboardMetrics.averageConsumption}
            unit="kWh"
            detail="12-month average"
            accent="bg-cyan-100 text-cyan-600"
          />
          <ConsumptionCard
            icon={FaLeaf}
            title="Monthly Bill"
            value={formatCurrency(mockDashboardMetrics.currentBillAmount)}
            unit="₱"
            detail="Current charges"
            accent="bg-emerald-100 text-emerald-600"
          />
          <ConsumptionCard
            icon={FaBolt}
            title="Total Bills Submitted"
            value={mockDashboardMetrics.totalBillsSubmitted}
            unit="bills"
            detail="OCR processed"
            accent="bg-amber-100 text-amber-600"
          />
        </div>

        <EnergyGoalCard />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
          <Card header="Recent electricity bills">
            <div className="space-y-3">
              {mockBillHistory.slice(0, 5).map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{bill.provider}</p>
                        <p className="text-xs text-slate-500">{bill.billingPeriod}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{bill.consumption} kWh</p>
                    <p className="text-xs text-slate-500">{formatCurrency(bill.amount)}</p>
                  </div>
                  <div className="ml-4 text-right">
                    <Badge variant={bill.status === 'paid' ? 'success' : 'info'}>{bill.status}</Badge>
                    {bill.consumptionReduction && (
                      <p className="mt-1 text-xs font-medium text-emerald-600">
                        {bill.consumptionReduction}% ↓
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card header="Electricity overview">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Utility type</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">Electricity</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Consumption volume</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{mockDashboardMetrics.currentConsumption} kWh</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Billing period</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">July 2026</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3">
                <p className="text-xs font-medium text-blue-600 uppercase">Target reduction status</p>
                <p className="mt-1 text-sm font-bold text-blue-900">
                  {(mockDashboardMetrics.energyReductionGoal - mockDashboardMetrics.currentReductionAchieved).toFixed(1)}%
                  {' '}more to achieve goal
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card header="Quick actions">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {actionsByRole[role].map((action) => (
              <Link key={action.label} to={action.link}>
                <Button variant={action.variant} className="w-full justify-between rounded-xl">
                  <span>{action.label}</span>
                  <FaArrowRight size={12} />
                </Button>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}
