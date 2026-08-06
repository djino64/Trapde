import React from 'react';
import AdminLayout from './AdminLayout';

const AdminValidation: React.FC = () => (
  <AdminLayout title="Validation des annonces">
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Nouvelles annonces à approuver</h2>
      <p className="mt-2 text-sm text-slate-500">Cette section centralise les validations, commentaires et notifications automatiques.</p>
      <div className="mt-6 space-y-4">
        {[1,2,3].map((item) => (
          <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-slate-900">Annonce à valider {item}</h3>
                <p className="mt-1 text-sm text-slate-500">Commentaire de modération et historique de validation.</p>
              </div>
              <div className="flex gap-2">
                <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600">Approuver</button>
                <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600">Refuser</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </AdminLayout>
);

export default AdminValidation;
