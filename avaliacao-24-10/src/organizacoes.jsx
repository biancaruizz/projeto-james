import { useEffect, useState } from 'react'
import './app.css'
import { db, auth } from './firebaseConnections'
import { doc, addDoc, collection, onSnapshot, setDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import organizacoes from './organizacoes.png';

function Organizacoes() {
    const [nome, setNome] = useState('')
    const [lider, setLider] = useState('')
    const [objetivo, setObjetivo] = useState('')
    const [habilidades, setHabilidades] = useState('')
    const [historia, setHistoria] = useState('')
    const [lista, setLista] = useState([])
    const [idItem, setIdItem] = useState('')

    const [admin, setAdmin] = useState(false)
    const [setLoadingUser] = useState(true)

    useEffect(() => {
       
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDocRef = doc(db, "users", user.uid)
                    const userDocSnap = await getDoc(userDocRef)

                    if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
                        setAdmin(true)
                    } else {
                        setAdmin(false)
                    }
                } catch (error) {
                    console.log("Erro ao verificar permissão:", error)
                }
            } else {
                setAdmin(false)
            }
            setLoadingUser(false)
        })

        return () => unsub()
    }, [])

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "organizacoes"), (snapshot) => {
            let dados = []
            snapshot.forEach((d) => {
                dados.push({ id: d.id, ...d.data() })
            })
            setLista(dados)
        })
        return () => unsubscribe()
    }, [])

    function limparCampos() {
        setIdItem('')
        setNome('')
        setLider('')
        setObjetivo('')
        setHabilidades('')
        setHistoria('')
    }

    async function handleAdd() {
        await addDoc(collection(db, "organizacoes"), {
            nome,
            lider,
            objetivo,
            habilidades,
            historia
        })
        .then(() => {
            limparCampos()
            console.log("Cadastrado com sucesso!")
        })
        .catch((error) => console.error("Erro ao cadastrar:", error))
    }

    function selecionarItem(item) {
        setIdItem(item.id)
        setNome(item.nome || '')
        setLider(item.lider || '')
        setObjetivo(item.objetivo || '')
        setHabilidades(item.habilidades || '')
        setHistoria(item.historia || '')
    }

    async function alterarItem() {
        if (!idItem) return alert("Selecione um organização primeiro!")
        const itemRef = doc(db, "organizacoes", idItem)
        await setDoc(itemRef, {
            nome,
            lider,
            objetivo,
            habilidades,
            historia
        })
        .then(() => {
            limparCampos()
            console.log("Atualizado com sucesso!")
        })
        .catch((error) => console.log("Erro ao atualizar:", error))
    }

    async function excluirItem(id) {
        await deleteDoc(doc(db, "organizacoes", id))
        .then(() => console.log("Excluído com sucesso!"))
        .catch((error) => console.log("Erro ao excluir:", error))
    }

    return (
<div className="fundo" style={style.fundo}>
            <div className='container'>
                {admin && (
                    <div className="quadrado-marrom quadrado-marrom-cad">
                        <h1>Cadastro de Organizações</h1>

                        <label>Nome</label>
                        <br />
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
                        <br />

                        <label>Líder</label>
                        <br />
                        <input type="text" value={lider} onChange={(e) => setLider(e.target.value)} />
                        <br />

                        <label>Objetivo</label>
                        <br />
                        <input type="text" value={objetivo} onChange={(e) => setObjetivo(e.target.value)} />
                        <br />

                        <label>Habilidades</label>
                        <br />
                        <input type="text" value={habilidades} onChange={(e) => setHabilidades(e.target.value)} />
                        <br />

                        <label>História</label>
                        <br />
                        <input type="text" value={historia} onChange={(e) => setHistoria(e.target.value)} />
                        <br />
                        <div className="container">
                            <button onClick={handleAdd}>Cadastrar</button>
                            <button onClick={alterarItem}>Alterar</button>
                        </div>    
                    </div>
                )}
                <div className="quadrado-marrom">
                    <h1>Lista de Organizacoes</h1>
                    {lista.length === 0 && <h1>Nenhum registro encontrado!</h1>}

                    {lista.map((item) => (
                        <ul key={item.id}>
                            <li>
                                <strong>Nome:</strong> {item.nome}<br />
                                <strong>Líder:</strong> {item.lider}<br />
                                <strong>Objetivo:</strong> {item.objetivo}<br />
                                <strong>Habilidades:</strong> {item.habilidades}<br />
                                <strong>História:</strong> {item.historia}<br />
                                {admin && (
                                    <div className="container">
                                        <button onClick={() => excluirItem(item.id)}>Excluir</button> &nbsp; &nbsp;
                                        <button onClick={() => selecionarItem(item)}>Selecionar</button>
                                    </div>
                                )}    
                            </li>
                        </ul>
                    ))}
                </div>
            </div>
        </div>
    )
}
const style = {
  fundo: {
    minHeight: '100vh',
    boxSizing: 'border-box',
    backgroundImage: `url(${organizacoes})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    padding: '20px',
  },
};
export default Organizacoes
