"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Settings, Save, Bell, Shield, Database, Globe, Mail, BookOpen } from 'lucide-react'

interface SystemSettings {
  institutionName: string
  institutionEmail: string
  institutionPhone: string
  address: string
  academicYear: string
  currentSemester: number
  allowRegistration: boolean
  maintenanceMode: boolean
  emailNotifications: boolean
  smsNotifications: boolean
}

export default function SettingsPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [settings, setSettings] = useState<SystemSettings>({
    institutionName: 'Liberian Center for Cross Cultural Studies',
    institutionEmail: 'info@lcccs.edu',
    institutionPhone: '+231 XXX XXXX',
    address: 'Monrovia, Liberia',
    academicYear: '2024-2025',
    currentSemester: 1,
    allowRegistration: true,
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: false,
  })
  const [loadingSettings, setLoadingSettings] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')

    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      setMessage('Settings saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    }, 1000)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return <div className="flex items-center justify-center min-h-screen">Access Denied</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="h-6 w-6 md:h-8 md:w-8 text-royal-600" />
          <h1 className="text-2xl md:text-3xl font-bold font-heading">System Settings</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Configure institution-wide settings and preferences</p>
      </div>

      {message && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-md mb-6">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Globe className="h-4 w-4 md:h-5 md:w-5 text-royal-600" />
              General Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="institutionName">Institution Name</Label>
              <Input
                id="institutionName"
                value={settings.institutionName}
                onChange={(e) => setSettings({ ...settings, institutionName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="institutionEmail">Email Address</Label>
              <Input
                id="institutionEmail"
                type="email"
                value={settings.institutionEmail}
                onChange={(e) => setSettings({ ...settings, institutionEmail: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="institutionPhone">Phone Number</Label>
              <Input
                id="institutionPhone"
                value={settings.institutionPhone}
                onChange={(e) => setSettings({ ...settings, institutionPhone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Academic Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-gold-500" />
              Academic Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="academicYear">Academic Year</Label>
              <Input
                id="academicYear"
                value={settings.academicYear}
                onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="currentSemester">Current Semester</Label>
              <Input
                id="currentSemester"
                type="number"
                min="1"
                max="3"
                value={settings.currentSemester}
                onChange={(e) => setSettings({ ...settings, currentSemester: parseInt(e.target.value) })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="allowRegistration">Allow Student Registration</Label>
              <input
                id="allowRegistration"
                type="checkbox"
                checked={settings.allowRegistration}
                onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                className="h-4 w-4"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Bell className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <input
                id="emailNotifications"
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="smsNotifications">SMS Notifications</Label>
              <input
                id="smsNotifications"
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                className="h-4 w-4"
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Shield className="h-4 w-4 md:h-5 md:w-5 text-purple-500" />
              System Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                <p className="text-sm text-gray-500">Disable public access to the system</p>
              </div>
              <input
                id="maintenanceMode"
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="h-4 w-4"
              />
            </div>
            <div className="pt-4 border-t">
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => alert('Cache cleared successfully')}
              >
                Clear System Cache
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="min-w-[120px] md:min-w-[150px] text-sm">
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}
