import express from 'express';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "seusecretomuitoseguro123";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://henrycf7_db_user:RIofRbJdo2So3ez0@cluster0.zxos5kq.mongodb.net/?appName=Cluster0";

// Configuração do MongoDB
const client = new MongoClient(MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.use(cors());
app.use(express.json());

async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Conectado ao MongoDB com sucesso!");

        const db = client.db("frontend_app");
        const usersCollection = db.collection("users");
        const postsCollection = db.collection("posts");

        // Middleware de autenticação
        const authenticateToken = (req, res, next) => {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            if (!token) return res.sendStatus(401);

            jwt.verify(token, JWT_SECRET, (err, user) => {
                if (err) return res.sendStatus(403);
                req.user = user;
                next();
            });
        };

        // Rotas de Auth
        app.post('/auth/register', async (req, res) => {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ error: "Todos os campos são obrigatórios" });
            }

            const existingUser = await usersCollection.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: "E-mail já cadastrado" });
            }

            const newUser = { name, email, password, createdAt: new Date() };
            await usersCollection.insertOne(newUser);
            res.status(201).json({ message: "Usuário criado com sucesso" });
        });

        app.post('/auth/login', async (req, res) => {
            const { email, password } = req.body;
            const user = await usersCollection.findOne({ email, password }); // Em produção, use hash de senha

            if (!user) {
                return res.status(400).json({ error: "Credenciais inválidas" });
            }

            const token = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, user: { name: user.name, email: user.email } });
        });

        // Rotas de Posts
        app.get('/posts', authenticateToken, async (req, res) => {
            const { q, userId } = req.query;
            let query = {};

            if (userId) {
                query["author.email"] = userId;
            }

            if (q) {
                query.$or = [
                    { title: { $regex: q, $options: 'i' } },
                    { content: { $regex: q, $options: 'i' } }
                ];
            }

            const posts = await postsCollection.find(query).sort({ createdAt: -1 }).toArray();
            res.json(posts);
        });

        app.get('/my-posts', authenticateToken, async (req, res) => {
            const { q } = req.query;
            const query = {
                "author.email": req.user.email,
                ...(q ? {
                    $or: [
                        { title: { $regex: q, $options: 'i' } },
                        { content: { $regex: q, $options: 'i' } }
                    ]
                } : {})
            };
            const posts = await postsCollection.find(query).sort({ createdAt: -1 }).toArray();
            res.json(posts);
        });

        app.post('/posts', authenticateToken, async (req, res) => {
            const { title, content } = req.body;
            if (!title || !content) {
                return res.status(400).json({ error: "Título e conteúdo são obrigatórios" });
            }

            const newPost = {
                title,
                content,
                author: { name: req.user.name, email: req.user.email },
                createdAt: new Date()
            };

            const result = await postsCollection.insertOne(newPost);
            res.status(201).json({ ...newPost, id: result.insertedId });
        });

        app.delete('/posts/:id', authenticateToken, async (req, res) => {
            const { id } = req.params;
            try {
                const post = await postsCollection.findOne({ _id: new ObjectId(id) });

                if (!post) return res.status(404).json({ error: "Post não encontrado" });
                if (post.author.email !== req.user.email) {
                    return res.status(403).json({ error: "Você não tem permissão para deletar este post" });
                }

                await postsCollection.deleteOne({ _id: new ObjectId(id) });
                res.json({ message: "Post deletado com sucesso" });
            } catch (e) {
                res.status(400).json({ error: "ID inválido" });
            }
        });

        app.put('/posts/:id', authenticateToken, async (req, res) => {
            const { id } = req.params;
            const { title, content } = req.body;

            try {
                const post = await postsCollection.findOne({ _id: new ObjectId(id) });

                if (!post) return res.status(404).json({ error: "Post não encontrado" });
                if (post.author.email !== req.user.email) {
                    return res.status(403).json({ error: "Você não tem permissão para editar este post" });
                }

                await postsCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { title, content } }
                );
                res.json({ message: "Post atualizado com sucesso" });
            } catch (e) {
                res.status(400).json({ error: "ID inválido" });
            }
        });

        // Rotas de Usuários (Busca e Perfil Público)
        app.get('/users', authenticateToken, async (req, res) => {
            const { q } = req.query;
            if (!q) return res.json([]);

            const users = await usersCollection.find({
                name: { $regex: q, $options: 'i' }
            }).project({ password: 0 }).toArray();

            res.json(users);
        });

        app.get('/users/:id', authenticateToken, async (req, res) => {
            const { id } = req.params;
            try {
                const user = await usersCollection.findOne({ _id: new ObjectId(id) });
                if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

                const { password, ...safeUser } = user;
                res.json(safeUser);
            } catch (e) {
                res.status(400).json({ error: "ID inválido" });
            }
        });

        // Rota de Post Único (Article View)
        app.get('/posts/:id', authenticateToken, async (req, res) => {
            const { id } = req.params;
            try {
                const post = await postsCollection.findOne({ _id: new ObjectId(id) });
                if (!post) return res.status(404).json({ error: "Post não encontrado" });
                res.json(post);
            } catch (e) {
                res.status(400).json({ error: "ID inválido" });
            }
        });

        // Rotas de Perfil (Meu Perfil)
        app.get('/me', authenticateToken, async (req, res) => {
            const user = await usersCollection.findOne({ email: req.user.email });
            if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

            const { password, ...safeUser } = user;
            res.json(safeUser);
        });

        app.put('/me', authenticateToken, async (req, res) => {
            const { name, bio } = req.body;

            await usersCollection.updateOne(
                { email: req.user.email },
                { $set: { name, bio } }
            );

            await postsCollection.updateMany(
                { "author.email": req.user.email },
                { $set: { "author.name": name } }
            );

            res.json({ message: "Perfil atualizado com sucesso" });
        });

        app.get('/', (req, res) => {
            res.json({ message: "Backend da aplicação está rodando! 🚀" });
        });

        app.listen(port, () => {
            console.log(`Servidor rodando em http://localhost:${port}`);
        });

    } catch (dir) {
        console.dir(dir);
    }
}

run().catch(console.dir);
