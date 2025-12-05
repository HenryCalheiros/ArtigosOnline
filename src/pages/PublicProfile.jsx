import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiGetUser, apiGet } from "../api"; // Assuming apiGet can filter by user
import Card from "../components/ui/Card";

export default function PublicProfile() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        async function loadData() {
            try {
                const userRes = await apiGetUser(id, token);
                setUser(userRes);

                if (userRes && userRes.email) {
                    const postsRes = await apiGet(`/posts?userId=${userRes.email}`, token);
                    setPosts(postsRes);
                }
            } catch (error) {
                console.error("Erro ao carregar perfil público", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, [id, token]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 pt-8 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return <div className="text-center py-10">Usuário não encontrado</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
            <div className="w-full max-w-4xl space-y-6">
                {/* Profile Info */}
                <Card className="p-8">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold">
                            {user.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
                            <p className="text-slate-500">{user.email}</p>
                        </div>
                    </div>
                    <div className="mt-6 bg-slate-50 p-6 rounded-lg border border-slate-100">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Sobre</h3>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {user.bio || "Este usuário não possui uma bio."}
                        </p>
                    </div>
                </Card>

                {/* User Posts */}
                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Posts de {user.name}</h2>
                {posts.length === 0 ? (
                    <p className="text-slate-500">Nenhum post encontrado.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {posts.map((post) => (
                            <Card key={post._id} className="p-6 hover:shadow-md transition-shadow group">
                                <Link to={`/posts/${post._id}`} className="block">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                                    <p className="text-slate-600 line-clamp-3 mb-4">{post.content}</p>
                                    <span className="text-xs text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                                </Link>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
