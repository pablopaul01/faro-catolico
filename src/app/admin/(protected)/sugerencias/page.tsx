'use client'

import { useEffect, useState, useMemo } from 'react'
import { Mail, MailOpen, Trash2 } from 'lucide-react'
import {
  fetchAllContactMessages,
  markContactMessageRead,
  deleteContactMessage,
} from '@/services/contactMessages.service'
import type { ContactMessage } from '@/types/app.types'

type Filter = 'todos' | 'no_leido' | 'leido'

export default function AdminContactoPage() {
  const [messages,  setMessages]  = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter,    setFilter]    = useState<Filter>('todos')

  useEffect(() => {
    fetchAllContactMessages()
      .then(setMessages)
      .finally(() => setIsLoading(false))
  }, [])

  const filtered = useMemo(() => {
    if (filter === 'todos') return messages
    return messages.filter((m) => m.status === filter)
  }, [messages, filter])

  const handleMarkRead = async (id: string) => {
    await markContactMessageRead(id)
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'leido' } : m))
    )
  }

  const handleDelete = async (id: string) => {
    await deleteContactMessage(id)
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }

  const unreadCount = messages.filter((m) => m.status === 'no_leido').length

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-1">Mensajes de contacto</h1>
      <p className="text-light/50 text-sm mb-6">
        Mensajes enviados desde la página de contacto
        {unreadCount > 0 && (
          <span className="ml-2 px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium">
            {unreadCount} no leído{unreadCount > 1 ? 's' : ''}
          </span>
        )}
      </p>

      <div className="flex gap-2 mb-6">
        {([
          { value: 'todos',    label: 'Todos' },
          { value: 'no_leido', label: 'No leídos' },
          { value: 'leido',    label: 'Leídos' },
        ] as { value: Filter; label: string }[]).map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-1.5 rounded-sm text-sm transition-colors ${
              filter === value
                ? 'bg-accent text-primary font-semibold'
                : 'border border-border text-light/50 hover:text-light'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-secondary rounded-sm animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-light/30">
          <Mail size={36} />
          <p>No hay mensajes{filter !== 'todos' ? ` ${filter === 'no_leido' ? 'sin leer' : 'leídos'}` : ''}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => (
            <div
              key={m.id}
              className={`bg-secondary border rounded-sm p-4 flex flex-col sm:flex-row sm:items-start gap-3 transition-colors ${
                m.status === 'no_leido' ? 'border-accent/30' : 'border-border'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  {m.status === 'no_leido' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30">
                      Nuevo
                    </span>
                  )}
                  {m.subject && (
                    <p className="text-light text-sm font-medium truncate">{m.subject}</p>
                  )}
                </div>

                <p className="text-light/70 text-sm leading-relaxed line-clamp-3">{m.message}</p>

                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-light/30">
                  {m.name  && <span>👤 {m.name}</span>}
                  {m.email && <span>✉ {m.email}</span>}
                  <span>{new Date(m.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {m.status === 'no_leido' && (
                  <button
                    onClick={() => handleMarkRead(m.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-sm border border-accent/30 text-accent hover:bg-accent/10 transition-colors"
                    title="Marcar como leído"
                  >
                    <MailOpen size={13} />
                    Leído
                  </button>
                )}
                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-1.5 text-light/30 hover:text-red-400 hover:bg-red-900/10 rounded-sm transition-colors"
                  title="Eliminar"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
