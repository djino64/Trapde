import React, { useEffect, useState } from 'react';
import { MdBed, MdWork, MdFlight, MdShoppingBag, MdCarRental } from 'react-icons/md';
import AdminLayout from './AdminLayout';
import api from '../../services/api';

interface ServiceMetric {
  label: string;
  count: number;
  active: number;
  revenue: number;
  bookings: number;
}

interface AdminServicesStats {
  services: Record<string, ServiceMetric>;
}

const serviceIcons = {
  lojman: MdBed,
  travay: MdWork,
  vwayaj: MdFlight,
  mache: MdShoppingBag,
  lokasyon: MdCarRental,
};

const AdminServices: React.FC = () => {
  const [stats, setStats] = useState<AdminServicesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/api/users/admin/dashboard/');
        setStats({ services: res.data.services });
      } catch {
        setError('Impossible de charger les métriques des services depuis le backend.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <AdminLayout title="Gestion des services TRAPDE">
      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-r from-[#0A0A2E] via-[#0000AA] to-[#1E40AF] p-6 text-white shadow-xl">
          <p className="text-sm text-white/70">Vue administrateur des cinq services TRAPDE</p>
          <h2 className="mt-2 text-2xl font-semibold">Suivi des offres, de l’activité et des revenus par service.</h2>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="h-8 w-24 animate-pulse rounded bg-slate-100" />
                <div className="mt-4 h-6 w-32 animate-pulse rounded bg-slate-100" />
              </div>
            ))
          ) : (
            Object.entries(stats?.services ?? {}).map(([key, metric]) => {
              const Icon = serviceIcons[key as keyof typeof serviceIcons] || MdBed;
              return (
                <div key={key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 inline-flex rounded-2xl bg-slate-100 p-3 text-[#0000AA]">
                    <Icon size={22} />
                  </div>
                  <p className="text-lg font-semibold text-slate-900">{metric.label}</p>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>Offres</span>
                      <span className="font-semibold text-slate-900">{metric.count}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Actives</span>
                      <span className="font-semibold text-slate-900">{metric.active}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Réservations</span>
                      <span className="font-semibold text-slate-900">{metric.bookings}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Revenus</span>
                      <span className="font-semibold text-slate-900">HTG {metric.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminServices;
