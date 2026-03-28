import React from 'react';
import * as XLSX from 'xlsx';
import { RunningPost } from '../../types/posts';

interface ExportButtonProps {
  items: RunningPost[];
  className?: string;
}

export function ExportButton({ items, className = '' }: ExportButtonProps) {
  const exportToExcel = () => {
    // Tạo dữ liệu cho Excel
    const excelData = items.map(item => ({
      'Tổng comment': item.commentTotalCount,
      'Comment hôm nay': item.commentCountToday,
      'Link': item.url,
      'Tiêu đề': item.title
    }));

    // Tạo workbook và worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Links');

    // Xuất file
    const fileName = `links_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const exportToText = () => {
    // Tạo dữ liệu cho Text với format link|tiêu đề
    const textData = items.map(item => `${item.url}|${item.title}`).join('\n');
    
    // Tạo blob và download
    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `links_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm text-gray-500 font-medium">Xuất dữ liệu:</span>
      <div className="flex gap-2">
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-3 py-2 bg-[#08a070] hover:bg-[#079960] text-white text-sm rounded-lg transition-colors duration-200"
          title="Xuất file Excel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
            <path fill="#169154" d="M29,6H15.744C14.781,6,14,6.781,14,7.744v7.259h15V6z"></path><path fill="#18482a" d="M14,33.054v7.202C14,41.219,14.781,42,15.743,42H29v-8.946H14z"></path><path fill="#0c8045" d="M14 15.003H29V24.005000000000003H14z"></path><path fill="#17472a" d="M14 24.005H29V33.055H14z"></path><g><path fill="#29c27f" d="M42.256,6H29v9.003h15V7.744C44,6.781,43.219,6,42.256,6z"></path><path fill="#27663f" d="M29,33.054V42h13.257C43.219,42,44,41.219,44,40.257v-7.202H29z"></path><path fill="#19ac65" d="M29 15.003H44V24.005000000000003H29z"></path><path fill="#129652" d="M29 24.005H44V33.055H29z"></path></g><path fill="#0c7238" d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"></path><path fill="#fff" d="M9.807 19L12.193 19 14.129 22.754 16.175 19 18.404 19 15.333 24 18.474 29 16.123 29 14.013 25.07 11.912 29 9.526 29 12.719 23.982z"></path>
          </svg>
          <span className="font-bold">Excel</span>
        </button>
        
        <button
          onClick={exportToText}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-200"
          title="Xuất file Text"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="font-bold">Text</span>
        </button>
      </div>
    </div>
  );
}
