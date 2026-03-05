import { Router, Request, Response } from "express";
import { createuser, listarUsuarios, editarUsuario, excluirUsuario } from "../services/user-services";
import bcrypt from "bcrypt"

const router = Router();

router.get("/usuarios", async (req: Request, res: Response) => {
    try {
        const BuscarUsuario = await listarUsuarios();
        res.json(BuscarUsuario)
    } catch (error) {
        res.status(500).json(`erro ao buscar usuarios ${error}`)
    }
});

router.post("/register-user", async (req: Request, res: Response) => {
    try {
        const { nome, email, perfil, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ message: "E-mail, email e  são obrigatórios" })
        };
        const hashedPassword = await bcrypt.hash(senha, 10);
        const newuser = await createuser({
            nome,
            email,
            perfil,
            senha: hashedPassword
        });
        console.log(newuser)
        return res.status(201).json({
            message: "usuario criado com sucesso",
            userId: newuser.id
        });
    } catch (error) {
        console.error("Erro no registro:", error);
        return res.status(500).json({ message: "Erro interno do servidor ao criar conta." });
    }

});

router.put("/usuarios/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const dadosAtualizados = req.body;

        await editarUsuario(id, dadosAtualizados);

        res.json({ message: "Usuário atualizado com sucesso!" });
    } catch (error) {
        console.error("Erro ao editar usuário:", error);
        res.status(500).json({ error: "Erro interno ao atualizar usuário." });
    }
});

router.delete("/usuarios/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await excluirUsuario(id);

        res.json({ message: "Usuário removido com sucesso!" });
    } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        res.status(500).json({ error: "Erro interno ao excluir usuário." });
    }
});

export default router