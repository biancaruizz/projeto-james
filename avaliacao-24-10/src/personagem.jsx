import { useEffect, useState } from 'react'
import './app.css'
import { db, auth } from './firebaseConnections'
import { doc, addDoc, collection, onSnapshot, setDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import modos from './modos.png';

function Personagem() {
    const [nome, setNome] = useState('')
    const [idade, setIdade] = useState('')
    const [cla, setCla] = useState('')
    const [vila, setVila] = useState('')
    const [nivel, setNivel] = useState('')
    const [habilidade, setHabilidade] = useState('')
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

    //atualiza a lista
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "personagem"), (snapshot) => {
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
        setIdade('')
        setCla('')
        setVila('')
        setNivel('')
        setHabilidade('')
    }

    async function handleAdd() {
        await addDoc(collection(db, "personagem"), {
            nome,
            Idade: idade,
            cla,
            vila,
            nivel,
            habilidade
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
        setIdade(item.Idade || '')
        setCla(item.cla || '')
        setVila(item.vila || '')
        setNivel(item.nivel || '')
        setHabilidade(item.habilidade || '')
    }

    async function alterarItem() {
        if (!idItem) return alert("Selecione um personagem primeiro!")
        const itemRef = doc(db, "personagem", idItem)
        await setDoc(itemRef, {
            nome,
            Idade: idade,
            cla,
            vila,
            nivel,
            habilidade
        })
        .then(() => {
            limparCampos()
            console.log("Atualizado com sucesso!")
        })
        .catch((error) => console.log("Erro ao atualizar:", error))
    }

    async function excluirItem(id) {
        await deleteDoc(doc(db, "personagem", id))
        .then(() => console.log("Excluído com sucesso!"))
        .catch((error) => console.log("Erro ao excluir:", error))
    }

    return (
        <div className="fundo" style={style.fundo}>
            <div className='container'>
                {admin && (
                    <div className="quadrado-marrom quadrado-marrom-cad">
                        <h1>Cadastro de Personagens</h1>

                        
                        <label>Nome</label>
                        <br />
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
                        <br />

                        <label>Idade</label>
                        <br />
                        <input type="text" value={idade} onChange={(e) => setIdade(e.target.value)} />
                        <br />

                        <label>Clã</label>
                        <br />
                        <input type="text" value={cla} onChange={(e) => setCla(e.target.value)} />
                        <br />

                        <label>Vila</label>
                        <br />
                        <input type="text" value={vila} onChange={(e) => setVila(e.target.value)} />
                        <br />

                        <label>Nível</label>
                        <br />
                        <input type="text" value={nivel} onChange={(e) => setNivel(e.target.value)} />
                        <br />

                        <label>Habilidade</label>
                        <br />
                        <input type="text" value={habilidade} onChange={(e) => setHabilidade(e.target.value)} />
                        <br />
                        <div className="container">
                            <button onClick={handleAdd}>Cadastrar</button>
                            <button onClick={alterarItem}>Alterar</button>
                        </div>    
                    </div>
                )}
                <div className="quadrado-marrom">
                    <h1>Lista de Personagens</h1>
                    {lista.length === 0 && <h1>Nenhum registro encontrado!</h1>}

                    {lista.map((item) => (
                        <ul key={item.id}>
                            <li>
                                <strong>Nome:</strong> {item.nome}<br />
                                <strong>Idade:</strong> {item.Idade}<br />
                                <strong>Clã:</strong> {item.cla}<br />
                                <strong>Vila:</strong> {item.vila}<br />
                                <strong>Nível:</strong> {item.nivel}<br />
                                <strong>Habilidade:</strong> {item.habilidade}<br />
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
    backgroundImage: `url(${modos})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    padding: '20px',
  },
};
export default Personagem
