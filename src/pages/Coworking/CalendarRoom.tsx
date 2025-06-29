import { Availability, useAvaliabilityRoomsByRoomId } from '@/hooks/availabilityRoom/useAvaliabilityRoomsByRoomId'
import { useState } from 'react'
import SelectAppointment from './SelectAppointment'

interface CalendarRoomProps {
  roomId: string
}

const CalendarRoom = ({ roomId }: CalendarRoomProps) => {
  const { data: availabilities, isLoading } = useAvaliabilityRoomsByRoomId(roomId)
  const [selectedAvailability, setSelectedAvailability] = useState<Availability | null>(null)

  // Función para generar días del mes
  const generateCalendarDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDay = firstDay.getDay()
    const days = []
    
    for (let i = 0; i < startDay; i++) days.push(null)
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i))
    
    return days
  }

  // Obtener meses únicos con disponibilidad
  const getMonthsWithAvailability = () => {
    const monthsMap = new Map<string, Availability[]>()
    
    availabilities?.forEach(avail => {
      // Parsear la fecha sin considerar la zona horaria
      const dateParts = avail.date_all.split('-').map(Number)
      const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
      const monthYearKey = `${date.getFullYear()}-${date.getMonth()}`
      
      if (!monthsMap.has(monthYearKey)) {
        monthsMap.set(monthYearKey, [])
      }
      monthsMap.get(monthYearKey)?.push(avail)
    })
    
    return monthsMap
  }

  if (isLoading) return <div className="p-4 text-center">Cargando disponibilidad...</div>
  if (!availabilities || availabilities.length === 0) return <div className="p-4 text-center">No hay disponibilidad registrada</div>

  const monthsWithAvailability = getMonthsWithAvailability()

  return (
    <div className="space-y-8 p-4">
      {/* Calendarios */}
      {Array.from(monthsWithAvailability.entries()).map(([monthKey, monthAvailabilities]) => {
        const [year, month] = monthKey.split('-').map(Number)
        const calendarDays = generateCalendarDays(year, month)
        const monthName = new Date(year, month).toLocaleDateString('es-ES', {
          month: 'long',
          year: 'numeric'
        }).toUpperCase()

        const availabilityMap = new Map<string, Availability>()
        monthAvailabilities.forEach(avail => {
          // Usar directamente la cadena de fecha del API (YYYY-MM-DD)
          availabilityMap.set(avail.date_all, avail)
        })

        return (
          <div key={monthKey} className="mb-8">
            <h3 className="mb-4 text-lg font-bold text-gray-800">{monthName}</h3>
            
            <div className="grid grid-cols-7 gap-1 text-center">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                <div key={day} className="p-1 text-xs font-medium text-gray-500 md:p-2 md:text-sm">
                  {day}
                </div>
              ))}
              
              {calendarDays.map((day, index) => {
                if (!day) return <div key={`empty-${index}`} className="p-1 md:p-2" />
                
                // Formatear la fecha como YYYY-MM-DD para comparar con el API
                const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`
                const availability = availabilityMap.get(dateStr)
                const isToday = new Date().toDateString() === day.toDateString()
                const isSelected = selectedAvailability?.date_all === dateStr
                
                return (
                  <button
                    key={dateStr}
                    onClick={() => availability && setSelectedAvailability(availability)}
                    className={`relative rounded p-1 text-xs transition-all md:p-2 md:text-sm ${
                      availability?.disponibility
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-50 text-gray-400 cursor-default'
                    } ${
                      isToday ? 'ring-2 ring-blue-500' : ''
                    } ${
                      isSelected ? '!bg-green-500 !text-white !ring-2 !ring-green-700' : ''
                    }`}
                    disabled={!availability?.disponibility}
                  >
                    {day.getDate()}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
      
      {/* Detalles de la selección */}
      {selectedAvailability && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-md">
          <h3 className="mb-2 text-lg font-semibold">
            Detalles de disponibilidad seleccionada
          </h3>
          <SelectAppointment roomId={selectedAvailability.id}/>
          
        </div>
      )}
      
      {/* Leyenda */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
        <div className="flex items-center">
          <div className="mr-1 h-3 w-3 rounded-full bg-green-500"></div>
          <span>Disponible</span>
        </div>
        <div className="flex items-center">
          <div className="mr-1 h-3 w-3 rounded-full bg-gray-300"></div>
          <span>No disponible</span>
        </div>
        <div className="flex items-center">
          <div className="mr-1 h-3 w-3 rounded-full ring-2 ring-blue-500"></div>
          <span>Hoy</span>
        </div>
        <div className="flex items-center">
          <div className="mr-1 h-3 w-3 rounded-full bg-green-700"></div>
          <span>Seleccionado</span>
        </div>
      </div>
    </div>
  )
}

export default CalendarRoom