import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout 
            title="Daftar Akun Baru" 
            description="Lengkapi data diri Anda untuk mulai memesan jasa las dan konstruksi"
        >
            <Head title="Daftar" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    {/* Nama Lengkap */}
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Nama Lengkap Anda"
                            className="rounded-lg"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    {/* Email */}
                    <div className="grid gap-2">
                        <Label htmlFor="email">Alamat Email</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="nama@email.com"
                            className="rounded-lg"
                        />
                        <InputError message={errors.email} />
                    </div>

                    {/* Password */}
                    <div className="grid gap-2">
                        <Label htmlFor="password">Kata Sandi</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="••••••••"
                            className="rounded-lg"
                        />
                        <InputError message={errors.password} />
                    </div>

                    {/* Konfirmasi Password */}
                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="••••••••"
                            className="rounded-lg"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    {/* Tombol Daftar - Disesuaikan warna biru */}
                    <Button 
                        type="submit" 
                        className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors" 
                        tabIndex={5} 
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                        Daftar Sekarang
                    </Button>
                </div>

                {/* Link Login */}
                <div className="text-muted-foreground text-center text-sm">
                    Sudah punya akun?{' '}
                    <TextLink href={route('login')} tabIndex={6} className="text-blue-600 font-semibold hover:underline">
                        Masuk di sini
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}