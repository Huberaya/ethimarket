// src/components/search/ProductComparisonDrawer.tsx
// Side-by-side Product Comparator Modal & Floating Bar (up to 5 products)

import React, { useState } from 'react';
import { X, Scale, ArrowRight } from 'lucide-react';
import { Product } from '../../lib/supabase';
import ProcurementComparisonModal from './ProcurementComparisonModal';

interface ProductComparisonDrawerProps {
  selectedProducts: Product[];
  onRemoveProduct: (productId: string) => void;
  onClearAll: () => void;
}

export const ProductComparisonDrawer: React.FC<ProductComparisonDrawerProps> = ({
  selectedProducts,
  onRemoveProduct,
  onClearAll
}) => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  if (selectedProducts.length === 0) return null;


  return (
    <>
      {/* Floating Bottom Bar */}
      <div
        id="comparator-floating-bar"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-neutral-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-neutral-700 flex items-center gap-4 max-w-4xl w-[92vw]"
      >
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-emerald-400" />
          <span className="text-xs md:text-sm font-semibold">
            Comparateur ({selectedProducts.length}/5) :
          </span>
        </div>

        {/* Selected Products Thumbnails */}
        <div className="flex items-center gap-2 overflow-x-auto flex-1 py-1">
          {selectedProducts.map(p => (
            <div
              key={p.id}
              className="relative flex items-center gap-2 bg-neutral-800 rounded-xl px-2.5 py-1 text-xs shrink-0 border border-neutral-700"
            >
              <span>{p.country_flag || '📦'}</span>
              <span className="font-medium max-w-[120px] truncate">{p.name}</span>
              <span className="text-emerald-400 font-bold">{p.price} €</span>
              <button
                type="button"
                onClick={() => onRemoveProduct(p.id)}
                className="text-neutral-400 hover:text-rose-400 p-0.5"
                title="Retirer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-neutral-400 hover:text-white underline p-1"
          >
            Vider
          </button>
          <button
            id="btn-open-comparison-modal"
            type="button"
            onClick={() => setIsOpenModal(true)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs md:text-sm font-bold px-4 py-2 rounded-xl transition shadow-md"
          >
            <span>Comparer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Comparateur Achats Responsables (matrice + reco IA + fiche justificative) */}
      <ProcurementComparisonModal
        products={selectedProducts}
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
      />
    </>
  );
};
