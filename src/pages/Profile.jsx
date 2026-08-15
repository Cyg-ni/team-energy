import { useState } from 'react'
import toast from 'react-hot-toast'
import { FaEnvelope, FaPhone, FaBuilding, FaCalendarAlt, FaLock, FaUpload } from 'react-icons/fa'
import { MainLayout } from '../layouts/MainLayout'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Avatar, Alert } from '../components/ui/index'
import { useAuthStore } from '../store/authStore'
import { mockUser } from '../utils/mockData'
import { formatDate } from '../utils/helpers'

export function ProfilePage() {
  const user = useAuthStore((state) => state.user) || mockUser
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Password changed successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      toast.error('Failed to change password')
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Profile</h1>
          <p className="text-slate-600">Manage your account settings and information</p>
        </div>

        {/* Profile Overview */}
        <Card>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar
              name={user?.name}
              src={user?.avatar}
              size="xl"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">
                {user?.name}
              </h2>
              <p className="text-slate-600 mb-4">{user?.email}</p>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
                <Button variant="secondary" size="sm">
                  <FaUpload size={16} className="mr-2" />
                  Change Avatar
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Information */}
        <Card header="Account Information">
          <div className="space-y-4">
            {isEditing ? (
              <>
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  icon={FaEnvelope}
                />
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  icon={FaEnvelope}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  icon={FaPhone}
                />
                <Input
                  label="Company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  icon={FaBuilding}
                />
                <div className="flex gap-3">
                  <Button
                    onClick={handleSaveProfile}
                    isLoading={isSaving}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-slate-400 w-5 h-5" />
                    <div>
                      <p className="text-sm text-slate-600">Email Address</p>
                      <p className="text-slate-900 font-medium">{user?.email}</p>
                    </div>
                  </div>
                </div>
 
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaPhone className="text-slate-400 w-5 h-5" />
                    <div>
                      <p className="text-sm text-slate-600">Phone Number</p>
                      <p className="text-slate-900 font-medium">{user?.phone}</p>
                    </div>
                  </div>
                </div>
 
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaBuilding className="text-slate-400 w-5 h-5" />
                    <div>
                      <p className="text-sm text-slate-600">Company</p>
                      <p className="text-slate-900 font-medium">{user?.company}</p>
                    </div>
                  </div>
                </div>
 
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="text-slate-400 w-5 h-5" />
                    <div>
                      <p className="text-sm text-slate-600">Member Since</p>
                      <p className="text-slate-900 font-medium">
                        {formatDate(user?.joinedDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Change Password */}
        <Card header="Change Password">
          <div className="space-y-4">
            <Alert
              variant="info"
              description="Make sure to use a strong password that's at least 8 characters long"
            />
            <Input
              label="Current Password"
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              icon={FaLock}
              placeholder="Enter your current password"
            />
            <Input
              label="New Password"
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              icon={FaLock}
              placeholder="Enter your new password"
            />
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              icon={FaLock}
              placeholder="Confirm your new password"
            />
            <Button onClick={handleChangePassword} className="mt-4">
              Update Password
            </Button>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card header="Danger Zone" className="border-red-200">
          <div className="space-y-4">
            <p className="text-slate-600 text-sm">
              These actions are irreversible. Please proceed with caution.
            </p>
            <div className="space-y-3">
              <Button variant="danger" className="w-full">
                Delete Account
              </Button>
              <p className="text-xs text-slate-500 text-center">
                Once you delete your account, there is no going back. Please be certain.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}
