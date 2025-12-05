import { useState, useEffect } from "react";
import { apiPost, apiGet, apiPut } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Button from "../components/ui/Button";

export default function NewPost() {
  const { id } = useParams(); // Se tiver ID, é edição
  const isEditing = !!id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [activeTab, setActiveTab] = useState("write"); // 'write' or 'preview'
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!id);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isEditing) {
      async function loadPost() {
        try {
          const res = await apiGet(`/posts/${id}`, token);
          setTitle(res.title);
          setContent(res.content);
        } catch (error) {
          console.error("Erro ao carregar post", error);
          alert("Erro ao carregar post para edição");
          navigate("/my-posts");
        } finally {
          setIsFetching(false);
        }
      }
      loadPost();
    }
  }, [id, token, isEditing, navigate]);

  async function handleSave(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsLoading(true);
    try {
      if (isEditing) {
        await apiPut(`/posts/${id}`, { title, content }, token);
      } else {
        await apiPost("/posts", { title, content }, token);
      }
      navigate(isEditing ? "/my-posts" : "/posts");
    } catch (error) {
      alert("Erro ao salvar post");
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return (
      <div className="min-h-screen bg-white pt-20 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            {isEditing ? "Editar Artigo" : "Novo Artigo"}
          </h1>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate(-1)}>Cancelar</Button>
            <Button onClick={handleSave} isLoading={isLoading}>
              {isEditing ? "Salvar Alterações" : "Publicar"}
            </Button>
          </div>
        </div>

        {/* Title Input */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Título do Artigo"
            className="w-full text-4xl font-extrabold text-slate-900 placeholder:text-slate-300 border-none focus:ring-0 p-0 bg-transparent outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus={!isEditing}
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 mb-6 flex gap-8">
          <button
            className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'write' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('write')}
          >
            Escrever
          </button>
          <button
            className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'preview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('preview')}
          >
            Visualizar
          </button>
        </div>

        {/* Editor Area */}
        <div className="min-h-[500px]">
          {activeTab === 'write' ? (
            <textarea
              className="w-full h-[60vh] resize-none border-none focus:ring-0 p-0 text-lg text-slate-700 leading-relaxed placeholder:text-slate-300 outline-none"
              placeholder="Comece a escrever sua história... (Markdown suportado: **negrito**, # título, - lista)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          ) : (
            <article className="prose prose-slate lg:prose-lg max-w-none">
              <ReactMarkdown>
                {content || "*Nada para visualizar ainda...*"}
              </ReactMarkdown>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}
