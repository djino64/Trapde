import React, { useState } from 'react';
import { 
  MdLocationOn, 
  MdBed, 
  MdBathroom, 
  MdChildCare, 
  MdBabyChangingStation,
  MdAcUnit,
  MdWifi,
  MdLocalLaundryService,
  MdKitchen,
  MdPool,
  MdHotTub,
  MdTv,
  MdBalcony,
  MdYard,
  MdBreakfastDining,
  MdLocalParking,
  MdLanguage,
  MdSmokingRooms,
  MdEmojiEvents,
  MdPets,
  MdAccessTime,
  MdAdd,
  MdRemove,
  MdDelete,
  MdHome,
  MdApartment,
  MdHouse,
  MdVilla,
  MdCabin
} from 'react-icons/md';
import { FaFlagUsa, FaFlagCheckered } from 'react-icons/fa';
import ReactCountryFlag from 'react-country-flag';

interface Room {
  id: number;
  type: string;
  beds: Bed[];
}

interface Bed {
  type: 'single' | 'double' | 'king';
  quantity: number;
}

const RegisterAccommodationScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    // Informations générales
    propertyName: '',
    address: '',
    apartmentNumber: '',
    country: 'HT',
    city: '',
    postalCode: '',
    
    // Informations sur le logement
    bedrooms: 1,
    livingRooms: 1,
    otherSpaces: 0,
    maxGuests: 2,
    childrenCount: 0,
    bathrooms: 1,
    acceptsChildren: false,
    hasBabyBed: false,
    babyBedPrice: '',
    isBabyBedFree: true,
    surfaceArea: '',
    
    // Équipements
    amenities: {
      ac: false,
      heating: false,
      wifi: false,
      kitchen: false,
      washingMachine: false,
      tv: false,
      pool: false,
      jacuzzi: false,
      minibar: false,
      balcony: false,
      garden: false,
      terrace: false,
    },
    
    // Services
    breakfastIncluded: false,
    parking: 'none', // 'none', 'free', 'paid'
    parkingPrice: '',
    languages: ['Kreyòl', 'Français', 'Anglè'],
    smokingAllowed: false,
    
    // Règles
    eventsAllowed: false,
    petsAllowed: 'no', // 'no', 'on_request', 'yes'
    openingHours: {
      start: '08:00',
      end: '20:00'
    }
  });

  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, type: 'Chanm prensipal', beds: [{ type: 'double', quantity: 1 }] }
  ]);
  const [customLanguages, setCustomLanguages] = useState<string[]>([]);
  const [newLanguage, setNewLanguage] = useState('');

  const countries = [
    { code: 'HT', name: 'Haïti', flag: '🇭🇹' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'US', name: 'États-Unis', flag: '🇺🇸' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'DO', name: 'République Dominicaine', flag: '🇩🇴' },
  ];

  const bedTypes = [
    { value: 'single', label: 'Senp (1 pèsonn)', icon: '🛏️' },
    { value: 'double', label: 'Doub (2 pèsonn)', icon: '🛏️🛏️' },
    { value: 'king', label: 'Gran kabann (2+ pèsonn)', icon: '👑🛏️' },
  ];

  const handleAddRoom = () => {
    const newId = Math.max(...rooms.map(r => r.id), 0) + 1;
    setRooms([...rooms, { id: newId, type: 'Nouvo chanm', beds: [{ type: 'double', quantity: 1 }] }]);
  };

  const handleRemoveRoom = (id: number) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter(room => room.id !== id));
    }
  };

  const handleAddBed = (roomId: number) => {
    setRooms(rooms.map(room => {
      if (room.id === roomId) {
        return { ...room, beds: [...room.beds, { type: 'double', quantity: 1 }] };
      }
      return room;
    }));
  };

  const handleRemoveBed = (roomId: number, bedIndex: number) => {
    setRooms(rooms.map(room => {
      if (room.id === roomId && room.beds.length > 1) {
        return { ...room, beds: room.beds.filter((_, idx) => idx !== bedIndex) };
      }
      return room;
    }));
  };

  const handleBedChange = (roomId: number, bedIndex: number, field: string, value: any) => {
    setRooms(rooms.map(room => {
      if (room.id === roomId) {
        const newBeds = [...room.beds];
        newBeds[bedIndex] = { ...newBeds[bedIndex], [field]: value };
        return { ...room, beds: newBeds };
      }
      return room;
    }));
  };

  const handleRoomTypeChange = (roomId: number, type: string) => {
    setRooms(rooms.map(room => 
      room.id === roomId ? { ...room, type } : room
    ));
  };

  const handleAmenityChange = (amenity: keyof typeof formData.amenities) => {
    setFormData({
      ...formData,
      amenities: {
        ...formData.amenities,
        [amenity]: !formData.amenities[amenity]
      }
    });
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim()) && !customLanguages.includes(newLanguage.trim())) {
      setCustomLanguages([...customLanguages, newLanguage.trim()]);
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (lang: string) => {
    setCustomLanguages(customLanguages.filter(l => l !== lang));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      rooms,
      customLanguages,
    };
    console.log('Données soumises:', submitData);
    alert('Lojman anrejistre avèk siksè! / Logement enregistré avec succès!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/src/assets/images/TRAPDELOGO.png" alt="TRAPDE" className="h-12 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-[#0000AA] mb-2">Fòmilè anrejistreman lojman</h1>
          <p className="text-gray-600">Ranpli tout enfòmasyon ki nesesè pou mete lojman w sou TRAPDE</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* ==================== SECTION 1: ENFÒMASYON JENERAL ==================== */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-[#0000AA] px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MdHome size={24} />
                Enfòmasyon jeneral
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Non lojman an <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.propertyName}
                  onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0000AA] focus:border-transparent"
                  placeholder="Ex: Villa paradis, Bel kay, ..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adrès lojman an <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0000AA] focus:border-transparent"
                  placeholder="Adrès konplè"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nimewo apatman / Etaj (fakiltatif)
                  </label>
                  <input
                    type="text"
                    value={formData.apartmentNumber}
                    onChange={(e) => setFormData({ ...formData, apartmentNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0000AA] focus:border-transparent"
                    placeholder="Apatman 12, 3èm etaj..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peyi <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0000AA]"
                    required
                  >
                    {countries.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vil <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0000AA] focus:border-transparent"
                    placeholder="Vil kote lojman an ye"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kòd postal
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0000AA] focus:border-transparent"
                    placeholder="Kòd postal"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ==================== SECTION 2: ENFÒMASYON SOU LOJMAN AN ==================== */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-[#FF6600] px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MdBed size={24} />
                Enfòmasyon sou lojman an
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Espas jeneral */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chanm <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, bedrooms: Math.max(0, formData.bedrooms - 1) })}
                      className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <MdRemove size={16} />
                    </button>
                    <span className="w-12 text-center text-lg font-semibold">{formData.bedrooms}</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, bedrooms: formData.bedrooms + 1 })}
                      className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <MdAdd size={16} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salon</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, livingRooms: Math.max(0, formData.livingRooms - 1) })}
                      className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <MdRemove size={16} />
                    </button>
                    <span className="w-12 text-center text-lg font-semibold">{formData.livingRooms}</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, livingRooms: formData.livingRooms + 1 })}
                      className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <MdAdd size={16} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lòt espas</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, otherSpaces: Math.max(0, formData.otherSpaces - 1) })}
                      className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <MdRemove size={16} />
                    </button>
                    <span className="w-12 text-center text-lg font-semibold">{formData.otherSpaces}</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, otherSpaces: formData.otherSpaces + 1 })}
                      className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <MdAdd size={16} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sipèfisi (m²) <span className="text-gray-400">(fakiltatif)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.surfaceArea}
                    onChange={(e) => setFormData({ ...formData, surfaceArea: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0000AA]"
                    placeholder="m²"
                  />
                </div>
              </div>

              {/* Chanm ak kabann - Dynamique */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">Chanm ak kalite kabann yo</h3>
                  <button
                    type="button"
                    onClick={handleAddRoom}
                    className="flex items-center gap-1 text-sm bg-[#0000AA] text-white px-3 py-1 rounded-lg hover:bg-[#000088]"
                  >
                    <MdAdd size={16} /> Ajoute yon chanm
                  </button>
                </div>
                
                {rooms.map((room, roomIndex) => (
                  <div key={room.id} className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex-1 mr-3">
                        <input
                          type="text"
                          value={room.type}
                          onChange={(e) => handleRoomTypeChange(room.id, e.target.value)}
                          className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm"
                          placeholder="Non chanm (Ex: Chanm prensipal, Chanm timoun...)"
                        />
                      </div>
                      {rooms.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRoom(room.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <MdDelete size={20} />
                        </button>
                      )}
                    </div>
                    
                    {room.beds.map((bed, bedIndex) => (
                      <div key={bedIndex} className="flex items-center gap-2 mb-2 pl-4">
                        <select
                          value={bed.type}
                          onChange={(e) => handleBedChange(room.id, bedIndex, 'type', e.target.value)}
                          className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-sm"
                        >
                          {bedTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.icon} {type.label}
                            </option>
                          ))}
                        </select>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleBedChange(room.id, bedIndex, 'quantity', Math.max(1, bed.quantity - 1))}
                            className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center"
                          >
                            <MdRemove size={12} />
                          </button>
                          <span className="w-8 text-center text-sm">{bed.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleBedChange(room.id, bedIndex, 'quantity', bed.quantity + 1)}
                            className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center"
                          >
                            <MdAdd size={12} />
                          </button>
                        </div>
                        {room.beds.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveBed(room.id, bedIndex)}
                            className="text-red-500"
                          >
                            <MdDelete size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => handleAddBed(room.id)}
                      className="text-sm text-[#0000AA] hover:underline mt-2 ml-4"
                    >
                      + Ajoute yon kabann
                    </button>
                  </div>
                ))}
              </div>

              {/* Okipasyon maksimòm */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Konbyen moun ki ka loje nan kay la ? <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.maxGuests}
                    onChange={(e) => setFormData({ ...formData, maxGuests: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    min={1}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timoun (0-3 an)
                  </label>
                  <input
                    type="number"
                    value={formData.childrenCount}
                    onChange={(e) => setFormData({ ...formData, childrenCount: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    min={0}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Konbyen douch kay la genyen ? <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    min={1}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Eske lojman an aksepte timoun ?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.acceptsChildren === true}
                        onChange={() => setFormData({ ...formData, acceptsChildren: true })}
                        className="text-[#0000AA]"
                      /> Wi
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.acceptsChildren === false}
                        onChange={() => setFormData({ ...formData, acceptsChildren: false })}
                        className="text-[#0000AA]"
                      /> Non
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Eske gen kabann pou bebe ?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.hasBabyBed === true}
                        onChange={() => setFormData({ ...formData, hasBabyBed: true })}
                        className="text-[#0000AA]"
                      /> Wi
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.hasBabyBed === false}
                        onChange={() => setFormData({ ...formData, hasBabyBed: false })}
                        className="text-[#0000AA]"
                      /> Non
                    </label>
                  </div>
                </div>
              </div>

              {formData.hasBabyBed && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pri pou kabann bebe ?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.isBabyBedFree === true}
                        onChange={() => setFormData({ ...formData, isBabyBedFree: true, babyBedPrice: '' })}
                        className="text-[#0000AA]"
                      /> Gratis
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.isBabyBedFree === false}
                        onChange={() => setFormData({ ...formData, isBabyBedFree: false })}
                        className="text-[#0000AA]"
                      /> Gen yon pri
                    </label>
                  </div>
                  {!formData.isBabyBedFree && (
                    <input
                      type="number"
                      value={formData.babyBedPrice}
                      onChange={(e) => setFormData({ ...formData, babyBedPrice: e.target.value })}
                      placeholder="Pri an Gdes"
                      className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ==================== SECTION 3: EKIPMAN ==================== */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-[#0000AA] px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MdAcUnit size={24} />
                Ki ekipman kliyan ap jwenn ?
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" checked={formData.amenities.ac} onChange={() => handleAmenityChange('ac')} className="text-[#0000AA]" />
                  <MdAcUnit size={18} /> Klimatizasyon
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" checked={formData.amenities.heating} onChange={() => handleAmenityChange('heating')} className="text-[#0000AA]" />
                  🔥 Chofaj
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" checked={formData.amenities.wifi} onChange={() => handleAmenityChange('wifi')} className="text-[#0000AA]" />
                  <MdWifi size={18} /> Wifi gratis
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" checked={formData.amenities.kitchen} onChange={() => handleAmenityChange('kitchen')} className="text-[#0000AA]" />
                  <MdKitchen size={18} /> Kwizin
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" checked={formData.amenities.washingMachine} onChange={() => handleAmenityChange('washingMachine')} className="text-[#0000AA]" />
                  <MdLocalLaundryService size={18} /> Machin alave
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" checked={formData.amenities.tv} onChange={() => handleAmenityChange('tv')} className="text-[#0000AA]" />
                  <MdTv size={18} /> Televizyon ekran plat
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" checked={formData.amenities.pool} onChange={() => handleAmenityChange('pool')} className="text-[#0000AA]" />
                  <MdPool size={18} /> Pisin
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" checked={formData.amenities.jacuzzi} onChange={() => handleAmenityChange('jacuzzi')} className="text-[#0000AA]" />
                  <MdHotTub size={18} /> Jakouzi
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" checked={formData.amenities.minibar} onChange={() => handleAmenityChange('minibar')} className="text-[#0000AA]" />
                  🍾 Minibar
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" checked={formData.amenities.balcony} onChange={() => handleAmenityChange('balcony')} className="text-[#0000AA]" />
                  <MdBalcony size={18} /> Balkon
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" checked={formData.amenities.garden} onChange={() => handleAmenityChange('garden')} className="text-[#0000AA]" />
                  <MdYard size={18} /> Peyizaj sou jaden
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" checked={formData.amenities.terrace} onChange={() => handleAmenityChange('terrace')} className="text-[#0000AA]" />
                  <MdBalcony size={18} /> Teras
                </label>
              </div>
            </div>
          </div>

          {/* ==================== SECTION 4: SÈVIS ==================== */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-[#FF6600] px-6 py-4">
              <h2 className="text-xl font-bold text-white">Sèvis kliyan ka jwenn</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="flex items-center gap-2 mb-2">
                  <input type="checkbox" checked={formData.breakfastIncluded} onChange={(e) => setFormData({ ...formData, breakfastIncluded: e.target.checked })} className="text-[#0000AA]" />
                  <MdBreakfastDining size={20} /> Manje maten
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pakin</label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="parking" value="free" checked={formData.parking === 'free'} onChange={(e) => setFormData({ ...formData, parking: e.target.value, parkingPrice: '' })} className="text-[#0000AA]" />
                    Wi, gratis
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="parking" value="paid" checked={formData.parking === 'paid'} onChange={(e) => setFormData({ ...formData, parking: e.target.value })} className="text-[#0000AA]" />
                    Wi, depi kliyan peye
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="parking" value="none" checked={formData.parking === 'none'} onChange={(e) => setFormData({ ...formData, parking: e.target.value, parkingPrice: '' })} className="text-[#0000AA]" />
                    Non
                  </label>
                </div>
                {formData.parking === 'paid' && (
                  <input
                    type="number"
                    value={formData.parkingPrice}
                    onChange={(e) => setFormData({ ...formData, parkingPrice: e.target.value })}
                    placeholder="Pri an Gdes"
                    className="mt-2 w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ki lang moun kap travay nan lojman pale?</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {['Kreyòl', 'Fransè', 'Anglè', 'Panyòl', ...customLanguages].map(lang => (
                    <span key={lang} className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {lang}
                      {!['Kreyòl', 'Fransè', 'Anglè', 'Panyòl'].includes(lang) && (
                        <button type="button" onClick={() => handleRemoveLanguage(lang)} className="text-red-500 ml-1">
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="Ajoute yon lòt lang..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <button type="button" onClick={handleAddLanguage} className="bg-[#0000AA] text-white px-4 py-2 rounded-lg hover:bg-[#000088]">
                    Ajoute
                  </button>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.smokingAllowed} onChange={(e) => setFormData({ ...formData, smokingAllowed: e.target.checked })} className="text-[#0000AA]" />
                  <MdSmokingRooms size={20} /> Eske fimen otorize?
                </label>
              </div>
            </div>
          </div>

          {/* ==================== SECTION 5: PRENSIP / RÈG ==================== */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-[#0000AA] px-6 py-4">
              <h2 className="text-xl font-bold text-white">Prensip ki aplike nan lojman an</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.eventsAllowed} onChange={(e) => setFormData({ ...formData, eventsAllowed: e.target.checked })} className="text-[#0000AA]" />
                  <MdEmojiEvents size={20} /> Eske kliyan ka òganize fèt ou lòt evènman?
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Eske kliyan ka akonpanye ak bèt domestik?</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="pets" value="yes" checked={formData.petsAllowed === 'yes'} onChange={(e) => setFormData({ ...formData, petsAllowed: e.target.value })} className="text-[#0000AA]" />
                    Wi
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="pets" value="on_request" checked={formData.petsAllowed === 'on_request'} onChange={(e) => setFormData({ ...formData, petsAllowed: e.target.value })} className="text-[#0000AA]" />
                    Sou demann
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="pets" value="no" checked={formData.petsAllowed === 'no'} onChange={(e) => setFormData({ ...formData, petsAllowed: e.target.value })} className="text-[#0000AA]" />
                    Non
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lè ouvèti / Lè fèmen</label>
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={formData.openingHours.start}
                    onChange={(e) => setFormData({ ...formData, openingHours: { ...formData.openingHours, start: e.target.value } })}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <span className="self-center">a</span>
                  <input
                    type="time"
                    value={formData.openingHours.end}
                    onChange={(e) => setFormData({ ...formData, openingHours: { ...formData.openingHours, end: e.target.value } })}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bouton soumission */}
          <div className="flex justify-center pt-4 pb-8">
            <button
              type="submit"
              className="bg-gradient-to-r from-[#0000AA] to-[#FF6600] text-white px-8 py-3 rounded-xl font-bold text-lg hover:opacity-90 transition shadow-lg"
            >
              Anrejistre lojman an
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterAccommodationScreen;