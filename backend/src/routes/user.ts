import { Router, Request, Response } from "express";
import { findUserByEmail, findUserById } from "../services/user-services";
import bcrypt from "bcrypt"

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    const BuscarUsuario = await
})

router.post("/register", async (req: Request, res: Response) => {
    try {
        const { name, email, perfil, password } = req.body;

        if (!name || !password) {
            return res.status(400).json({ message: "E-mail, senha e Cnpj são obrigatórios" })
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        const newuser = await createsupplier({
            ...req.body,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "usuario criado com sucesso",
            userId: newuser.id
        });
    } catch (error) {
        console.error("Erro no registro:", error);
        return res.status(500).json({ message: "Erro interno do servidor ao criar conta." });
    }

});


router.patch


router.delete()

export default router