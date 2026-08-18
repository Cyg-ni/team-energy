import { useMemo, useState } from 'react'
import { MainLayout } from '../layouts/MainLayout'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Table } from '../components/tables/Table'
import { mockUsers } from '../utils/mockData'

const roles = ['Admin', 'Staff/User', 'Approver', 'Viewer']

export function OrganizationAccountsPage() {
  const [search, setSearch] = useState('')
  const [selectedRole, setSelectedRole] = useState('All')

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.department.toLowerCase().includes(search.toLowerCase())

      const matchesRole = selectedRole === 'All' || user.role === selectedRole
      return matchesSearch && matchesRole
    })
  }, [search, selectedRole])

  const accountColumns = [
    {
      key: 'name',
      label: 'User',
      render: (value, row) => (
        <div>
          <p className="font-semibold text-slate-900">{value}</p>
          <p className="text-xs text-slate-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (value) => (
        <Badge
          variant={
            value === 'Admin'
              ? 'info'
              : value === 'Approver'
                ? 'warning'
                : value === 'Viewer'
                  ? 'slate'
                  : 'success'
          }
        >
          {value}
        </Badge>
      ),
    },
    { key: 'department', label: 'Department' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <Badge variant={value === 'Active' ? 'success' : 'danger'}>{value}</Badge>,
    },
    { key: 'lastLogin', label: 'Last login' },
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Admin</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Organization accounts</h1>
          </div>
          <Button>Create account</Button>
        </div>

        <Card>
          <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_0.8fr]">
            <Input label="Search users" placeholder="Name, email, department" value={search} onChange={(e) => setSearch(e.target.value)} />
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Role</label>
              <select
                value={selectedRole}
                onChange={(event) => setSelectedRole(event.target.value)}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="All">All</option>
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="secondary" className="w-full">Export list</Button>
            </div>
          </div>
        </Card>

        <Card header="Users under this organization">
          <Table columns={accountColumns} data={filteredUsers} empty={<div className="py-8 text-center text-slate-500">No users match your filters.</div>} />
        </Card>
      </div>
    </MainLayout>
  )
}
