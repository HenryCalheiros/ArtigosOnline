import { useState, useEffect } from "react";
import { apiGet, apiDelete } from "../api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function MyPosts() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            loadPosts();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search, token]);

    async function loadPosts() {
        try {
            const query = search ? `?q=${search}` : "";
            const res = await apiGet(`/my-posts${query}`, token);
            setPosts(res);
        } catch (error) {
            console.error("Erro ao carregar meus posts", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm("Tem certeza que deseja apagar este post?")) return;

        try {
            await apiDelete(`/posts/${id}`, token);
            setPosts(posts.filter(p => p._id !== id));
        } catch (error) {
            alert("Erro ao deletar post");
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
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-slate-900">Meus Posts</h1>
                    <div className="w-full md:w-64">
                        <Input
                            placeholder="Pesquisar..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-slate-500 text-lg">
                            {search ? "Nenhum post encontrado na busca." : "Você ainda não tem posts."}
                        </p>
                        {!search && (
                            <Button className="mt-4" onClick={() => navigate("/new-post")}>Criar Primeiro Post</Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <Card key={post._id} className="p-6 relative">
                                <Link to={`/posts/${post._id}`} className="block group">
                                    <h2 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{post.title}</h2>
                                    <p className="text-slate-600 line-clamp-3 mb-4">{post.content}</p>
                                </Link>
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                                    <span className="text-xs text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" className="text-blue-600 hover:bg-blue-50 px-2 py-1 h-auto text-sm" onClick={() => navigate(`/edit-post/${post._id}`)}>
                                            Editar
                                        </Button>
                                        <Button variant="ghost" className="text-red-600 hover:bg-red-50 px-2 py-1 h-auto text-sm" onClick={() => handleDelete(post._id)}>
                                            Excluir
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
