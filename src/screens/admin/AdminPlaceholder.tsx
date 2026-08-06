import React from 'react';
import AdminLayout from './AdminLayout';

interface AdminPlaceholderProps {
  title: string;
  description: string;
}

const AdminPlaceholder: React.FC<AdminPlaceholderProps> = ({ title, description }) => (
  <AdminLayout title={title}>
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-3 text-sm text-slate-500">{description}</p>
      <div className="mt-6 inline-flex rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600">Interface prête pour les endpoints Django</div>
    </div>
  </AdminLayout>
);

export default AdminPlaceholder;
