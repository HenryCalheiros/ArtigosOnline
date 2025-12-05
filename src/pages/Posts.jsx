import { useState, useEffect } from "react";
import { apiGet } from "../api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Link } from "react-router-dom";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadPosts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, token]);

  async function loadPosts() {
    try {
      const query = search ? `?q=${search}` : "";
      const res = await apiGet(`/posts${query}`, token);
      setPosts(res);
    } catch (error) {
      console.error("Erro ao carregar posts", error);
    } finally {
      setIsLoading(false);
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
          <h1 className="text-3xl font-bold text-slate-900">Feed</h1>
          <div className="flex gap-4 w-full md:w-auto items-center">
            <div className="w-full md:w-64">
              <Input
                placeholder="Pesquisar posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadPosts()}
              />
            </div>
            <Link to="/new-post">
              <Button>Criar Post</Button>
            </Link>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">Nenhum post encontrado.</p>
            <Link to="/new-post" className="text-blue-600 hover:underline mt-2 inline-block">
              Seja o primeiro a postar!
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post._id} className="p-6 hover:shadow-md transition-shadow duration-200 flex flex-col h-full group">
                <Link to={`/posts/${post._id}`} className="block flex-grow">
                  <h2 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{post.title}</h2>
                  <p className="text-slate-600 line-clamp-3 mb-4">{post.content}</p>
                </Link>
                <div className="flex justify-between items-center text-sm text-slate-500 mt-auto pt-4 border-t border-slate-50">
                  <Link to={`/users/${post.author?.email}`} className="hover:text-blue-600 hover:underline">
                    {post.author?.name || "Anônimo"}
                  </Link>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
