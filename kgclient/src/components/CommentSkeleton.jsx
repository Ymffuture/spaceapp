import React from 'react'
import { Skeleton } from './ui/skeleton'

const CommentSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="flex items-start gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2 w-full">
            <Skeleton className="w-1/4 h-4" />
            <Skeleton className="w-3/4 h-6" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default CommentSkeleton
