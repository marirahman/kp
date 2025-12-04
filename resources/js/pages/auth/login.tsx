import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout 
            title="Masuk ke Bengkel ATJ" 
            description="Silakan masukkan email dan kata sandi Anda untuk melanjutkan"
        >
            <Head title="Masuk" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    {/* Email Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="email">Alamat Email</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="nama@email.com"
                            className="rounded-lg"
                        />
                        <InputError message={errors.email} />
                    </div>

                    {/* Password Input */}
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Kata Sandi</Label>
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="ml-auto text-sm text-blue-600 hover:text-blue-700" tabIndex={5}>
                                    Lupa kata sandi?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            className="rounded-lg"
                        />
                        <InputError message={errors.password} />
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onClick={() => setData('remember', !data.remember)}
                            tabIndex={3}
                            className="border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Label htmlFor="remember" className="font-normal text-gray-600">Ingat saya</Label>
                    </div>

                    {/* Tombol Login - Disesuaikan warna biru Bengkel ATJ */}
                    <Button 
                        type="submit" 
                        className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors" 
                        tabIndex={4} 
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                        Masuk
                    </Button>
                </div>

                {/* Link Daftar */}
                <div className="text-muted-foreground text-center text-sm">
                    Belum punya akun?{' '}
                    <TextLink href={route('register')} tabIndex={5} className="text-blue-600 font-semibold hover:underline">
                        Daftar Sekarang
                    </TextLink>
                </div>
            </form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">{status}</div>}
        </AuthLayout>
    );
}