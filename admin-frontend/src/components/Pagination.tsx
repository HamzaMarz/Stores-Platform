import React from 'react'

type Props = {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<Props> = ({ page, pageSize, total, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const canPrev = page > 1
  const canNext = page < totalPages

  return (
    <div className="flex items-center justify-between gap-3 mt-3">
      <div className="text-sm text-slate-600">Page {page} of {totalPages} • {total} rows</div>
      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 border rounded disabled:opacity-50" disabled={!canPrev} onClick={() => onPageChange(page - 1)}>Prev</button>
        <button className="px-3 py-1.5 border rounded disabled:opacity-50" disabled={!canNext} onClick={() => onPageChange(page + 1)}>Next</button>
      </div>
    </div>
  )
}

export default Pagination


