import { HTMLAttributes } from 'react';

export default function ApplicationLogo(props: HTMLAttributes<HTMLDivElement>) {
    return (
        // Menambahkan 'justify-center' agar konten logo berada di tengah container
        <div {...props} className={`flex items-center justify-center gap-3 select-none ${props.className || ''}`}>
            
            {/* --- IKON DENGAN BACKGROUND --- */}
            <div className="bg-blue-600 p-2 rounded-lg shadow-md flex items-center justify-center shrink-0">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 16 16" 
                    fill="currentColor" 
                    className="w-6 h-6 text-white"
                >
                    {/* Path Ikon Tools (Obeng & Kunci Pas) */}
                    <path d="M1 0L0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l.968-.968 2.617 2.654A3.003 3.003 0 0 0 16 13a3 3 0 1 0-3.148-3.99l-2.654-2.617a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814L1 0z" />
                </svg>
            </div>
            
            {/* --- TEKS LOGO --- */}
            <div className="flex flex-col justify-center">
                <span className="text-xl font-bold leading-none text-gray-900 dark:text-white whitespace-nowrap">
                    SIPRO <span className="text-blue-600">ATJ</span>
                </span>
            </div>
        </div>
    );
}