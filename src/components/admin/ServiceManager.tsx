'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  Settings,
  Loader2,
  CheckCircle2
} from 'lucide-react'

interface Service {
  id: string
  title: string
  description: string
  price?: string
  features: string
  icon?: string
  active: boolean
  createdAt: string
}

interface ServiceManagerProps {
  initialData?: Service[]
}

export default function ServiceManager({ initialData = [] }: ServiceManagerProps) {
  const [items, setItems] = useState<Service[]>(initialData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Service | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    features: '',
    icon: ''
  })

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error('Fetch services error:', error)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleEdit = (item: Service) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description,
      price: item.price || '',
      features: item.features,
      icon: item.icon || ''
    })
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({
      title: '',
      description: '',
      price: '',
      features: '',
      icon: ''
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingItem
        ? `/api/services/${editingItem.id}`
        : '/api/services'

      const response = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchServices()
        setIsDialogOpen(false)
        setEditingItem(null)
      } else {
        alert(editingItem ? 'Gagal mengupdate service' : 'Gagal menambah service')
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('Terjadi kesalahan saat menyimpan service')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus service "${title}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setItems(items.filter(item => item.id !== id))
      } else {
        alert('Gagal menghapus service')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Terjadi kesalahan saat menghapus service')
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Freelance Services</h2>
          <p className="text-slate-600">Kelola jasa freelance yang ditawarkan</p>
        </div>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Service
        </Button>
      </div>

      {/* Items List */}
      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Settings className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">Belum ada service freelance</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </div>
                    {item.price && (
                      <Badge className="bg-green-100 text-green-800">
                        {item.price}
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id, item.title)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-slate-700">{item.description}</p>

                {item.features && (
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Fitur:</p>
                    <ul className="space-y-1">
                      {item.features.split(',').map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{feature.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Freelance Service' : 'Tambah Freelance Service Baru'}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update detail service yang ada' : 'Tambahkan jasa freelance baru ke website'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Judul Service *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Company Profile Website"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi lengkap tentang service ini..."
                  rows={3}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Harga (Opsional)</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Mulai Rp 3.000.000"
                  disabled={isSubmitting}
                />
              </div>

              {/* Features */}
              <div className="space-y-2">
                <Label htmlFor="features">Fitur *</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Responsive Design, SEO Optimization, Contact Form (pisahkan dengan koma)"
                  rows={4}
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-slate-500">Pisahkan fitur dengan koma</p>
              </div>

              {/* Icon (Optional - placeholder for future use) */}
              <div className="space-y-2">
                <Label htmlFor="icon">Nama Icon (Opsional)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Code, Globe, Briefcase, dll."
                  disabled={isSubmitting}
                />
                <p className="text-xs text-slate-500">Gunakan nama icon dari Lucide React</p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {editingItem ? 'Mengupdate...' : 'Menambah...'}
                  </>
                ) : (
                  <>
                    {editingItem ? 'Update' : 'Tambah'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
