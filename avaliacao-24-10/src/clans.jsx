import { useEffect, useState } from 'react'
import './app.css'
import { db, auth } from './firebaseConnections'
import { doc, addDoc, collection, onSnapshot, setDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import clans from './clans.png'

function Clans() {
    const [cla, setCla] = useState('')
    const [vila, setVila] = useState('')
    const [caracteristica, setCaracteristica] = useState('')
    const [jutsus, setJutsus] = useState('')
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
        const unsubscribe = onSnapshot(collection(db, "clans"), (snapshot) => {
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
        setCla('')
        setVila('')
        setCaracteristica('')
        setJutsus('')
        setHistoria('')
    }

    async function handleAdd() {
        await addDoc(collection(db, "clans"), {
            cla,
            vila,
            caracteristica,
            jutsus,
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
        setCla(item.cla || '')
        setVila(item.vila || '')
        setCaracteristica(item.caracteristica || '')
        setJutsus(item.jutsus || '')
        setHistoria(item.historia || '')
    }

    async function alterarItem() {
        if (!idItem) return alert("Selecione um clã primeiro!")
        const itemRef = doc(db, "clans", idItem)
        await setDoc(itemRef, {
            cla,
            vila,
            caracteristica,
            jutsus,
            historia
        })
        .then(() => {
            limparCampos()
            console.log("Atualizado com sucesso!")
        })
        .catch((error) => console.log("Erro ao atualizar:", error))
    }

    async function excluirItem(id) {
        await deleteDoc(doc(db, "clans", id))
        .then(() => console.log("Excluído com sucesso!"))
        .catch((error) => console.log("Erro ao excluir:", error))
    }

    return (
        <div className="fundo" style={style.fundo}>
            <div className='container'>
                {admin && (
                    <div className="quadrado-marrom quadrado-marrom-cad">

                        <h1>Cadastro de Clãs</h1>

                    
                        <label>Clã</label>
                        <br />
                        <input type="text" value={cla} onChange={(e) => setCla(e.target.value)} />
                        <br />
                        
                        <label>Vila</label>
                        <br />
                        <input type="text" value={vila} onChange={(e) => setVila(e.target.value)} />
                        <br />
                        
                        <label>Característica</label>
                        <br />
                        <input type="text" value={caracteristica} onChange={(e) => setCaracteristica(e.target.value)} />
                        <br />
                        
                        <label>Jutsus</label>
                        <br />
                        <input type="text" value={jutsus} onChange={(e) => setJutsus(e.target.value)} />
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
                    <h1>Lista de Clans</h1>
                    {lista.length === 0 && <h1>Nenhum registro encontrado!</h1>}

                    {lista.map((item) => (
                        <ul key={item.id}>
                            <li>
                                <strong>Clã:</strong> {item.cla}<br />
                                <strong>Vila:</strong> {item.vila}<br />
                                <strong>Característica:</strong> {item.caracteristica}<br />
                                <strong>Jutsus:</strong> {item.jutsus}<br />
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
    backgroundImage: `url(${clans})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    padding: '20px',
  },

};
export default Clans
