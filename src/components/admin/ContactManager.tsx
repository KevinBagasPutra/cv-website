'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  ChevronDown,
  ChevronUp,
  Loader2,
  User
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

interface ContactManagerProps {
  initialData?: Contact[]
}

export default function ContactManager({ initialData = [] }: ContactManagerProps) {
  const [items, setItems] = useState<Contact[]>(initialData)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [editFormData, setEditFormData] = useState({
    status: 'pending'
  })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/contacts')
        if (response.ok) {
          const data = await response.json()
          setItems(data)
          if (data.length > 0) {
            setExpandedCards(new Set([data[0].id]))
          }
        }
      } catch (error) {
        console.error('Fetch contacts error:', error)
      }
    }

    fetchContacts()
  }, [])

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
        return 'bg-yellow-100 text-yellow-800'
      case 'contacted':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact)
    setEditFormData({
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
        setItems(items.map(c =>
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
        const newExpanded = new Set(expandedCards)
        newExpanded.delete(contactId)
        setExpandedCards(newExpanded)
        setItems(items.filter(c => c.id !== contactId))
      } else {
        alert('Gagal menghapus contact')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Terjadi kesalahan saat menghapus contact')
    }
  }

  const stats = {
    totalContacts: items.length,
    pendingContacts: items.filter(c => c.status === 'pending').length,
    contactedContacts: items.filter(c => c.status === 'contacted').length,
    completedContacts: items.filter(c => c.status === 'completed').length
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Mail className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalContacts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.pendingContacts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dihubungi</CardTitle>
            <Phone className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.contactedContacts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selesai</CardTitle>
            <User className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.completedContacts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Pesan Kontak</h2>
          <p className="text-slate-600">Semua pesan dari contact form website</p>
        </div>
      </div>

      {/* Contacts List */}
      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Mail className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">Belum ada pesan masuk</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((contact) => (
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
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Diterima: {new Date(contact.createdAt).toLocaleDateString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(contact)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Status
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(contact.id, contact.name)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Hapus
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
      )}

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
                value={editingContact?.name || ''}
                disabled
                className="bg-slate-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editingContact?.email || ''}
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
