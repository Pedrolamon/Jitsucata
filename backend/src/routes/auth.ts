import bcrypt from "bcrypt"
import jwt, { Secret, SignOptions } from "jsonwebtoken"
import { Router, Request, Response } from "express"
import { AuthRequest, authenticateJWT } from "../middleware/auth.js"
import { findUserByEmail, findUserById, findUserByEmailAnyTable } from "../services/user-services.js";
import { deleteSupplier, approveSupplier, getPendingSuppliers, createsupplier } from "../services/Fornecedores-services.js";
import { Usuario } from "../types/express.js";

const router = Router();


router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        const user = await findUserByEmailAnyTable(email);
        if (!user) {
            return res.status(401).json({ message: "invalid credentials" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "invalid credentials" })
        }

        if (user.status === false) {
            return res.status(403).json({ message: "Sua conta ainda está pendente de aprovação pelo administrador." });
        }

        const secret: Secret = process.env.JWT_SECRET || "secret";
        const expiresInValue: string = process.env.JWT_EXPIRES_IN || "1d";
        const jwtSignOptions: SignOptions = { expiresIn: expiresInValue as SignOptions["expiresIn"] }

        const token = jwt.sign({ id: user.id, role: user.role }, secret, jwtSignOptions);
        const { password: userPassword, table: _, ...userData } = user;

        return res.json({ token, user: userData })
    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(500).json({ message: "Erro interno ao autenticar" });
    }
});

router.get("/me", authenticateJWT, async (req: AuthRequest, res: Response) => {
    try {

        if (!req.userId || typeof req.userId !== 'string') {
            return res.status(401).json({ message: "Usuário não autenticado." });
        }

        const user = await findUserById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "User not fund." });
        }
        return res.json(user);
    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ message: "Erro ao buscar os dados do usuário." });
    }
});



router.post("/register", async (req: Request, res: Response) => {
    try {
        const { name, cnpj, stateRegistration, address, EnvironmentalLicense, LegalRepresentative, Phone, capacity, email, observacoes, legalNature, password } = req.body;

        if (!name || !cnpj || !password) {
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

router.post("/logout", authenticateJWT, async (req: Request, res: Response) => {
    return res.status(200).json({ message: "logout." });
});




export default router