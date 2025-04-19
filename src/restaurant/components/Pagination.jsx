import React from 'react';

function Pagination({ links, onPageChange }) {
  return (
    <div className="flex justify-center mt-8">
      <div className="inline-flex flex-wrap gap-2">
        {links.map((link, index) => (
          <button
            key={index}
            dangerouslySetInnerHTML={{ __html: link.label }}
            onClick={() => link.url && onPageChange(link.url)}
            disabled={!link.url}
            className={`min-w-[40px] px-4 py-2 text-sm font-medium rounded-full transition-all border
              ${
                link.active
                  ? 'bg-wood-700 text-white border-wood-700'
                  : 'bg-white text-wood-700 border-gray-300 hover:bg-wood-100'
              }
              ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          />
        ))}
      </div>
    </div>
  );
}

export default Pagination;
