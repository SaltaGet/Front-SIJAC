import apiSijac from '@/api/sijac'
import { useAvailability } from '@/hooks/useAvailability'
import useAuthStore from '@/store/useAuthStore'
import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'

interface AdminEditAppointmentProps {
  av_id: string
}

interface requestData {
    av_id :string,
    start_time: string,
    end_time:string
}

const putAvailability = async (payload:requestData) => {
    const token = useAuthStore.getState().token
    const {data} = await apiSijac.put(`/availability/update/${payload.av_id}`,{start_time:payload.start_time,end_time:payload.end_time},{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })

    return data
}

const AdminEditAppointment: React.FC<AdminEditAppointmentProps> = ({ av_id }) => {
  const { userId } = useAuthStore()
  const { availabilityData } = useAvailability(userId ?? undefined)
  const {mutate, isPending} = useMutation({
    mutationFn:putAvailability,
    onSuccess:() => {
        alert("Editado con Éxito")
    },
    onError: () => {
        alert("Error Verifique que no tengas turnos pendientes y intente de nuevo")
    }

  });
  const filteredData = availabilityData?.find(data => data.id === av_id)

  const hours = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 9
    const value = hour.toString().padStart(2, '0') + ':00:00'
    const label = hour.toString()
    return { value, label }
  })

  const [startTime, setStartTime] = useState(filteredData?.start_time || '')
  const [endTime, setEndTime] = useState(filteredData?.end_time || '')

  const isEndTimeValid = (time: string) => {
    if (!startTime) return true
    const startHour = parseInt(startTime.split(':')[0])
    const endHour = parseInt(time.split(':')[0])
    return endHour > startHour
  }

  const isStartTimeValid = (time: string) => {
    if (!endTime) return true
    const startHour = parseInt(time.split(':')[0])
    const endHour = parseInt(endTime.split(':')[0])
    return startHour < endHour
  }

  const handleSubmit = async () => {
    // Validación final antes de enviar
    if (!startTime || !endTime) {
      alert('Por favor selecciona ambas horas')
      return
    }

    if (!isEndTimeValid(endTime)) {
      alert('La hora de fin debe ser posterior a la hora de inicio')
      return
    }

    mutate({av_id:av_id, start_time:startTime, end_time: endTime})

  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium">Hora de inicio</label>
        <select
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        >
          {hours.map(({ value, label }) => (
            <option 
              key={value} 
              value={value}
              disabled={!isStartTimeValid(value)}
            >
              {label}:00
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Hora de fin</label>
        <select
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        >
          {hours.map(({ value, label }) => (
            <option 
              key={value} 
              value={value}
              disabled={!isEndTimeValid(value)}
            >
              {label}:00
            </option>
          ))}
        </select>
      </div>

      <button
  onClick={handleSubmit}
  disabled={!startTime || !endTime || isPending}
  className={`mt-4 px-4 py-2 rounded text-white ${!startTime || !endTime || isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
>
  {isPending ? 'Cargando...' : 'Editar Horario'}
</button>

    </div>
  )
}

export default AdminEditAppointment