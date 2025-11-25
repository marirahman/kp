<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminOnly
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
    {
        // Cek apakah user BUKAN admin
        if ($request->user() && $request->user()->role !== 'admin') {
            // Jika bukan admin, lempar ke halaman pesanan saya
            return redirect()->route('my.orders');
        }

        return $next($request);
    }
    }
}
