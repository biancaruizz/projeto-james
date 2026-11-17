import { useEffect, useState } from 'react'
import './app.css'
import { db, auth } from './firebaseConnections'
import { doc, addDoc, collection, onSnapshot, setDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import bijusImg from './bijus.png';

function Bijus() {
    const [nome, setNome] = useState('')
    const [nomenclatura, setNomenclatura] = useState('')
    const [jinchuriki, setJinchuriki] = useState('')
    const [ataquestipo, setAtaquestipo] = useState('')
    const [habilidades, setHabilidades] = useState('')
    const [bijus, setBijus] = useState([])
    const [idBiju, setIdBiju] = useState('')

    // Tipos de usuario
    const [admin, setAdmin] = useState(false)
    const [setLoadingUser] = useState(true)

    // Verifica se o usuário atual é Admin
    useEffect(() => {
        // Aguarda a verificação de autenticação do Firebase
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
        const unsubscribe = onSnapshot(collection(db, "Bijus"), (snapshot) => {
            let lista = []
            snapshot.forEach((d) => {
                lista.push({ id: d.id, ...d.data() })
            })
            setBijus(lista)
        })
        return () => unsubscribe()
    }, [])

    function limparCampos() {
        setIdBiju('')
        setNome('')
        setNomenclatura('')
        setJinchuriki('')
        setAtaquestipo('')
        setHabilidades('')
    }

    async function handleAdd() {
        if (!nome) return alert("Preencha o nome do Biju!");
        await addDoc(collection(db, "Bijus"), {
            nome,
            nomenclatura,
            jinchuriki,
            ataquestipo,
            Habilidades: habilidades
        })
        .then(() => {
            limparCampos()
            console.log("Biju cadastrado com sucesso!")
        })
        .catch((error) => console.error("Erro ao cadastrar:", error))
    }


    function selecionarBiju(item) {
        setIdBiju(item.id)
        setNome(item.nome || '')
        setNomenclatura(item.nomenclatura || '')
        setJinchuriki(item.jinchuriki || '')
        setAtaquestipo(item.ataquestipo || '')
        setHabilidades(item.Habilidades || '')
    }

    async function alterarBiju() {
        if (!idBiju) return alert("Selecione um biju primeiro!")
        const bijuRef = doc(db, "Bijus", idBiju)
        await setDoc(bijuRef, {
            nome,
            nomenclatura,
            jinchuriki,
            ataquestipo,
            Habilidades: habilidades
        })
        .then(() => {
            limparCampos()
            console.log("Biju atualizado com sucesso!")
        })
        .catch((error) => console.log("Erro ao atualizar:", error))
    }

    async function excluirBiju(id) {
        await deleteDoc(doc(db, "Bijus", id))
        .then(() => console.log("Biju excluído com sucesso!"))
        .catch((error) => console.log("Erro ao excluir:", error))
    }

    return (
        <div className="fundo" style={style.fundo}>
            <div className='container'>
                {/* Apenas admin vê o formulário */}
                {admin && (
                    <div className="quadrado-marrom quadrado-marrom-cad">
                        <h1>Cadastro de Bijus</h1>

                        <label>Nome</label>
                        <br />
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
                        <br />

                        <label>Nomenclatura</label>
                        <br />
                        <input type="text" value={nomenclatura} onChange={(e) => setNomenclatura(e.target.value)} />
                        <br />

                        <label>Jinchuriki</label>
                        <br />
                        <input type="text" value={jinchuriki} onChange={(e) => setJinchuriki(e.target.value)} />
                        <br />

                        <label>Tipo de ataque</label>
                        <br />
                        <input type="text" value={ataquestipo} onChange={(e) => setAtaquestipo(e.target.value)} />
                        <br />

                        <label>Habilidades</label>
                        <br />
                        <input type="text" value={habilidades} onChange={(e) => setHabilidades(e.target.value)} />
                        <br />
                        <div className="container">
                            <button onClick={handleAdd}>Cadastrar</button>
                            <button onClick={alterarBiju}>Alterar</button>
                        </div>
                    </div>
                )}

                <div className="quadrado-marrom">
                    <h1>Lista de Bijus</h1>
                    {bijus.length === 0 && <h1>Nenhum biju encontrado!</h1>}

                    {bijus.map((item) => (
                        <ul key={item.id}>
                            <li>

                                <strong>Nome:</strong> {item.nome}<br />
                                <strong>Nomenclatura:</strong> {item.nomenclatura}<br />
                                <strong>Jinchuriki:</strong> {item.jinchuriki}<br />
                                <strong>Tipo de ataque:</strong> {item.ataquestipo}<br />
                                <strong>Habilidades:</strong> {item.Habilidades}<br />
                                
                                {/* Apenas admin vê os botões de ação na lista */}
                                {admin && (
                                    <div className="container">
                                        <button onClick={() => excluirBiju(item.id)}>Excluir</button> &nbsp; &nbsp;
                                        <button onClick={() => selecionarBiju(item)}>Selecionar</button>
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
        backgroundImage: `url(${bijusImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        padding: '20px',
    },
};

export default Bijus