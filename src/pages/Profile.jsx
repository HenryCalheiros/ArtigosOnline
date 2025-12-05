import { useState, useEffect } from "react";
import { apiGet, apiPut } from "../api";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
    const { token, user: authUser, login } = useAuth(); // login usado para atualizar o estado global se necessario
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Form state
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");

    useEffect(() => {
        loadProfile();
    }, [token]);

    async function loadProfile() {
        try {
            const res = await apiGet("/me", token);
            setUser(res);
            setName(res.name);
            setBio(res.bio || "");
        } catch (error) {
            console.error("Erro ao carregar perfil", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSave(e) {
        e.preventDefault();
        try {
            await apiPut("/me", { name, bio }, token);
            setUser({ ...user, name, bio });
            setIsEditing(false);
            // Opcional: Atualizar contexto global se quisermos que o header mude na hora
            // login(token, { ...authUser, name }); 
        } catch (error) {
            alert("Erro ao salvar perfil");
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 pt-8 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex justify-center">
            <div className="w-full max-w-2xl">
                <Card className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-slate-900">Meu Perfil</h1>
                        {!isEditing && (
                            <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSave} className="space-y-6">
                            <Input
                                label="Nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                                <textarea
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 min-h-[120px] resize-none"
                                    placeholder="Conte um pouco sobre você..."
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-4 justify-end">
                                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancelar</Button>
                                <Button type="submit">Salvar Alterações</Button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
                                    {user?.name?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">{user?.name}</h2>
                                    <p className="text-slate-500">{user?.email}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Sobre</h3>
                                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                    {user?.bio || "Nenhuma bio definida ainda."}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex gap-4 text-sm text-slate-500">
                                <span>📅 Membro desde {new Date(user?.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
