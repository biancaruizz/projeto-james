import { useState } from 'react'
import './app.css'
import { useNavigate } from 'react-router-dom'
import { db, auth } from './firebaseConnections'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

function Login() {
    const [email, setEmail] = useState('') 
    const [senha, setSenha] = useState('')
    const [role, setRole] = useState('cliente')
    const [isLogin, setIsLogin] = useState(true) // true = tela de login, false = tela de cadastro
    const navigate = useNavigate();

    // CADASTRAR NOVO USUÁRIO
    async function novoUser(){
        if (!email || !senha) {
            alert("Preencha todos os campos!");
            return;
        }

        try {
            const value = await createUserWithEmailAndPassword(auth, email, senha);

            await setDoc(doc(db, "users", value.user.uid), {
                email: email,
                role: role,
                createdAt: new Date()
            });

            alert(`Usuário cadastrado como ${role.toUpperCase()} com sucesso!`);
            setEmail('');
            setSenha('');
            setRole('cliente');
            setIsLogin(true); //vai para a tela de login após cadastrar

        } catch (error) {
            if(error.code === 'auth/weak-password'){
                alert("Senha muito fraca (mínimo de 6 caracteres)");
            } else if(error.code === 'auth/email-already-in-use'){
                alert("E-mail já cadastrado");
            } else {
                console.log("Erro ao cadastrar =>", error);
                alert("Erro ao cadastrar usuário.");
            }
        }
    }

    // LOGIN
    async function loginUser(){
        if (!email || !senha) {
            alert("Preencha e-mail e senha!");
            return;
        }

        try {
            const value = await signInWithEmailAndPassword(auth, email, senha);
            
            const userDocRef = doc(db, "users", value.user.uid);
            const userDocSnap = await getDoc(userDocRef);

            let userRole = 'cliente';
            if (userDocSnap.exists()) {
                userRole = userDocSnap.data().role;
            }

            setEmail('');
            setSenha('');

            navigate("/home");

        } catch (error) {
            if(error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential'){
                alert("Senha incorreta ou credenciais inválidas");
            } else if(error.code === 'auth/user-not-found'){
                alert("Usuário não encontrado");
            } else {
                console.log("Erro no login =>", error);
                alert("Erro ao realizar login.");
            }
        }
    }

    return (
        <div className="home-container">
            <div className="container">
                <div className="quadrado-verde">

                    {/* Título dinâmico */}
                    <h1>{isLogin ? "Login" : "Cadastro de Usuário"}</h1>

                    <label htmlFor="email">E-mail</label>
                    <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                    /> 

                    <label htmlFor="senha">Senha</label>
                    <input 
                        type="password" 
                        name="senha" 
                        id="senha" 
                        value={senha} 
                        onChange={(e) => setSenha(e.target.value)}
                    /> 

                    {/* Exibe o Tipo de Conta SOMENTE na tela de Cadastro */}
                    {!isLogin && (
                        <>
                            <label htmlFor="role">Tipo de Conta</label>
                            <br />
                            <select 
                                id="role" 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="cliente">Cliente</option>
                                <option value="admin">Administrador</option>
                            </select>
                            <br />
                        </>
                    )}

                    <div className="container">
                        {isLogin ? (
                            <>
                                <button onClick={loginUser}>Entrar</button>
                                <button onClick={() => setIsLogin(false)} style={{ backgroundColor: 'rgba(60, 30, 15, 0.5)', 
                                    border: 'none', color: '#fff', textDecoration: 'none', cursor: 'pointer' }}>
                                    Criar conta
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={novoUser}>Cadastrar</button>
                                <button onClick={() => setIsLogin(true)} style={{ 
                                    backgroundColor: 'rgba(60, 30, 15, 0.5)', color: '#fff', 
                                    border: 'none', textDecoration: 'none', cursor: 'pointer' 
                                }}>
                                    Voltar para Login
                                </button>
                            </>
                        )}
                    </div>

                </div> 
            </div>
        </div>
    )
}

export default Login