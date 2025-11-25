import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// --- KOMPONEN IKON (SVG) ---
const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className={`bi bi-${name} ${className}`} viewBox="0 0 16 16">
    {name === 'tools' && <path d="M1 0L0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l.968-.968 2.617 2.654A3.003 3.003 0 0 0 16 13a3 3 0 1 0-3.148-3.99l-2.654-2.617a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814L1 0z" />}
    {name === 'list' && <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>}
    {name === 'x' && <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>}
    
    {name === 'check-circle' && (
      <g>
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
      </g>
    )}
    
    {name === 'calculator' && (
      <g>
        <path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h8zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z"/>
        <path d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-2zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-4z"/>
      </g>
    )}

    {name === 'people' && <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0z"/>}
    {name === 'house-door' && <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H15a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354l-6-6zM9.5 14V9.5a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0-.5.5V14H6v-5.5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 11 8.5V14h-1.5z"/>}
    {name === 'shield-lock' && <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.642.44.897.62a.63.63 0 0 0 .7.001c.255-.18.55-.376.897-.62a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.95-1.01-2.22-1.857-3.582-2.502C9.423 1.022 8.632.748 8 .748s-1.423.274-2.662.842zM9 6a1 1 0 0 1 2 0v1h.5a.5.5 0 0 1 0 1H11v1a1 1 0 1 1-2 0V8H8.5a.5.5 0 0 1 0-1H9V6z"/>}
    
    {name === 'building' && (
      <g>
        <path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V1zm2 1v12h8V2H4z"/>
        <path d="M9 4h1v1H9V4zm-2 0h1v1H7V4zm-2 0h1v1H5V4zm0 2h1v1H5V6zm2 0h1v1H7V6zm2 0h1v1H9V6zm-2 2h1v1H7V8zm2 0h1v1H9V8zm-2 2h1v1H7V10zm2 0h1v1H9V10z"/>
      </g>
    )}
    {name === 'gear' && (
      <g>
        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.902 3.433 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319z"/>
      </g>
    )}
    {name === 'telephone' && (
      <g>
        <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328z"/>
        <path d="M1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.612l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
      </g>
    )}
    {name === 'envelope' && (
      <g>
        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2z"/>
        <path d="M13 2.383-4.708 2.825L15 11.105V5.383zm-.034 6.876-5.64-3.385L8 9.5l-1.326-.798-5.64 3.385A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741zM1 11.105l4.708-2.825L1 5.383v5.722z"/>
      </g>
    )}
    {name === 'geo-alt' && (
      <g>
        <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
        <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
      </g>
    )}
    {name === 'whatsapp' && <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.627-2.957 6.586-6.591 6.586zM5.48 6.108a.63.63 0 0 0-.427-.247c-.525-.117-1.03-.176-1.482-.181a.54.54 0 0 0-.54.63c.03 1.01.232 1.99.67 2.91.487 1.03 1.153 1.94 1.997 2.76.88.856 1.84 1.52 2.898 1.997.983.46 2.006.68 3.03.73.014.001.028 0 .041-.002a.5.5 0 0 0 .53-.512c.01-.378-.006-1.023-.03-1.536-.024-.51-.12-.914-.248-1.29a.63.63 0 0 0-.427-.363c-.34-.104-.73-.184-1.19-.21a.63.63 0 0 0-.629.247l-.22.22c-.232.232-.4.1.282-1.379.682-1.479 1.14-2.525.79-3.235-.353-.71-.975-1.03-1.39-1.03-.353 0-1.023.117-1.482.176a.63.63 0 0 0-.427.247l-.22.22z" />}
    {name === 'arrow-up-short' && <path fillRule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z" />}
    {name === 'facebook' && <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0 0 3.604 0 8.049c0 4.015 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H11.25V16c3.824-.604 6.75-3.936 6.75-7.951z" />}
    {name === 'instagram' && (
      <g>
        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.703.01 5.556 0 5.829 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.556 15.99 5.829 16 8 16s2.444-.01 3.297-.048c.852-.04 1.433-.174 1.942-.372.526-.205.972-.478 1.417-.923.445-.444.719-.89.923-1.416.198-.51.333-1.09.372-1.942C15.99 10.444 16 10.172 16 8s-.01-2.444-.048-3.297c-.04-.852-.174-1.433-.372-1.942C15.383 2.23 15.11 1.783 14.665 1.34c-.444-.445-.89-.719-1.416-.923C12.74 2.22 12.15 2.088 11.297 2.048 10.444 2.01 10.172 2 8 2zM8 1.44c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.282.24.705.275 1.486.039.843.047 1.096.047 3.232s-.008 2.389-.047 3.232c-.035.78-.166 1.204-.275 1.486-.145.373-.319.64-.599.92-.28.28-.546.453-.92.598-.282.11-.705.24 1.486.275.843-.039 1.096-.047-3.232.047s-2.389-.008-3.232-.047c-.78-.035-1.204-.166-1.486-.275a2.648 2.648 0 0 1-.92-.598 2.648 2.648 0 0 1-.598-.92c-.11-.282-.24-.705-.275-1.486-.039-.843-.047-1.096-.047-3.232s.008-2.389.047-3.232c.035-.78.166-1.204.275-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.486.275.843-.039 1.096-.047 3.232-.047z" />
        <path d="M8 4C5.78 4 4 5.78 4 8s1.78 4 4 4 4-1.78 4-4-1.78-4-4-4zm0 6.4c-1.325 0-2.4-1.075-2.4-2.4 0-1.326 1.075-2.4 2.4-2.4s2.4 1.074 2.4 2.4c0 1.325-1.075 2.4-2.4 2.4z" />
        <path d="M12.636 3.724a.724.724 0 1 0 0-1.447.724.724 0 0 0 0 1.447z" />
      </g>
    )}
  </svg>
);

// --- KOMPONEN KALKULATOR ESTIMASI ---
function EstimatorCalculator() {
    const [product, setProduct] = useState('pagar');
    const [length, setLength] = useState(1);
    const [price, setPrice] = useState(0);

    // Harga dummy per meter
    const prices: Record<string, number> = {
        pagar: 350000, 
        kanopi: 450000, 
        tralis: 300000
    };

    const formatRupiah = (num: number) => {
        return "Rp " + Math.round(num).toLocaleString("id-ID");
    };

    useEffect(() => {
        const qty = parseFloat(String(length)) || 0;
        let newPrice = 0;
        if (prices[product]) {
            newPrice = qty * prices[product];
        }
        setPrice(newPrice);
    }, [product, length]);

    return (
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold font-heading text-gray-900 mb-6 text-center">Estimasi Biaya Cepat</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Produk</label>
                    <select 
                        value={product} 
                        onChange={(e) => setProduct(e.target.value)} 
                        className="w-full border p-3 rounded-lg bg-gray-50"
                    >
                        <option value="pagar">Pagar Minimalis (per m²)</option>
                        <option value="kanopi">Kanopi Baja Ringan (per m²)</option>
                        <option value="tralis">Tralis Jendela (per unit)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {product === 'pagar' ? 'Panjang (meter)' : 'Luas (m²)'}
                    </label>
                    <input 
                        type="number" 
                        value={length}
                        onChange={(e) => setLength(parseFloat(e.target.value))}
                        className="w-full border p-3 rounded-lg"
                        min="1"
                    />
                </div>
            </div>

            <div className="text-center bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-lg text-gray-700">Estimasi Biaya:</p>
                <p className="text-4xl font-bold font-heading text-blue-600 my-2">
                    {formatRupiah(price)}
                </p>
                <p className="text-xs text-gray-500">*Harga adalah perkiraan dan dapat berubah sewaktu-waktu.</p>
            </div>
        </div>
    );
}

export default function Welcome() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { auth } = usePage<SharedData>().props;

  // @ts-ignore: Assume 'route' is globally available from Ziggy
  const route = window.route;

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const navLinks = [
    { href: "#hero", text: "Beranda" },
    { href: "#about", text: "Tentang" },
    { href: "#services", text: "Layanan" },
    { href: "#estimasi", text: "Estimasi" },
    { href: "#contact", text: "Kontak" },
  ];

  return (
    <div className="font-sans text-gray-900 antialiased">
      <Head title="Bengkel Las ATJ">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Raleway:wght@700&display=swap" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      {/* --- NAVBAR RESPONSIF --- */}
      <header className="fixed w-full z-50 top-0 transition-all duration-300 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#hero" className="text-2xl font-bold font-heading text-gray-900 flex items-center gap-2">
            <span className="bg-blue-600 text-white p-1 rounded">ATJ</span> Bengkel
          </a>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-medium hover:text-blue-600 transition-colors">
                {link.text}
              </a>
            ))}
          </nav>

          {/* Auth Buttons Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {auth.user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Halo, {auth.user.name}</span>
                {/* Logika Redirect Berdasarkan Role */}
                <Link 
                    href={route((auth.user as any).role === 'admin' ? 'dashboard' : 'my.orders')} 
                    className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors text-blue-600"
                >
                    {(auth.user as any).role === 'admin' ? 'Dashboard' : 'Pesanan Saya'}
                </Link>
                <Link href={route('logout')} method="post" as="button" className="text-red-600 text-sm font-medium hover:underline">
                    Keluar
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href={route('login')} className="text-gray-600 hover:text-gray-900 font-medium text-sm px-3 py-2">Masuk</Link>
                <Link href={route('register')} className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition">Daftar</Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-2xl text-gray-700">
            <Icon name={isMobileMenuOpen ? "x" : "list"} className="w-7 h-7" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-t p-4 shadow-xl absolute w-full">
                <nav className="flex flex-col space-y-2 px-4">
                    {navLinks.map((link) => (
                        <a key={link.href} href={link.href} className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>
                            {link.text}
                        </a>
                    ))}
                    <hr className="my-2" />
                    {auth.user ? (
                        <>
                            <Link href={route((auth.user as any).role === 'admin' ? 'dashboard' : 'my.orders')} className="text-blue-600 font-bold block px-3 py-2">
                                {(auth.user as any).role === 'admin' ? 'Dashboard' : 'Pesanan Saya'}
                            </Link>
                            <Link href={route('logout')} method="post" as="button" className="text-left text-red-600 block px-3 py-2 w-full">Keluar</Link>
                        </>
                    ) : (
                        <>
                            <Link href={route('login')} className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md">Masuk</Link>
                            <Link href={route('register')} className="bg-blue-600 text-white px-3 py-2 rounded-md text-center font-medium hover:bg-blue-700">Daftar</Link>
                        </>
                    )}
                </nav>
            </div>
        )}
      </header>

      <main className="pt-20">
        {/* --- HERO SECTION --- */}
        <section id="hero" className="relative pt-20 pb-32 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
            <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                <div data-aos="fade-right">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-6">
                        <Icon name="tools" /> JASA LAS PROFESIONAL
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                        Solusi Konstruksi <span className="text-blue-600">Baja & Las</span> Terpercaya.
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Kami melayani pembuatan pagar, kanopi, rangka atap, dan konstruksi besi lainnya dengan hasil rapi, kuat, dan bergaransi.
                    </p>
                    <div className="flex gap-4 flex-wrap">
                        <Link href={auth.user ? route('my.orders') : route('register')} className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition">
                            {auth.user ? 'Lihat Pesanan Saya' : 'Daftar & Pesan'}
                        </Link>
                        <a href="#estimasi" className="px-8 py-3 rounded-full font-semibold text-gray-600 border border-gray-300 hover:bg-gray-50 transition">
                            Cek Estimasi
                        </a>
                    </div>
                </div>
                <div className="relative" data-aos="fade-left">
                    {/* Placeholder Image */}
                    <img src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Welding" className="rounded-2xl shadow-2xl w-full object-cover h-[400px]" />
                    <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce">
                        <div className="bg-green-100 p-2 rounded-full text-green-600"><Icon name="check-circle" className="text-2xl"/></div>
                        <div>
                            <p className="text-xs text-gray-500">Kualitas Dijamin</p>
                            <p className="font-bold text-gray-900">Garansi 1 Tahun</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* --- LAYANAN SECTION --- */}
        <section id="services" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16" data-aos="fade-up">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Layanan Unggulan</h2>
                    <p className="text-gray-600">Kami mengerjakan berbagai kebutuhan konstruksi besi dengan material terbaik.</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: "Kanopi Baja Ringan", desc: "Pelindung rumah modern dengan atap awet.", icon: "house-door" },
                        { title: "Pagar Minimalis", desc: "Desain elegan, kuat, dan tahan karat.", icon: "shield-lock" },
                        { title: "Konstruksi Berat", desc: "Gudang, tangga putar, dan struktur baja.", icon: "building" }
                    ].map((item, idx) => (
                        <div key={idx} className="p-8 rounded-xl border hover:shadow-xl transition-all duration-300 text-left group" data-aos="fade-up" data-aos-delay={idx * 100}>
                            <div className="mb-4 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                                <Icon name={item.icon} className="text-5xl" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                            <p className="text-gray-600 text-sm mb-4">{item.desc}</p>
                            <Link href={auth.user ? '#' : route('register')} className="text-blue-600 font-semibold text-sm hover:underline">Pesan Layanan ini &rarr;</Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* --- ESTIMASI & KONTAK (Split Section) --- */}
        <section id="estimasi" className="py-20 bg-gray-900 text-white">
             <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                <div data-aos="fade-right">
                    <h2 className="text-3xl font-bold mb-6">Transparansi Harga Adalah Prioritas Kami.</h2>
                    <p className="text-gray-400 mb-8 text-lg">
                        Gunakan kalkulator sederhana ini untuk mendapatkan gambaran biaya proyek Anda. Untuk harga pasti, kami akan melakukan survei gratis ke lokasi Anda.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold">1</div>
                            <div>
                                <h4 className="font-bold">Pilih Layanan</h4>
                                <p className="text-sm text-gray-400">Tentukan apa yang ingin Anda buat.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold">2</div>
                            <div>
                                <h4 className="font-bold">Masukkan Ukuran</h4>
                                <p className="text-sm text-gray-400">Estimasi luas atau panjang area.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold">3</div>
                            <div>
                                <h4 className="font-bold">Dapat Estimasi</h4>
                                <p className="text-sm text-gray-400">Daftar akun untuk memesan survei.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="text-gray-900">
                    <EstimatorCalculator />
                </div>
             </div>
        </section>

        {/* --- FOOTER --- */}
        <footer id="contact" className="bg-gray-50 pt-16 pb-8 border-t">
            <div className="container mx-auto px-6 text-center md:text-left">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-2">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Bengkel Las ATJ<span className="text-blue-600">.</span></h3>
                        <p className="text-gray-600 max-w-sm text-sm">
                            Partner terbaik untuk mewujudkan hunian aman dan estetis. Melayani Jabodetabek dengan sepenuh hati.
                        </p>
                        <div className="flex gap-4 mt-4 justify-center md:justify-start text-gray-400">
                            <a href="#" className="hover:text-blue-600"><Icon name="facebook" className="text-xl"/></a>
                            <a href="#" className="hover:text-pink-600"><Icon name="instagram" className="text-xl"/></a>
                            <a href="#" className="hover:text-green-500"><Icon name="whatsapp" className="text-xl"/></a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Kontak</h4>
                        <ul className="space-y-2 text-gray-600 text-sm">
                            <li className="flex gap-2 justify-center md:justify-start"><Icon name="geo-alt"/> Jl. Raya Industri No. 12, Bekasi</li>
                            <li className="flex gap-2 justify-center md:justify-start"><Icon name="telephone"/> +62 812-3456-7890</li>
                            <li className="flex gap-2 justify-center md:justify-start"><Icon name="envelope"/> cs@bengkelatj.com</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Menu</h4>
                        <ul className="space-y-2 text-gray-600 text-sm">
                            {navLinks.map(l => <li key={l.href}><a href={l.href} className="hover:text-blue-600">{l.text}</a></li>)}
                        </ul>
                    </div>
                </div>
                <div className="border-t pt-8 text-center text-gray-400 text-xs">
                    &copy; {new Date().getFullYear()} Bengkel Las ATJ. All rights reserved.
                </div>
            </div>
        </footer>

        {/* Scroll-to-top button */}
        <a href="#hero" className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors z-40">
          <Icon name="arrow-up-short" className="w-7 h-7" />
        </a>
      </main>
    </div>
  );
}