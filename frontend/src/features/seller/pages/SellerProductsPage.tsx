import React from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAddProduct, useListSellerProducts, useListUnlistedSellerProducts, useSearchSellerProducts, useToggleListing } from '../hooks/useSellerProducts'
import { useToast } from '../../../hooks/useToast'
import { ProductCategories } from '../../../constants/product'
import EditProductModal from '../components/EditProductModal'
import type { SellerProduct } from '../types'

const schema = z.object({
	name: z.string().min(3),
	description: z.string().min(10),
	category: z.string().min(2),
	price: z.number().min(0),
})

type FormValues = z.infer<typeof schema>

const SellerProductsPage: React.FC = () => {
	const { show } = useToast()
	const [tab, setTab] = React.useState<'listed' | 'unlisted' | 'search'>('listed')
	const [addMode, setAddMode] = React.useState<boolean>(false)
	const [pagination, setPagination] = React.useState({ offset: 0, limit: 10 })
	const listQuery = useListSellerProducts({ category: 'all', discount: false, offset: pagination.offset, limit: pagination.limit, order: { column: 'id', direction: 'desc' } })
	const unlistedQuery = useListUnlistedSellerProducts({ category: 'all', discount: false, offset: pagination.offset, limit: pagination.limit, order: { column: 'id', direction: 'desc' } })
	const [searchTerm, setSearchTerm] = React.useState('')
	// Filters
	const [searchCategory, setSearchCategory] = React.useState<'all' | typeof ProductCategories[number]>('all')
	const [onlyInStock, setOnlyInStock] = React.useState(false)
	const [priceMin, setPriceMin] = React.useState('')
	const [priceMax, setPriceMax] = React.useState('')
	const [discountMin, setDiscountMin] = React.useState('')
	const [discountMax, setDiscountMax] = React.useState('')
	const [orderBy, setOrderBy] = React.useState<'rating' | 'sell_count' | 'id' | 'price' | 'name'>('id')
	const [orderDir, setOrderDir] = React.useState<'asc' | 'desc'>('desc')

	const searchParams = React.useMemo(() => {
		const price = priceMin !== '' && priceMax !== '' && !Number.isNaN(Number(priceMin)) && !Number.isNaN(Number(priceMax))
			? { min: Number(priceMin), max: Number(priceMax) } : undefined
		const discount = discountMin !== '' && discountMax !== '' && !Number.isNaN(Number(discountMin)) && !Number.isNaN(Number(discountMax))
			? { min: Number(discountMin), max: Number(discountMax) } : undefined
		return {
			term: searchTerm || undefined,
			category: searchCategory,
			in_stock: onlyInStock ? true : undefined,
			price,
			discount,
			offset: pagination.offset,
			limit: pagination.limit,
			order: { column: orderBy, direction: orderDir },
		}
	}, [searchTerm, searchCategory, onlyInStock, priceMin, priceMax, discountMin, discountMax, pagination.offset, pagination.limit, orderBy, orderDir])

	const searchEnabled = React.useMemo(() => {
		return Boolean((searchTerm && searchTerm.trim().length > 0) || onlyInStock || priceMin || priceMax || discountMin || discountMax || searchCategory !== 'all')
	}, [searchTerm, onlyInStock, priceMin, priceMax, discountMin, discountMax, searchCategory])

	const searchQuery = useSearchSellerProducts(searchParams as any, tab === 'search' && searchEnabled)
	const addProduct = useAddProduct()
	const { enlist, unlist } = useToggleListing()

	const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) })

	const [images, setImages] = React.useState<File[]>([])
	const [previews, setPreviews] = React.useState<string[]>([])
	const [thumbnailIdx, setThumbnailIdx] = React.useState<number>(0)
	const [editing, setEditing] = React.useState<SellerProduct | null>(null)

	React.useEffect(() => {
		const nextPreviews = images.map((f) => URL.createObjectURL(f))
		setPreviews(nextPreviews)
		if (images.length > 0 && (thumbnailIdx < 0 || thumbnailIdx >= images.length)) {
			setThumbnailIdx(0)
		}
		return () => {
			nextPreviews.forEach((u) => URL.revokeObjectURL(u))
		}
	}, [images])

	const onAddImage: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		const fileList = e.target.files
		if (!fileList || fileList.length === 0) return
		const picked: File[] = Array.from(fileList)
		const valid = picked.filter((f) => f.type.startsWith('image/'))
		if (valid.length !== picked.length) {
			show({ title: 'Only images are allowed', tone: 'error' })
		}
		setImages((prev) => {
			const room = 10 - prev.length
			if (room <= 0) {
				show({ title: 'Maximum 10 images allowed', tone: 'error' })
				return prev
			}
			const toAdd = valid.slice(0, room)
			if (valid.length > room) {
				show({ title: 'Some images were not added (limit 10)', tone: 'error' })
			}
			return [...prev, ...toAdd]
		})
		e.currentTarget.value = ''
	}

	const removeAt = (idx: number) => {
		setImages((prev) => {
			const next = prev.filter((_, i) => i !== idx)
			if (next.length === 0) {
				setThumbnailIdx(0)
				return next
			}
			if (idx === thumbnailIdx) {
				setThumbnailIdx(0)
			} else if (idx < thumbnailIdx) {
				setThumbnailIdx((i) => Math.max(0, i - 1))
			}
			return next
		})
	}

	const currentList = tab === 'listed' ? (listQuery.data?.items ?? []) : tab === 'unlisted' ? (unlistedQuery.data?.items ?? []) : (searchQuery.data?.items ?? [])
	const currentCount = tab === 'listed' ? listQuery.data?.count : tab === 'unlisted' ? unlistedQuery.data?.count : searchQuery.data?.count

	const unlistedIdSet = React.useMemo(() => new Set((unlistedQuery.data?.items ?? []).map((i) => i.id)), [unlistedQuery.data?.items])

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold">Products</h2>
				{!addMode && (
					<button onClick={() => setAddMode(true)} className="rounded-md bg-gray-900 text-white px-4 py-2">Add product</button>
				)}
			</div>

			{addMode ? (
				<div className="rounded-xl border bg-white p-6 shadow-sm">
					<h3 className="font-medium mb-4">Add product</h3>
					<form
						onFocusCapture={() => setAddMode(true)}
						onSubmit={handleSubmit(async (values) => {
							try {
								if (images.length === 0) {
									show({ title: 'Please add at least one picture', tone: 'error' })
									return
								}
								const thumbnail_image = images[thumbnailIdx]
								const gallery = images.filter((_, i) => i !== thumbnailIdx)
								const payload = {
									name: values.name,
									description: values.description,
									thumbnail_image,
									images: gallery,
									category: values.category,
									price: values.price,
								}
								await addProduct.mutateAsync(payload)
								await Promise.all([listQuery.refetch(), unlistedQuery.refetch(), (tab === 'search' ? searchQuery.refetch() : Promise.resolve())])
								reset()
								setImages([])
								show({ title: 'Product added', tone: 'success' })
								setAddMode(false)
							} catch (e: any) {
								show({ title: e?.message || 'Failed to add product', tone: 'error' })
							}
						})}
						className="grid grid-cols-2 gap-3"
					>
						<input {...register('name')} placeholder="Name" className="rounded-md border px-3 py-2" />
						<select {...register('category')} className="rounded-md border px-3 py-2">
							<option value="">Select category</option>
							{ProductCategories.map((c) => (
								<option key={c} value={c}>{c}</option>
							))}
						</select>
						<input {...register('price', { valueAsNumber: true })} type="number" step="0.01" placeholder="Price" className="rounded-md border px-3 py-2" />

						<div className="col-span-2">
							<div className="flex items-center justify-between mb-2">
								<label className="text-sm font-medium text-gray-700">Pictures ({images.length}/10)</label>
								{images.length < 10 && (
									<input type="file" accept="image/*" multiple onChange={onAddImage} className="rounded-md border px-3 py-1.5" />
								)}
							</div>
							<div className="flex flex-wrap gap-3">
								{previews.map((src, i) => (
									<div key={i} className="relative w-[200px] h-[200px] rounded-md border overflow-hidden">
										<img src={src} alt={`preview-${i}`} className="w-full h-full object-cover" />
										<button type="button" onClick={() => removeAt(i)} className="absolute top-1 right-1 rounded bg-white/90 px-2 py-0.5 text-xs border">Remove</button>
										<label className="absolute top-1 left-1 flex items-center gap-1 bg-white/90 px-2 py-0.5 rounded text-xs border">
											<input type="radio" name="thumbnail" checked={thumbnailIdx === i} onChange={() => setThumbnailIdx(i)} />
											<span>{thumbnailIdx === i ? 'Thumbnail' : 'Make thumbnail'}</span>
										</label>
									</div>
								))}
							</div>
						</div>

						<textarea {...register('description')} placeholder="Description" className="rounded-md border px-3 py-2 col-span-2" />
						<div className="col-span-2 flex items-center gap-2">
							<button type="submit" disabled={addProduct.isPending} className="rounded-md bg-gray-900 text-white px-4 py-2 disabled:opacity-60">Add</button>
							<button type="button" onClick={() => { reset(); setImages([]); setAddMode(false) }} className="rounded-md border px-4 py-2">Discard</button>
							{Object.values(errors)[0]?.message && <span className="text-xs text-rose-600">{Object.values(errors)[0]?.message as any}</span>}
						</div>
					</form>
				</div>
			) : (
				<>
					<div className="flex flex-wrap items-center gap-2">
						<button onClick={() => setTab('listed')} className={`rounded-md px-3 py-1.5 border ${tab === 'listed' ? 'bg-gray-900 text-white' : ''}`}>Listed</button>
						<button onClick={() => setTab('unlisted')} className={`rounded-md px-3 py-1.5 border ${tab === 'unlisted' ? 'bg-gray-900 text-white' : ''}`}>Unlisted</button>
						<div className="ml-auto flex items-center gap-2">
							<input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search products (optional)" className="rounded-md border px-3 py-1.5" />
							<select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value as any)} className="rounded-md border px-2 py-1.5">
								<option value="all">All</option>
								{ProductCategories.map((c) => (<option key={c} value={c}>{c}</option>))}
							</select>
							<label className="flex items-center gap-1 text-sm">
								<input type="checkbox" checked={onlyInStock} onChange={(e) => setOnlyInStock(e.target.checked)} />
								<span>In stock</span>
							</label>
							<input value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="Min $" className="w-24 rounded-md border px-2 py-1.5" />
							<input value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="Max $" className="w-24 rounded-md border px-2 py-1.5" />
							<input value={discountMin} onChange={(e) => setDiscountMin(e.target.value)} placeholder="Min %" className="w-20 rounded-md border px-2 py-1.5" />
							<input value={discountMax} onChange={(e) => setDiscountMax(e.target.value)} placeholder="Max %" className="w-20 rounded-md border px-2 py-1.5" />
							<select value={orderBy} onChange={(e) => setOrderBy(e.target.value as any)} className="rounded-md border px-2 py-1.5">
								<option value="id">ID</option>
								<option value="name">Name</option>
								<option value="price">Price</option>
								<option value="rating">Rating</option>
								<option value="sell_count">Sells</option>
							</select>
							<select value={orderDir} onChange={(e) => setOrderDir(e.target.value as any)} className="rounded-md border px-2 py-1.5">
								<option value="desc">Desc</option>
								<option value="asc">Asc</option>
							</select>
							<button onClick={() => { setTab('search'); setPagination((p) => ({ ...p, offset: 0 })) }} disabled={!searchEnabled} className="rounded-md border px-3 py-1.5 disabled:opacity-60">Search</button>
						</div>
					</div>

					<div className="rounded-xl border bg-white p-4 shadow-sm">
						<div className="overflow-x-auto">
							<table className="min-w-full text-sm">
								<thead>
									<tr className="text-left text-gray-600">
										<th className="p-2">ID</th>
										<th className="p-2">Product</th>
										<th className="p-2">Price</th>
										<th className="p-2">Stock</th>
										<th className="p-2">Status</th>
										<th className="p-2 text-right">Actions</th>
									</tr>
								</thead>
								<tbody>
									{currentList.map((p) => {
										const isUnlisted = tab === 'unlisted' ? true : tab === 'listed' ? false : unlistedIdSet.has(p.id)
										return (
										<tr key={p.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => setEditing(p)}>
											<td className="p-2">{p.id}</td>
											<td className="p-2 flex items-center gap-3">
												<img src={p.thumbnail_image} alt="thumb" className="h-10 w-10 rounded object-cover" />
												<div>
													<div className="font-medium">{p.name}</div>
													<div className="text-xs text-gray-500">{p.category}</div>
												</div>
											</td>
											<td className="p-2">${p.price.toFixed(2)}</td>
											<td className="p-2">{p.in_stock ? 'In stock' : 'Out of stock'}</td>
											<td className="p-2">{isUnlisted ? 'Unlisted' : 'Listed'}</td>
											<td className="p-2 text-right" onClick={(e) => e.stopPropagation()}>
												<div className="flex justify-end gap-2">
													{isUnlisted ? (
														<button onClick={async () => { await enlist.mutateAsync(p.id); await listQuery.refetch(); await unlistedQuery.refetch(); if (tab === 'search') await searchQuery.refetch() }} className="rounded-md border px-3 py-1.5">Enlist</button>
													) : (
														<button onClick={async () => { await unlist.mutateAsync(p.id); await listQuery.refetch(); await unlistedQuery.refetch(); if (tab === 'search') await searchQuery.refetch() }} className="rounded-md border px-3 py-1.5">Unlist</button>
													)}
												</div>
											</td>
										</tr>
									)})}
								</tbody>
							</table>
						</div>
						<div className="flex justify-between items-center mt-4">
							<button disabled={pagination.offset === 0} onClick={() => setPagination((p) => ({ ...p, offset: Math.max(0, p.offset - p.limit) }))} className="rounded-md border px-3 py-1.5 disabled:opacity-60">Prev</button>
							<div className="text-xs text-gray-600">Total: {currentCount ?? 0}</div>
							<button onClick={() => setPagination((p) => ({ ...p, offset: p.offset + p.limit }))} className="rounded-md border px-3 py-1.5">Next</button>
						</div>
					</div>
					<EditProductModal
						open={Boolean(editing)}
						product={editing}
						onClose={() => setEditing(null)}
						onSaved={async () => { await Promise.all([listQuery.refetch(), unlistedQuery.refetch(), (tab === 'search' ? searchQuery.refetch() : Promise.resolve())]) }}
					/>
				</>
			)}
		</div>
	)
}

export default SellerProductsPage


