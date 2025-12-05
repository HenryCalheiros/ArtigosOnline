import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { apiGet } from "../api";
import Button from "../components/ui/Button";

export default function PostDetails() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        async function loadPost() {
            try {
                const res = await apiGet(`/posts/${id}`, token);
                setPost(res);
            } catch (error) {
                console.error("Erro ao carregar post", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadPost();
    }, [id, token]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 pt-8 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!post) {
        return <div className="text-center py-10">Post não encontrado</div>;
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-3xl mx-auto px-6 py-12">
                <Link to="/posts">
                    <Button variant="ghost" className="mb-8 pl-0 hover:bg-transparent hover:text-blue-600">
                        ← Voltar para o Feed
                    </Button>
                </Link>

                <article className="prose prose-slate lg:prose-lg max-w-none">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-3 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-100">
                        <span className="font-medium text-slate-900">{post.author?.name || "Anônimo"}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>

                    <div className="markdown-content text-slate-700 leading-relaxed space-y-4">
                        <ReactMarkdown>
                            {post.content}
                        </ReactMarkdown>
                    </div>
                </article>
            </div>
        </div>
    );
}
