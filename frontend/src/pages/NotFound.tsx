import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-6">
            <div className="w-full max-w-3xl">
                <Card className="shadow-2xl border-none">
                    <CardHeader className="text-center border-b bg-gray-50/50">
                        <CardTitle className="text-3xl font-extrabold flex items-center justify-center gap-3">
                            <AlertTriangle className="text-orange-500" /> Página não encontrada
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-2">Ops — a página que você tentou acessar não existe (404).</p>
                    </CardHeader>

                    <CardContent className="p-8 text-center">
                        <p className="text-gray-700 mb-6">Pode ter sido removida, alterada, ou você digitou o link errado.</p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link to="/">
                                <Button className="bg-[var(--color-primary)] text-gray-900">Ir para o Painel</Button>
                            </Link>
                            <Link to="/fornecedores">
                                <Button variant="outline">Ver fornecedores</Button>
                            </Link>
                        </div>

                        <div className="mt-8 text-xs text-gray-400">Se precisar de ajuda, entre em contato com o suporte.</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
