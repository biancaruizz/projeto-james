import { useEffect, useState } from 'react'
import './app.css'
import { db, auth } from './firebaseConnections'
import { doc, addDoc, collection, onSnapshot, setDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import modos from './modos.png';

function Modos() {
    const [nome, setNome] = useState('')
    const [aprendizado, setAprendizado] = useState('')
    const [caracteristica, setCaracteristica] = useState('')
    const [habilidade, setHabilidade] = useState('')
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
        const unsubscribe = onSnapshot(collection(db, "modos"), (snapshot) => {
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
        setAprendizado('')
        setCaracteristica('')
        setHabilidade('')
        setUsuarios('')
    }

    async function handleAdd() {
        await addDoc(collection(db, "modos"), {
            nome,
            aprendizado,
            caracteristica,
            habilidade,
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
        setNome(item.nome || '')
        setAprendizado(item.aprendizado || '')
        setCaracteristica(item.caracteristica || '')
        setHabilidade(item.habilidade || '')
        setUsuarios(item.usuarios || '')
    }

    async function alterarItem() {
        if (!idItem) return alert("Selecione um modo primeiro!")
        const itemRef = doc(db, "modos", idItem)
        await setDoc(itemRef, {
            nome,
            aprendizado,
            caracteristica,
            habilidade,
            usuarios
        })
        .then(() => {
            limparCampos()
            console.log("Atualizado com sucesso!")
        })
        .catch((error) => console.log("Erro ao atualizar:", error))
    }

    async function excluirItem(id) {
        await deleteDoc(doc(db, "modos", id))
        .then(() => console.log("Excluído com sucesso!"))
        .catch((error) => console.log("Erro ao excluir:", error))
    }

    return (
        <div className="fundo" style={style.fundo}>
            <div className='container'>
                {admin && (
                    <div className="quadrado-marrom quadrado-marrom-cad">
                        <h1>Cadastro de Modos</h1>

                        <label>Nome</label>
                        <br />
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
                        <br />

                        <label>Aprendizado</label>
                        <br />
                        <input type="text" value={aprendizado} onChange={(e) => setAprendizado(e.target.value)} />
                        <br />

                        <label>Característica</label>
                        <br />
                        <input type="text" value={caracteristica} onChange={(e) => setCaracteristica(e.target.value)} />
                        <br />

                        <label>Habilidade</label>
                        <br />
                        <input type="text" value={habilidade} onChange={(e) => setHabilidade(e.target.value)} />
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
                    <h1>Lista de Modos e Transformacoes</h1>
                    {lista.length === 0 && <h1>Nenhum registro encontrado!</h1>}

                    {lista.map((item) => (
                        <ul key={item.id}>
                            <li>
                                <strong>Nome:</strong> {item.nome}<br />
                                <strong>Aprendizado:</strong> {item.aprendizado}<br />
                                <strong>Característica:</strong> {item.caracteristica}<br />
                                <strong>Habilidade:</strong> {item.habilidade}<br />
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
    backgroundImage: `url(${modos})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    padding: '20px',
  },
};
export default Modos
