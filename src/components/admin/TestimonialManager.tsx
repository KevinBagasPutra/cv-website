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
  Star,
  Quote,
  Loader2,
  User,
  Building
} from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  company?: string
  role?: string
  content: string
  rating: number
  imageUrl?: string
  featured: boolean
  createdAt: string
}

interface TestimonialManagerProps {
  initialData?: Testimonial[]
}

export default function TestimonialManager({ initialData = [] }: TestimonialManagerProps) {
  const [items, setItems] = useState<Testimonial[]>(initialData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    role: '',
    content: '',
    rating: 5,
    imageUrl: '',
    featured: false
  })

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials')
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error('Fetch testimonials error:', error)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const handleEdit = (item: Testimonial) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      company: item.company || '',
      role: item.role || '',
      content: item.content,
      rating: item.rating,
      imageUrl: item.imageUrl || '',
      featured: item.featured
    })
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      company: '',
      role: '',
      content: '',
      rating: 5,
      imageUrl: '',
      featured: false
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingItem
        ? `/api/testimonials/${editingItem.id}`
        : '/api/testimonials'

      const response = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchTestimonials()
        setIsDialogOpen(false)
        setEditingItem(null)
      } else {
        alert(editingItem ? 'Gagal mengupdate testimonial' : 'Gagal menambah testimonial')
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('Terjadi kesalahan saat menyimpan testimonial')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus testimoni dari "${name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setItems(items.filter(item => item.id !== id))
      } else {
        alert('Gagal menghapus testimonial')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Terjadi kesalahan saat menghapus testimonial')
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Testimonials</h2>
          <p className="text-slate-600">Kelola testimoni dari klien</p>
        </div>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Testimonial
        </Button>
      </div>

      {/* Items List */}
      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Quote className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">Belum ada testimoni</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start gap-2">
                      <Star className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        {item.company && (
                          <p className="text-sm text-slate-600 flex items-center gap-2">
                            <Building className="h-3 w-3" />
                            {item.company}
                          </p>
                        )}
                      </div>
                    </div>
                    {item.role && (
                      <Badge variant="outline" className="text-xs">
                        {item.role}
                      </Badge>
                    )}
                    {item.featured && (
                      <Badge className="bg-primary text-white ml-2">Featured</Badge>
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
                      onClick={() => handleDelete(item.id, item.name)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-slate-700 italic bg-slate-50 p-4 rounded-lg">
                  &ldquo;{item.content}&rdquo;
                </p>

                <div className="flex items-center justify-between text-sm text-slate-500 pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-4">
                    <span>Rating: </span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= item.rating
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
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
              {editingItem ? 'Edit Testimonial' : 'Tambah Testimonial Baru'}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update testimoni klien' : 'Tambahkan testimoni baru dari klien'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Nama Klien *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nama lengkap klien"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Company */}
              <div className="space-y-2">
                <Label htmlFor="company">Perusahaan (Opsional)</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Nama perusahaan"
                  disabled={isSubmitting}
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">Posisi/Jabatan (Opsional)</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Contoh: CEO, Manager, dll."
                  disabled={isSubmitting}
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Testimoni *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Apa kata klien tentang jasa Anda?"
                  rows={4}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (1-5 Bintang)</Label>
                <Select
                  value={formData.rating.toString()}
                  onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
                  required
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">⭐ (1 Bintang)</SelectItem>
                    <SelectItem value="2">⭐⭐ (2 Bintang)</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ (3 Bintang)</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ (4 Bintang)</SelectItem>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ (5 Bintang)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL Foto Klien (Opsional)</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/client-photo.jpg"
                  disabled={isSubmitting}
                />
              </div>

              {/* Featured */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4"
                  disabled={isSubmitting}
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Tampilkan di halaman utama (Featured)
                </Label>
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
