import { useEffect, useState } from 'react'
import './app.css'
import { db, auth } from './firebaseConnections'
import { doc, addDoc, collection, onSnapshot, setDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import invocacoes from './invocacoes.png';

function Invocacoes() {
    const [invocacao, setInvocacao] = useState('')
    const [local, setLocal] = useState('')
    const [habilidade, setHabilidade] = useState('')
    const [tipocombate, setTipocombate] = useState('')
    const [usuarios, setUsuarios] = useState('')
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
        const unsubscribe = onSnapshot(collection(db, "invocacoes"), (snapshot) => {
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
        setInvocacao('')
        setLocal('')
        setHabilidade('')
        setTipocombate('')
        setUsuarios('')
    }

    async function handleAdd() {
        await addDoc(collection(db, "invocacoes"), {
            invocacao,
            local,
            habilidade,
            tipocombate,
            usuarios
        })
        .then(() => {
            limparCampos()
            console.log("Cadastrado com sucesso!")
        })
        .catch((error) => console.error("Erro ao cadastrar:", error))
    }

    function selecionarItem(item) {
        setIdItem(item.id)
        setInvocacao(item.invocacao || '')
        setLocal(item.local || '')
        setHabilidade(item.habilidade || '')
        setTipocombate(item.tipocombate || '')
        setUsuarios(item.usuarios || '')
    }

    async function alterarItem() {
        if (!idItem) return alert("Selecione um invocação primeiro!")
        const itemRef = doc(db, "invocacoes", idItem)
        await setDoc(itemRef, {
            invocacao,
            local,
            habilidade,
            tipocombate,
            usuarios
        })
        .then(() => {
            limparCampos()
            console.log("Atualizado com sucesso!")
        })
        .catch((error) => console.log("Erro ao atualizar:", error))
    }

    async function excluirItem(id) {
        await deleteDoc(doc(db, "invocacoes", id))
        .then(() => console.log("Excluído com sucesso!"))
        .catch((error) => console.log("Erro ao excluir:", error))
    }

    return (
        <div className="fundo" style={style.fundo}>
            <div className='container'>
                {admin && (
                <div className="quadrado-marrom quadrado-marrom-cad">
                    <h1>Cadastro de Invocações</h1>

                    
                    <label>Invocação</label>
                    <br />
                    <input type="text" value={invocacao} onChange={(e) => setInvocacao(e.target.value)} />
                    <br />
                    
                    <label>Local</label>
                    <br />
                    <input type="text" value={local} onChange={(e) => setLocal(e.target.value)} />
                    <br />
                    
                    <label>Habilidade</label>
                    <br />
                    <input type="text" value={habilidade} onChange={(e) => setHabilidade(e.target.value)} />
                    <br />
                    
                    <label>Tipo de combate</label>
                    <br />
                    <input type="text" value={tipocombate} onChange={(e) => setTipocombate(e.target.value)} />
                    <br />
                    
                    <label>Usuários</label>
                    <br />
                    <input type="text" value={usuarios} onChange={(e) => setUsuarios(e.target.value)} />
                    <br />
                    <div className="container">
                    <button onClick={handleAdd}>Cadastrar</button>
                    <button onClick={alterarItem}>Alterar</button>
                    </div>
                </div>
                )}
                <div className="quadrado-marrom">
                    <h1>Lista de Invocacoes</h1>
                    {lista.length === 0 && <h1>Nenhum registro encontrado!</h1>}

                    {lista.map((item) => (
                        <ul key={item.id}>
                            <li>
                                <strong>Invocação:</strong> {item.invocacao}<br />
                                <strong>Local:</strong> {item.local}<br />
                                <strong>Habilidade:</strong> {item.habilidade}<br />
                                <strong>Tipo de combate:</strong> {item.tipocombate}<br />
                                <strong>Usuários:</strong> {item.usuarios}<br />
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
    backgroundImage: `url(${invocacoes})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    padding: '20px',
  },
};
export default Invocacoes
