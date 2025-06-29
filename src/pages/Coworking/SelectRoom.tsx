import { useGetAllRooms } from '@/hooks/room/useGetAllRooms'
import { useState } from 'react'
import { Room } from '@/hooks/room/useGetAllRooms'
import CalendarRoom from './CalendarRoom'

const SelectRoom = () => {
    const { rooms, isLoading, error } = useGetAllRooms()
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [showConfirmation, setShowConfirmation] = useState(false)

    if (isLoading) return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="h-40 bg-gray-200 rounded animate-pulse mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse mb-3 w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
            ))}
        </div>
    )
    
    if (error) return (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded text-center">
            Error al cargar las oficinas
        </div>
    )

    const openImageModal = (index: number = 0) => {
        setCurrentImageIndex(index)
        setShowModal(true)
    }

    const handleReserveClick = () => {
        setShowConfirmation(true)
    }

    // const closeConfirmation = () => {
    //     setShowConfirmation(false)
    // }

    return (
        <div className="space-y-6">
            {/* Grid compacto de cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((room) => (
                    <div 
                        key={room.id}
                        className={`bg-white rounded-lg border ${selectedRoom?.id === room.id ? 'border-prim-500' : 'border-gray-200'} overflow-hidden cursor-pointer`}
                        onClick={() => setSelectedRoom(room)}
                    >
                        {room.url_image?.[0] && (
                            <div className="relative h-40">
                                <img 
                                    src={room.url_image[0]} 
                                    alt={room.name}
                                    className="w-full h-full object-cover"
                                />
                                {room.url_image.length > 1 && (
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            openImageModal(0)
                                        }}
                                        className="absolute bottom-2 right-2 bg-prim-500 text-white text-xs px-2 py-1 rounded"
                                    >
                                        +{room.url_image.length - 1}
                                    </button>
                                )}
                            </div>
                        )}
                        
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-medium text-gray-900">{room.name}</h3>
                                <span className="text-xs bg-prim-100 text-prim-800 px-2 py-1 rounded">
                                    {room.type_room}
                                </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{room.description}</p>
                            
                            <div className="flex justify-between items-center">
                                <span className="text-prim-500 font-medium">${room.price.toLocaleString()}/hora</span>
                                {selectedRoom?.id === room.id && (
                                    <span className="text-xs text-prim-500">✓ Seleccionado</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detalle compacto de la oficina seleccionada */}
            {selectedRoom && !showConfirmation && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">{selectedRoom.name}</h3>
                            <p className="text-sm text-prim-500">{selectedRoom.type_room}</p>
                        </div>
                        <span className="text-lg font-medium text-prim-500">${selectedRoom.price.toLocaleString()}/hora</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{selectedRoom.description}</p>
                    
                    {selectedRoom.url_image?.length > 0 && (
                        <div className="mb-4">
                            <div className="flex space-x-2 overflow-x-auto pb-2">
                                {selectedRoom.url_image.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Oficina ${selectedRoom.name} ${index + 1}`}
                                        className="h-20 object-cover rounded cursor-pointer"
                                        onClick={() => openImageModal(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <button 
                        className="w-full bg-prim-500 hover:bg-prim-600 text-white py-2 px-4 rounded text-sm font-medium"
                        onClick={handleReserveClick}
                    >
                        Reservar esta oficina
                    </button>
                </div>
            )}

            {/* Panel de confirmación de reserva */}
            {showConfirmation && selectedRoom && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar Reserva</h3>
                    <CalendarRoom key={selectedRoom.id} roomId={selectedRoom.id} />
                </div>
            )}

            {/* Modal minimalista de imágenes */}
            {showModal && selectedRoom && (
                <div 
                    className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50"
                    onClick={() => setShowModal(false)}
                >
                    <div 
                        className="relative max-w-4xl w-full max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            className="absolute -top-10 right-0 text-white"
                            onClick={() => setShowModal(false)}
                        >
                            ✕ Cerrar
                        </button>
                        
                        <img 
                            src={selectedRoom.url_image[currentImageIndex]} 
                            alt={`Oficina ${selectedRoom.name}`}
                            className="w-full h-full object-contain max-h-[80vh]"
                        />
                        
                        <div className="flex justify-between mt-2">
                            <button 
                                className="text-white bg-prim-500 px-3 py-1 rounded text-sm"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setCurrentImageIndex(prev => 
                                        prev > 0 ? prev - 1 : selectedRoom.url_image.length - 1
                                    )
                                }}
                            >
                                Anterior
                            </button>
                            
                            <span className="text-white text-sm">
                                {currentImageIndex + 1} / {selectedRoom.url_image.length}
                            </span>
                            
                            <button 
                                className="text-white bg-prim-500 px-3 py-1 rounded text-sm"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setCurrentImageIndex(prev => 
                                        prev < selectedRoom.url_image.length - 1 ? prev + 1 : 0
                                    )
                                }}
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SelectRoom