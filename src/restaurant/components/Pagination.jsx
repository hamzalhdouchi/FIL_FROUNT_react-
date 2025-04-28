import React from 'react';

function Pagination({ links, onPageChange }) {

  const linksArray = links && typeof links === 'object' && !Array.isArray(links)
    ? Object.entries(links).map(([key, value]) => ({
        ...value,
        key,
        label: key === 'prev' ? '&laquo; Previous' : 
               key === 'next' ? 'Next &raquo;' : 
               value.label || key
      }))
    : Array.isArray(links) 
      ? links 
      : [];

  return (
    <div className="flex justify-center mt-7 mb-6">
      <div className="inline-flex flex-wrap gap-2">
        {linksArray.map((link, index) => (
          <button
            key={index}
            dangerouslySetInnerHTML={{ __html: link.label }}
            onClick={() => link.url && onPageChange(link.url)}
            disabled={!link.url || link.active}
            className={`min-w-[40px] px-4 py-2 text-sm font-medium rounded-full transition-all border
              ${
                link.active
                  ? 'bg-wood-700 text-white border-wood-700 cursor-default'
                  : 'bg-white text-wood-700 border-gray-300 hover:bg-wood-100'
              }
              ${!link.url ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          />
        ))}
      </div>
    </div>
  );
}

export default Pagination;