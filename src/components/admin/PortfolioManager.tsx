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
  Image as ImageIcon,
  ExternalLink,
  Loader2,
  X
} from 'lucide-react'

interface Portfolio {
  id: string
  title: string
  description: string
  technologies: string
  imageUrl?: string
  projectUrl?: string
  category: string
  featured: boolean
  createdAt: string
}

interface PortfolioManagerProps {
  initialData?: Portfolio[]
}

export default function PortfolioManager({ initialData = [] }: PortfolioManagerProps) {
  const [items, setItems] = useState<Portfolio[]>(initialData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Portfolio | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    imageUrl: '',
    projectUrl: '',
    category: '',
    featured: false
  })

  const fetchPortfolio = async () => {
    try {
      const response = await fetch('/api/portfolio')
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error('Fetch portfolio error:', error)
    }
  }

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const handleEdit = (item: Portfolio) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description,
      technologies: item.technologies,
      imageUrl: item.imageUrl || '',
      projectUrl: item.projectUrl || '',
      category: item.category,
      featured: item.featured
    })
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({
      title: '',
      description: '',
      technologies: '',
      imageUrl: '',
      projectUrl: '',
      category: '',
      featured: false
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingItem
        ? `/api/portfolio/${editingItem.id}`
        : '/api/portfolio'

      const response = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchPortfolio()
        setIsDialogOpen(false)
        setEditingItem(null)
      } else {
        alert(editingItem ? 'Gagal mengupdate portfolio' : 'Gagal menambah portfolio')
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('Terjadi kesalahan saat menyimpan portfolio')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus "${title}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setItems(items.filter(item => item.id !== id))
      } else {
        alert('Gagal menghapus portfolio')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Terjadi kesalahan saat menghapus portfolio')
    }
  }

  const handleClose = () => {
    setIsDialogOpen(false)
    setEditingItem(null)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Portfolio Projects</h2>
          <p className="text-slate-600">Kelola project portfolio website</p>
        </div>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Project
        </Button>
      </div>

      {/* Items List */}
      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">Belum ada project portfolio</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <Card key={item.id} className="transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      {item.featured && <Badge className="bg-primary text-white">Featured</Badge>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{item.category}</Badge>
                      {item.technologies.split(',').map((tech, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tech.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id, item.title)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-slate-700">{item.description}</p>

                {item.imageUrl && (
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-600 break-all">{item.imageUrl}</span>
                  </div>
                )}

                {item.projectUrl && (
                  <a
                    href={item.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Lihat Project
                  </a>
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
              {editingItem ? 'Edit Project Portfolio' : 'Tambah Project Portfolio Baru'}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update detail project yang ada' : 'Tambahkan project portfolio baru ke website'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Judul Project *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Sistem Informasi Penjualan"
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
                  placeholder="Deskripsi singkat tentang project ini..."
                  rows={3}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Kategori *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="E-Commerce">E-Commerce</SelectItem>
                    <SelectItem value="Mobile App">Mobile App</SelectItem>
                    <SelectItem value="Inventory System">Inventory System</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Expert System">Expert System</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Company Profile">Company Profile</SelectItem>
                    <SelectItem value="Landing Page">Landing Page</SelectItem>
                    <SelectItem value="Other">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Technologies */}
              <div className="space-y-2">
                <Label htmlFor="technologies">Teknologi *</Label>
                <Input
                  id="technologies"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="Laravel, MySQL, PHP, JavaScript (pisahkan dengan koma)"
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-slate-500">Pisahkan teknologi dengan koma</p>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL Gambar Project (Opsional)</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  disabled={isSubmitting}
                />
              </div>

              {/* Project URL */}
              <div className="space-y-2">
                <Label htmlFor="projectUrl">URL Project (Opsional)</Label>
                <Input
                  id="projectUrl"
                  value={formData.projectUrl}
                  onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                  placeholder="https://github.com/username/repo"
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
                onClick={handleClose}
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
