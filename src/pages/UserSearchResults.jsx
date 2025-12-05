import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { apiGetUsers } from "../api";
import Card from "../components/ui/Card";

export default function UserSearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        async function search() {
            if (!query) return;
            setIsLoading(true);
            try {
                const res = await apiGetUsers(query, token);
                setUsers(res);
            } catch (error) {
                console.error("Erro ao buscar usuários", error);
            } finally {
                setIsLoading(false);
            }
        }
        search();
    }, [query, token]);

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Resultados para "{query}"</h1>

                {isLoading ? (
                    <div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
                ) : users.length === 0 ? (
                    <p className="text-slate-500">Nenhum usuário encontrado.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {users.map(user => (
                            <Link key={user._id} to={`/users/${user._id}`}>
                                <Card className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                        {user.name?.[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{user.name}</h3>
                                        <p className="text-sm text-slate-500">{user.email}</p>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
