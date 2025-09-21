import React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Categories, CategoryLabels } from '../../../constants/categories'
import { useEditProduct, type SellerProduct } from '../hooks/useSellerProducts'

type Props = {
  open: boolean
  product: SellerProduct | null
  onClose: () => void
  onSaved: () => Promise<void> | void
}

const schema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  category: z.string().optional(),
  price: z.coerce.number().min(0).optional(),
  discount: z.coerce.number().min(0).max(100).optional(),
  in_stock: z.boolean().optional(),
  thumbnail_image: z.unknown().optional(),
})

type FormValues = z.infer<typeof schema>

const EditProductModal: React.FC<Props> = ({ open, product, onClose, onSaved }) => {
  const editProduct = useEditProduct()
  const { register, handleSubmit, reset, watch } = useForm<FormValues>({ resolver: zodResolver(schema) as any })
  const values = watch()

  const parseImages = (imgs: SellerProduct['images']): string[] => {
    if (!imgs) return []
    if (Array.isArray(imgs)) return imgs
    try {
      const arr = JSON.parse(imgs as unknown as string)
      return Array.isArray(arr) ? arr : []
    } catch {
      return []
    }
  }

  const currentGallery = product ? parseImages(product.images) : []

  const [newImages, setNewImages] = React.useState<File[]>([])
  const [newPreviews, setNewPreviews] = React.useState<string[]>([])
  const [newThumbIdx, setNewThumbIdx] = React.useState<number | null>(null)
  const [viewerSrc, setViewerSrc] = React.useState<string | null>(null)
  const [isImporting, setIsImporting] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (open) {
      setNewImages([])
      setNewPreviews([])
      setNewThumbIdx(null)
      setViewerSrc(null)
      setIsImporting(false)
    }
  }, [open])

  React.useEffect(() => {
    const urls = newImages.map((f) => URL.createObjectURL(f))
    setNewPreviews(urls)
    if (newImages.length === 0) setNewThumbIdx(null)
    if (newImages.length > 0 && (newThumbIdx == null || newThumbIdx < 0 || newThumbIdx >= newImages.length)) {
      setNewThumbIdx(0)
    }
    return () => { urls.forEach((u) => URL.revokeObjectURL(u)) }
  }, [newImages])

  React.useEffect(() => {
    if (open && product) {
      reset({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        discount: product.discount,
        in_stock: product.in_stock,
      })
    }
  }, [open, product])

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && viewerSrc) {
        setViewerSrc(null)
      }
    }
    if (viewerSrc) {
      window.addEventListener('keydown', onKeyDown)
      return () => window.removeEventListener('keydown', onKeyDown)
    }
  }, [viewerSrc])

  if (!open || !product) return null

  const onAddNewImages: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const picked = Array.from(files)
    const valid = picked.filter((f) => f.type.startsWith('image/'))
    setNewImages((prev) => {
      const room = 10 - prev.length
      if (room <= 0) return prev
      const toAdd = valid.slice(0, room)
      return [...prev, ...toAdd]
    })
    e.currentTarget.value = ''
  }

  const urlToFile = async (url: string): Promise<File | null> => {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const type = blob.type || 'image/jpeg'
      const urlObj = new URL(url)
      const base = urlObj.pathname.split('/').pop() || `image_${Date.now()}`
      const name = base.includes('.') ? base : `${base}.jpg`
      return new File([blob], name, { type })
    } catch {
      return null
    }
  }

  const importOldImage = async (url: string) => {
    setIsImporting(true)
    const file = await urlToFile(url)
    if (file) {
      setNewImages((prev) => {
        const room = 10 - prev.length
        if (room <= 0) return prev
        return [...prev, file].slice(0, 10)
      })
    }
    setIsImporting(false)
  }

  const removeNewAt = (idx: number) => {
    setNewImages((prev) => {
      const next = prev.filter((_, i) => i !== idx)
      if (next.length === 0) setNewThumbIdx(null)
      else if (newThumbIdx != null && idx <= newThumbIdx) setNewThumbIdx(Math.max(0, newThumbIdx - 1))
      return next
    })
  }

  const hasChanges = () => {
    if (!product) return false
    return (
      (values.name !== undefined && values.name !== product.name) ||
      (values.description !== undefined && values.description !== product.description) ||
      (values.category !== undefined && values.category !== product.category) ||
      (values.price !== undefined && values.price !== product.price) ||
      (values.discount !== undefined && values.discount !== product.discount) ||
      (values.in_stock !== undefined && values.in_stock !== product.in_stock) ||
      (values.thumbnail_image && (values.thumbnail_image as any)?.length > 0) ||
      newImages.length > 0
    )
  }

  const StarIcon: React.FC<{ filled?: boolean }> = ({ filled }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9" />
    </svg>
  )

  const XIcon: React.FC = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  )

  const PlusIcon: React.FC = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  )

  return (
    <div className="grid fixed inset-0 z-50 place-items-center p-4 bg-black/40">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h3 className="font-semibold">Edit product #{product.id}</h3>
          <button onClick={onClose} className="rounded-md border px-3 py-1.5">Close</button>
        </div>
        <form
          onSubmit={handleSubmit(async (v) => {
            if (newImages.length > 0) {
              const ok = window.confirm('You have changed images. All old images will be removed and replaced with the new set. Proceed?')
              if (!ok) return
            }
            const thumbFromNew = (newThumbIdx != null && newImages[newThumbIdx]) ? newImages[newThumbIdx] : undefined
            const thumbFromField = (v.thumbnail_image as any)?.[0] as File | undefined
            await editProduct.mutateAsync({
              id: product.id,
              name: v.name !== product.name ? v.name : undefined,
              description: v.description !== product.description ? v.description : undefined,
              category: v.category !== product.category ? v.category : undefined,
              price: v.price !== product.price ? v.price : undefined,
              discount: v.discount !== product.discount ? v.discount : undefined,
              in_stock: v.in_stock !== product.in_stock ? v.in_stock : undefined,
              thumbnail_image: thumbFromNew ?? thumbFromField,
              images: newImages.length > 0 ? newImages : undefined,
            })
            await onSaved()
            onClose()
          })}
        >
          <div className="p-4 grid grid-cols-[1fr_2fr] gap-6 items-start">
            {/* Left: pictures */}
            <div>
              <div>
                <div className="text-sm font-medium text-gray-700">Current</div>
                <div className="flex gap-2 items-start mt-2">
                  <div className={`relative w-[50px] h-[50px] border rounded overflow-hidden ${newImages.length > 0 ? 'ring-2 ring-rose-400' : ''}`} onClick={() => setViewerSrc(product.thumbnail_image)}>
                    <img src={product.thumbnail_image} alt="thumb" className="object-cover w-full h-full" />
                    <button type="button" title="Add to new" disabled={isImporting || newImages.length >= 10} onClick={(e) => { e.stopPropagation(); importOldImage(product.thumbnail_image) }} className="absolute -top-1 -left-1 bg-white rounded-full border p-0.5 shadow text-gray-700 disabled:opacity-50">
                      <PlusIcon />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentGallery.map((src, i) => (
                      <div key={i} className={`relative w-[50px] h-[50px] border rounded overflow-hidden ${newImages.length > 0 ? 'ring-2 ring-rose-400' : ''}`} onClick={() => setViewerSrc(src)}>
                        <img src={src} alt={`img-${i}`} className="object-cover w-full h-full" />
                        <button type="button" title="Add to new" disabled={isImporting || newImages.length >= 10} onClick={(e) => { e.stopPropagation(); importOldImage(src) }} className="absolute -top-1 -left-1 bg-white rounded-full border p-0.5 shadow text-gray-700 disabled:opacity-50">
                          <PlusIcon />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                {newImages.length > 0 && (
                  <div className="mt-2 text-xs text-rose-600">You have changed images. All old images will be removed.</div>
                )}
              </div>

              <div className="mt-4">
                <div className="text-sm font-medium text-gray-700">New thumbnail (optional)</div>
                <input type="file" accept="image/*" {...register('thumbnail_image')} className="mt-1 w-full rounded-md border px-3 py-1.5" />
              </div>

              <div className="mt-4">
                <div className="text-sm font-medium text-gray-700">New gallery (replaces current)</div>
                <div className="flex gap-2 items-center mt-2">
                  {newImages.length < 10 && (
                    <input type="file" accept="image/*" multiple onChange={onAddNewImages} className="rounded-md border px-3 py-1.5" />
                  )}
                  <span className="text-xs text-gray-600">{newImages.length}/10</span>
                </div>
                {newPreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newPreviews.map((src, i) => (
                      <div key={i} className="relative w-[50px] h-[50px] border rounded overflow-hidden" onClick={() => setViewerSrc(src)}>
                        <img src={src} alt={`new-${i}`} className="object-cover w-full h-full" />
                        <button type="button" aria-label="Remove" onClick={(e) => { e.stopPropagation(); removeNewAt(i) }} className="absolute -top-1 -right-1 bg-white rounded-full border p-0.5 text-gray-700 shadow">
                          <XIcon />
                        </button>
                        <button type="button" aria-label="Make thumbnail" onClick={(e) => { e.stopPropagation(); setNewThumbIdx(i) }} className={`absolute -top-1 -left-1 bg-white rounded-full border p-0.5 shadow ${newThumbIdx === i ? 'text-amber-500' : 'text-gray-700'}`}>
                          <StarIcon filled={newThumbIdx === i} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700">Name</label>
                <input defaultValue={product.name} {...register('name')} className="px-3 py-2 mt-1 w-full rounded-md border" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Category</label>
                <select defaultValue={product.category} {...register('category')} className="px-3 py-2 mt-1 w-full rounded-md border">
                  {Categories.map((c) => (<option key={c} value={c}>{CategoryLabels[c]}</option>))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Price</label>
                <input type="number" step="0.01" defaultValue={product.price} {...register('price')} className="px-3 py-2 mt-1 w-full rounded-md border" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Discount (%)</label>
                <input type="number" step="1" defaultValue={product.discount} {...register('discount')} className="px-3 py-2 mt-1 w-full rounded-md border" />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea defaultValue={product.description} {...register('description')} className="px-3 py-2 mt-1 w-full rounded-md border" />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700">In stock</label>
                <input type="checkbox" defaultChecked={product.in_stock} {...register('in_stock')} className="ml-2" />
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end items-center px-4 py-3 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">Discard</button>
            <button type="submit" disabled={!hasChanges() || editProduct.isPending || isImporting} className="px-4 py-2 text-white bg-gray-900 rounded-md disabled:opacity-60">
              {editProduct.isPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>

      {viewerSrc && (
        <div className="fixed inset-0 z-[60] bg-black/80 grid place-items-center p-6" onClick={() => setViewerSrc(null)}>
          <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img src={viewerSrc} alt="preview" className="max-w-full max-h-[90vh] object-contain" />
            <button onClick={() => setViewerSrc(null)} className="absolute -top-3 -right-3 p-1 bg-white rounded-full border shadow">
              <XIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditProductModal


