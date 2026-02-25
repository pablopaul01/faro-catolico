'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Star } from 'lucide-react'
import { submitRating } from '@/services/ratings.service'
import type { RatingStats } from '@/types/app.types'

interface StarRatingProps {
  contentType:  'pelicula' | 'libro' | 'cancion'
  contentId:    string
  avgRating?:   number
  ratingCount?: number
}

export function StarRating({
  contentType,
  contentId,
  avgRating   = 0,
  ratingCount = 0,
}: StarRatingProps) {
  const router     = useRouter()
  const storageKey = `rated_${contentType}_${contentId}`
  const [myVote,    setMyVote]    = useState<number | null>(null)
  const [localAvg,  setLocalAvg]  = useState(avgRating)
  const [localCount,setLocalCount]= useState(ratingCount)
  const [hover,     setHover]     = useState(0)
  const [loading,   setLoading]   = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) setMyVote(Number(stored))
  }, [storageKey])

  const handleRate = async (star: number) => {
    if (loading || star === myVote) return
    setLoading(true)
    try {
      await submitRating(contentType, contentId, star)
      localStorage.setItem(storageKey, String(star))
      if (myVote !== null) {
        // Cambio de voto: el conteo no varía, solo se ajusta el promedio
        setLocalAvg((localAvg * localCount - myVote + star) / localCount)
      } else {
        // Primer voto: el conteo sube en 1
        const newCount = localCount + 1
        setLocalCount(newCount)
        setLocalAvg((localAvg * localCount + star) / newCount)
      }
      setMyVote(star)
      router.refresh()
    } catch (err) {
      console.error('Error al guardar rating:', err)
    } finally {
      setLoading(false)
    }
  }

  const displayStars = hover > 0 ? hover : (myVote ?? Math.round(localAvg))

  return (
    <div className="flex flex-col gap-1">
      <div
        className="flex gap-0.5"
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={loading}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHover(star)}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`${myVote !== null ? 'Cambiar a' : 'Votar'} ${star} estrella${star > 1 ? 's' : ''}`}
          >
            <Star
              size={14}
              className={
                star <= displayStars
                  ? 'fill-accent text-accent'
                  : 'fill-transparent text-light/20'
              }
            />
          </button>
        ))}
      </div>
      <p className="text-[10px] text-light/40 leading-none">
        {localCount > 0
          ? `${localAvg.toFixed(1)} · ${localCount} ${localCount === 1 ? 'voto' : 'votos'}`
          : 'Sin votos aún'}
        {myVote !== null && (
          <span className="ml-1 text-accent/70">(tu voto: {myVote})</span>
        )}
      </p>
    </div>
  )
}
