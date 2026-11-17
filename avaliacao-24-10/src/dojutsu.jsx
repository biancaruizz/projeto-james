import { useEffect, useState } from 'react'
import './app.css'
import { db, auth } from './firebaseConnections'
import { doc, addDoc, collection, getDocs, onSnapshot, setDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import dojutsu from './dojutsu.png'

function Dojutsu() {
    const [dojutsu, setDojutsu] = useState('')
    const [evolucao, setEvolucao] = useState('')
    const [habilidaede, setHabilidaede] = useState('')
    const [origem, setOrigem] = useState('')
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
        const unsubscribe = onSnapshot(collection(db, "dojutsu"), (snapshot) => {
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
        setDojutsu('')
        setEvolucao('')
        setHabilidaede('')
        setOrigem('')
        setUsuarios('')
    }

    async function handleAdd() {
        await addDoc(collection(db, "dojutsu"), {
            dojutsu,
            evolucao,
            habilidaede,
            origem,
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
        setDojutsu(item.dojutsu || '')
        setEvolucao(item.evolucao || '')
        setHabilidaede(item.habilidaede || '')
        setOrigem(item.origem || '')
        setUsuarios(item.usuarios || '')
    }

    async function alterarItem() {
        if (!idItem) return alert("Selecione um dōjutsu primeiro!")
        const itemRef = doc(db, "dojutsu", idItem)
        await setDoc(itemRef, {
            dojutsu,
            evolucao,
            habilidaede,
            origem,
            usuarios
        })
        .then(() => {
            limparCampos()
            console.log("Atualizado com sucesso!")
        })
        .catch((error) => console.log("Erro ao atualizar:", error))
    }

    async function excluirItem(id) {
        await deleteDoc(doc(db, "dojutsu", id))
        .then(() => console.log("Excluído com sucesso!"))
        .catch((error) => console.log("Erro ao excluir:", error))
    }

    return (
        <div className="fundo" style={style.fundo}>
            <div className='container'>
                {admin && (
                    <div className="quadrado-marrom quadrado-marrom-cad">

                        <h1>Cadastro de Dōjutsu</h1>

                        
                        <label>Dōjutsu</label>
                        <br />
                        <input type="text" value={dojutsu} onChange={(e) => setDojutsu(e.target.value)} />
                        <br />
                        
                        <label>Evolução</label>
                        <br />
                        <input type="text" value={evolucao} onChange={(e) => setEvolucao(e.target.value)} />
                        <br />
                        
                        <label>Habilidade</label>
                        <br />
                        <input type="text" value={habilidaede} onChange={(e) => setHabilidaede(e.target.value)} />
                        <br />
                        
                        <label>Origem</label>
                        <br />
                        <input type="text" value={origem} onChange={(e) => setOrigem(e.target.value)} />
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
                    <h1>Lista de Dojutsus</h1>
                    {lista.length === 0 && <h1>Nenhum registro encontrado!</h1>}

                    {lista.map((item) => (
                        <ul key={item.id}>
                            <li>
                                <strong>Dōjutsu:</strong> {item.dojutsu}<br />
                                <strong>Evolução:</strong> {item.evolucao}<br />
                                <strong>Habilidade:</strong> {item.habilidaede}<br />
                                <strong>Origem:</strong> {item.origem}<br />
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
    backgroundImage: `url(${dojutsu})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    padding: '20px',
  },
};
export default Dojutsu
