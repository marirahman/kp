// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <AuthLayout 
            title="Lupa Kata Sandi" 
            description="Masukkan email Anda, kami akan mengirimkan tautan untuk mereset kata sandi."
        >
            <Head title="Lupa Kata Sandi" />

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <form onSubmit={submit}>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Alamat Email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            value={data.email}
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="nama@email.com"
                            className="rounded-lg"
                            disabled={processing}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="my-6 flex items-center justify-start">
                        <Button 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors" 
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Kirim Tautan Reset
                        </Button>
                    </div>
                </form>

                <div className="text-muted-foreground space-x-1 text-center text-sm">
                    <span>Kembali ke halaman</span>
                    <TextLink href={route('login')} className="text-blue-600 font-semibold hover:underline">
                        Masuk
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}