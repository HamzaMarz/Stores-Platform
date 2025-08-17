import React from 'react'

type Props = { className?: string }

const Skeleton: React.FC<Props> = ({ className }) => {
	return <div className={`animate-pulse rounded-md bg-gray-200 ${className || ''}`} />
}

export default Skeleton

