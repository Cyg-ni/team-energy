import { useState } from 'react'
import { MainLayout } from '../layouts/MainLayout'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { useAuthStore } from '../store/authStore'

const tabs = ['Profile', 'Account', 'Security', 'Notifications', 'Organization']

export function SettingsPage() {
  const user = useAuthStore((state) => state.user)
  const [activeTab, setActiveTab] = useState('Profile')

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Preferences</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Settings</h1>
        </div>

        <div className="grid gap-6 xl:grid-cols-[220px_1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </aside>

          <Card>
            {activeTab === 'Profile' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">User profile</h2>
                    <p className="text-sm text-slate-500">Manage your personal information.</p>
                  </div>
                  <Badge variant="info">{user?.role}</Badge>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Input label="Full name" value={user?.name || ''} />
                  <Input label="Email" type="email" value={user?.email || ''} />
                  <Input label="Phone" value={user?.phone || ''} />
                  <Input label="Department" value={user?.department || ''} />
                </div>
                <div className="flex gap-3">
                  <Button>Save profile</Button>
                  <Button variant="secondary">Cancel</Button>
                </div>
              </div>
            )}

            {activeTab === 'Account' && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-slate-900">Account information</h2>
                <div className="grid gap-5 md:grid-cols-2">
                  <Input label="Organization" value="Northstar Energy" />
                  <Input label="Time zone" value="UTC-05:00 (EST)" />
                  <Input label="Default approval path" value="Finance -> Controller" />
                  <Input label="Primary billing admin" value="Alicia Morgan" />
                </div>
              </div>
            )}

            {activeTab === 'Security' && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-slate-900">Password and security</h2>
                <div className="grid gap-5 md:grid-cols-2">
                  <Input label="Current password" type="password" placeholder="••••••••" />
                  <div />
                  <Input label="New password" type="password" placeholder="New password" />
                  <Input label="Confirm new password" type="password" placeholder="Confirm password" />
                </div>
                <Button>Update password</Button>
              </div>
            )}

            {activeTab === 'Notifications' && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-slate-900">Notification preferences</h2>
                <div className="space-y-3">
                  {['Email notifications', 'In-app alerts', 'Approval reminders', 'Rejection summaries', 'Weekly finance digest'].map((item) => (
                    <label key={item} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <span className="font-medium text-slate-700">{item}</span>
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Organization' && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-slate-900">Organization preferences</h2>
                <div className="grid gap-5 md:grid-cols-2">
                  <Input label="Organization name" value="Northstar Energy" />
                  <Input label="Billing currency" value="USD" />
                  <Input label="Document retention period" value="7 years" />
                  <Input label="Default approval threshold" value="$5,000" />
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
