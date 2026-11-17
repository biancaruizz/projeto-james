import { useEffect, useState } from 'react'
import './app.css'
import { db, auth } from './firebaseConnections'
import { doc, getDoc, addDoc, collection, getDocs, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'

function App() {
    const [titulo, setTitulo] = useState('')
    const [autor, setAutor] = useState('')
    const [posts, setPosts] = useState([])
    const [idPost, setIdPost] = useState('')

    const [email, setEmail] = useState('') 
    const [senha, setSenha] = useState('')
    const [user, setUser] = useState(false)
    const [userDetail, setUserDetail] = useState({})

    useEffect(() => {
        async function listaPosts(){
            onSnapshot(collection(db, "posts"), (snapshot) => {
                let lista = [];
                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        ...doc.data()
                    })
                })
                setPosts(lista);
            })
        }
        listaPosts()
    }, [])

    async function handleAdd(){
        await addDoc(collection(db, "posts"), {
            titulo: titulo,
            autor: autor
        })
        .then(() => {
            setAutor('')
            setTitulo('')
            console.log("dados cadastrados com sucesso!");
        })
        .catch((error) => {
            console.error("gerou um erro: ", error);
        })      
    }

    async function buscarPost(){
        await getDocs(collection(db, "posts"))
        .then((snapshot) => {
            let lista = []
            snapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    titulo: doc.data().titulo,
                    autor: doc.data().autor
                })
            })
            console.log("Lista de posts:", lista);  
        })
        .catch((error) => {
            console.log(`gerou um erro: ${error}`)
        })
    }

    async function allPost(){
        await getDocs(collection(db, "posts"))
        .then((snapshot) => {
            let lista = []
            snapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    titulo: doc.data().titulo,
                    autor: doc.data().autor
                })
            })
            setPosts(lista)
        })
        .catch((error) => {
            console.log("Erro ao buscar todos:", error);
        })
    }

    function selecionarPost(id, autor, titulo){
        setIdPost(id)
        setAutor(autor)
        setTitulo(titulo)
    }

    async function alterarPost(){
        const postRef = doc(db, "posts", idPost);
        await setDoc(postRef, {
            titulo: titulo,
            autor: autor
        })
        .then(() => {
            console.log("Post atualizado com sucesso!");
        })
        .catch((error) => {
            console.log("Erro ao atualizar o post:", error);
        })
    }

    async function excluirPost(id){
        const postRef = doc(db, "posts", id)
        await deleteDoc(postRef)
        .then(() => {
            console.log("Post excluído com sucesso!")
        })
        .catch((error) => {
            console.log("Erro ao excluir o post:", error)
        })
    }

    async function novoUser(){
        await createUserWithEmailAndPassword(auth, email, senha)
        .then( (value) => {
            console.log("Usuário cadastrado com sucesso =>", value.user)
            console.log(value.user)
            setEmail('')
            setSenha('')
        })
        .catch ( (error) => {
            if(error.code === 'auth/weak-password'){
                alert("Senha muito fraca")
                return;
            }
            if(error.code === 'auth/email-already-in-use'){
                alert("Email já cadastrado")
                return;
            }
            console.log("Gerou um erro =>", error)
               })
    }

    async function loginUser(){
        await signInWithEmailAndPassword(auth, email, senha)
        .then((value) => {
            console.log("Usuário logado com sucesso ")
            console.log(value.user)
            setUser(true)
            setUserDetail({
                uid: value.user.uid,
                email: value.user.email
            })
            setEmail('')
            setSenha('')

        })
        .catch((error) => {
            if(error.code === 'auth/wrong-password'){
                alert("Senha incorreta")
                return;
            }
            else if(error.code === 'auth/user-not-found'){
                alert("Usuário não encontrado")
                return;
            }
            console.log("Gerou um erro =>", error)
        })
    }

    async function logout(){
        await auth.singOut()
        .then(() => {
            setUser(false)
            setUserDetail({})
        })
    }

    return (
        <div className='container'>

            {user && (
                <div>
                    <strong>Seja bem vindo:</strong> {userDetail.email} 
                    <strong> ID:</strong> {userDetail.uid}
                    <button onClick={logout}> Sair </button>
                </div>
            )}

            <h1>Cadastro de Usuários</h1>

            <label from="e-mail">E-mail</label>
            <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/> 

            <label from="senha">Senha</label>
            <input type="password" name="senha" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)}/> 

            <button onClick={novoUser}>Cadastrar User</button>
            <button onClick={loginUser}>Login User</button>    
                
                
            <h1>Cadastro de Posts</h1>

            <label>ID</label>
            <input type="text" value={idPost} onChange={(e) => setIdPost(e.target.value)} disabled />

            <label>Título</label>
            <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)}/>

            <label>Autor</label>
            <input type="text" value={autor} onChange={(e) => setAutor(e.target.value)}/>

            <button onClick={handleAdd}>Cadastrar</button>
            <button onClick={buscarPost}>Buscar</button>
            <button onClick={allPost}>Todos os post</button>
            <button onClick={alterarPost}>Alterar</button>

            <hr />

            {posts.length === 0 && (
                <h1>Nenhum post encontrado!</h1>
            )}

            {posts.map((item) => (
                <ul key={item.id}>
                    <li>
                        <strong>ID:</strong> {item.id}<br />
                        <strong>Título:</strong> {item.titulo}<br />
                        <strong>Autor:</strong> {item.autor}<br />
                        <button onClick={() => excluirPost(item.id)}> Excluir </button> &nbsp; &nbsp;
                        <button onClick={() => selecionarPost(item.id, item.autor, item.titulo)}> Selecionar </button>
                    </li>
                </ul>
            ))}

        </div>
    )
}

export default App
