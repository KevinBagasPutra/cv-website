'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import {
  Plus,
  Edit,
  Trash2,
  Home,
  Briefcase,
  MessageSquare,
  Users
} from 'lucide-react'

export default function AdminPage() {
  const [contacts, setContacts] = useState<any[]>([])
  const [portfolio, setPortfolio] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true)
      const [contactsRes, portfolioRes, servicesRes, testimonialsRes] = await Promise.all([
        fetch('/api/contact'),
        fetch('/api/portfolio'),
        fetch('/api/services'),
        fetch('/api/testimonials')
      ])

      setContacts(await contactsRes.json())
      setPortfolio(await portfolioRes.json())
      setServices(await servicesRes.json())
      setTestimonials(await testimonialsRes.json())
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useState(() => {
    fetchData()
  })

  const handleDelete = async (type: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const response = await fetch(`/api/${type}/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Item deleted successfully'
        })
        fetchData()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-slate-600">Manage your website content</p>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              <Home className="h-4 w-4 mr-2" />
              Back to Website
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="contacts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="contacts">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contacts ({contacts.length})
            </TabsTrigger>
            <TabsTrigger value="portfolio">
              <Briefcase className="h-4 w-4 mr-2" />
              Portfolio ({portfolio.length})
            </TabsTrigger>
            <TabsTrigger value="services">
              <Users className="h-4 w-4 mr-2" />
              Services ({services.length})
            </TabsTrigger>
            <TabsTrigger value="testimonials">
              <MessageSquare className="h-4 w-4 mr-2" />
              Testimonials ({testimonials.length})
            </TabsTrigger>
          </TabsList>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Contact Form Submissions</CardTitle>
                <CardDescription>Manage messages from contact form</CardDescription>
              </CardHeader>
              <CardContent>
                {contacts.length === 0 ? (
                  <p className="text-center py-8 text-slate-600">No contacts yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Website Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell className="font-medium">{contact.name}</TableCell>
                          <TableCell>{contact.email}</TableCell>
                          <TableCell>{contact.websiteType}</TableCell>
                          <TableCell>
                            <Badge variant={contact.status === 'completed' ? 'default' : 'secondary'}>
                              {contact.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(contact.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedItem(contact) || setIsDialogOpen(true)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Portfolio Projects</CardTitle>
                    <CardDescription>Manage your portfolio items</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Project</DialogTitle>
                        <DialogDescription>Fill in the project details</DialogDescription>
                      </DialogHeader>
                      <form className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Title</label>
                          <Input placeholder="Project title" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Description</label>
                          <Textarea placeholder="Project description" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Technologies (comma separated)</label>
                          <Input placeholder="Laravel, MySQL, PHP" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Category</label>
                          <Input placeholder="E-Commerce" />
                        </div>
                        <Button type="button" className="w-full">Create Project</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {portfolio.length === 0 ? (
                  <p className="text-center py-8 text-slate-600">No portfolio items yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Technologies</TableHead>
                        <TableHead>Featured</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {portfolio.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.title}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {item.technologies?.split(',').map((tech: string, i: number) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {tech.trim()}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            {item.featured && <Badge>Featured</Badge>}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete('portfolio', item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Services</CardTitle>
                    <CardDescription>Manage your freelance services</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Service
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Service</DialogTitle>
                        <DialogDescription>Fill in the service details</DialogDescription>
                      </DialogHeader>
                      <form className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Title</label>
                          <Input placeholder="Service title" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Description</label>
                          <Textarea placeholder="Service description" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Price</label>
                          <Input placeholder="Mulai Rp 3.000.000" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Features (comma separated)</label>
                          <Textarea placeholder="Feature 1, Feature 2, Feature 3" />
                        </div>
                        <Button type="button" className="w-full">Create Service</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {services.length === 0 ? (
                  <p className="text-center py-8 text-slate-600">No services yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Features</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {services.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell className="font-medium">{service.title}</TableCell>
                          <TableCell>{service.price}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1 max-w-md">
                              {service.features?.split(',').slice(0, 3).map((feature: string, i: number) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {feature.trim()}
                                </Badge>
                              ))}
                              {service.features?.split(',').length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{service.features.split(',').length - 3}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {service.active ? <Badge className="bg-green-600">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete('services', service.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Testimonials</CardTitle>
                    <CardDescription>Manage client testimonials</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Testimonial
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Testimonial</DialogTitle>
                        <DialogDescription>Fill in the testimonial details</DialogDescription>
                      </DialogHeader>
                      <form className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Client Name</label>
                          <Input placeholder="John Doe" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Company (Optional)</label>
                          <Input placeholder="Company Name" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Role (Optional)</label>
                          <Input placeholder="CEO / Manager" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Testimonial Content</label>
                          <Textarea placeholder="What did the client say?" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Rating</label>
                          <Input type="number" min="1" max="5" defaultValue={5} />
                        </div>
                        <Button type="button" className="w-full">Create Testimonial</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {testimonials.length === 0 ? (
                  <p className="text-center py-8 text-slate-600">No testimonials yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Featured</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testimonials.map((testimonial) => (
                        <TableRow key={testimonial.id}>
                          <TableCell className="font-medium">{testimonial.name}</TableCell>
                          <TableCell>{testimonial.company}</TableCell>
                          <TableCell>
                            {'★'.repeat(testimonial.rating)}
                          </TableCell>
                          <TableCell>
                            {testimonial.featured && <Badge>Featured</Badge>}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete('testimonials', testimonial.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
