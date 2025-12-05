import { useState } from "react";
import { apiPost } from "../api";
import { useNavigate, Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await apiPost("/auth/register", { name, email, password });
      if (res.message === "Usuário criado com sucesso") {
        alert("Cadastro realizado! Faça login.");
        navigate("/login");
      } else {
        alert(res.error || "Erro ao registrar");
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Crie sua conta</h1>
          <p className="text-slate-600">Comece a compartilhar suas ideias hoje</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <Input
            label="Nome"
            placeholder="Seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            Cadastrar
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Entrar
          </Link>
        </div>
      </Card>
    </div>
  );
}
