'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Code2,
  LogOut,
  Mail,
  Phone,
  Briefcase,
  Star,
  FileText,
  Settings,
  Users,
  Loader2,
  Plus,
  Trash2,
  Edit,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react'

interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  websiteType: string
  description: string
  status: string
  createdAt: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'pending'
  })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    // Check if admin is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/contacts')
        if (response.ok) {
          setIsAdmin(true)
          const data = await response.json()
          setContacts(data)
          // Auto-expand first contact if exists
          if (data.length > 0) {
            setExpandedCards(new Set([data[0].id]))
          }
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    // Delete admin session cookie
    document.cookie = 'admin_session=; expires=Thu, 01 Jan1970 00:00:00 UTC; path=/;'
    router.push('/login')
  }

  const toggleCardExpansion = (contactId: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(contactId)) {
      newExpanded.delete(contactId)
    } else {
      newExpanded.add(contactId)
    }
    setExpandedCards(newExpanded)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
      case 'contacted':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-200'
      default:
        return 'bg-slate-100 text-slate-800 hover:bg-slate-200'
    }
  }

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact)
    setEditFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone || '',
      status: contact.status
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = async () => {
    if (!editingContact) return

    try {
      const response = await fetch(`/api/contact/${editingContact.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editFormData.status
        })
      })

      if (response.ok) {
        // Update local state
        setContacts(contacts.map(c =>
          c.id === editingContact.id
            ? { ...c, status: editFormData.status }
            : c
        ))
        setIsEditDialogOpen(false)
        setEditingContact(null)
      } else {
        alert('Gagal mengupdate status contact')
      }
    } catch (error) {
      console.error('Edit error:', error)
      alert('Terjadi kesalahan saat mengupdate status')
    }
  }

  const handleDelete = async (contactId: string, contactName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus pesan dari "${contactName}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/contact/${contactId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Remove from local state
        setContacts(contacts.filter(c => c.id !== contactId))
        // Remove from expanded cards
        const newExpanded = new Set(expandedCards)
        newExpanded.delete(contactId)
        setExpandedCards(newExpanded)
      } else {
        alert('Gagal menghapus contact')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Terjadi kesalahan saat menghapus contact')
    }
  }

  const stats = {
    totalContacts: contacts.length,
    pendingContacts: contacts.filter(c => c.status === 'pending').length,
    contactedContacts: contacts.filter(c => c.status === 'contacted').length,
    completedContacts: contacts.filter(c => c.status === 'completed').length
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-600">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Code2 className="h-8 w-8 text-primary" />
                <span className="font-bold text-xl hidden sm:inline">Kevin Admin</span>
              </Link>
              <Badge className="bg-primary text-white">Admin Panel</Badge>
            </div>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Kontak</CardTitle>
              <Mail className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalContacts}</div>
              <p className="text-xs text-slate-600 mt-1">Semua pesan masuk</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Mail className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.pendingContacts}</div>
              <p className="text-xs text-slate-600 mt-1">Menunggu respon</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dihubungi</CardTitle>
              <Phone className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.contactedContacts}</div>
              <p className="text-xs text-slate-600 mt-1">Sudah follow-up</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Selesai</CardTitle>
              <Star className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.completedContacts}</div>
              <p className="text-xs text-slate-600 mt-1">Deal closed</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="contacts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Kontak</span>
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Portfolio</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Testimoni</span>
            </TabsTrigger>
          </TabsList>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Pesan Kontak</h2>
                <p className="text-slate-600">Semua pesan dari contact form</p>
              </div>
            </div>

            {contacts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Mail className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">Belum ada pesan masuk</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <Card key={contact.id} className="transition-all duration-300 hover:shadow-md">
                    <CardHeader className="cursor-pointer" onClick={() => toggleCardExpansion(contact.id)}>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start gap-2">
                            <CardTitle className="text-lg">{contact.name}</CardTitle>
                            <Badge className={getStatusColor(contact.status)}>
                              {contact.status}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                            <span className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {contact.email}
                            </span>
                            {contact.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                {contact.phone}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="p-1">
                          {expandedCards.has(contact.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>

                    {/* Expandable Content */}
                    {expandedCards.has(contact.id) && (
                      <CardContent className="space-y-4 border-t border-slate-200 pt-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-700 mb-1">Jenis Website:</p>
                          <Badge variant="outline" className="text-base">{contact.websiteType}</Badge>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-700 mb-1">Deskripsi:</p>
                          <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200">
                            {contact.description}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-slate-500 pt-2 border-t border-slate-200">
                          <p>Diterima: {new Date(contact.createdAt).toLocaleDateString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</p>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(contact)}
                              className="flex items-center gap-2"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="hidden sm:inline">Edit Status</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(contact.id, contact.name)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="hidden sm:inline">Hapus</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Portfolio Projects</h2>
                <p className="text-slate-600">Kelola project portfolio</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Project
              </Button>
            </div>
            <Card>
              <CardContent className="py-12 text-center">
                <Briefcase className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">Fitur portfolio CRUD akan segera hadir</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Freelance Services</h2>
                <p className="text-slate-600">Kelola jasa freelance</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Service
              </Button>
            </div>
            <Card>
              <CardContent className="py-12 text-center">
                <Settings className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">Fitur services CRUD akan segera hadir</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Testimonials</h2>
                <p className="text-slate-600">Kelola testimonial klien</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Testimonial
              </Button>
            </div>
            <Card>
              <CardContent className="py-12 text-center">
                <Star className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">Fitur testimonials CRUD akan segera hadir</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Status Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Status Kontak</DialogTitle>
            <DialogDescription>
              Mengubah status untuk: <strong>{editingContact?.name}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nama</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                disabled
                className="bg-slate-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editFormData.email}
                disabled
                className="bg-slate-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">No. Telepon</Label>
              <Input
                id="edit-phone"
                value={editFormData.phone}
                disabled
                className="bg-slate-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editFormData.status}
                onValueChange={(value) => setEditFormData({ ...editFormData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="contacted">Dihubungi</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              onClick={handleEditSubmit}
              className="bg-primary hover:bg-primary/90"
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
