import { useState } from "react";
import { apiPost } from "../api";
import { useNavigate, Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await apiPost("/auth/login", { email, password });
      if (res.token) {
        login(res.token, res.user);
      } else {
        alert(res.error || "Erro ao fazer login");
      }
    } catch (error) {
      alert("Erro de conexão");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Bem-vindo de volta</h1>
          <p className="text-slate-600">Entre na sua conta para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            label="E-mail"
            placeholder="seu@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Senha"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Entrar
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Não tem uma conta?{" "}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            Cadastre-se
          </Link>
        </div>
      </Card>
    </div>
  );
}
