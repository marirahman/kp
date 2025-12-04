import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            {/* Kotak Logo dengan Warna Biru Khas Bengkel */}
            <div className="bg-blue-600 text-white flex aspect-square size-8 items-center justify-center rounded-md">
                {/* Ikon Obeng (Tools) */}
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 16 16" 
                    fill="currentColor" 
                    className="size-5"
                >
                    <path d="M1 0L0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l.968-.968 2.617 2.654A3.003 3.003 0 0 0 16 13a3 3 0 1 0-3.148-3.99l-2.654-2.617a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814L1 0z" />
                </svg>
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">SIPRO ATJ</span>
            </div>
        </>
    );
}
