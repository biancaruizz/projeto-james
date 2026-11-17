import './app.css'
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from './firebaseConnections';
import { signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';

function Home() {
  const navigate = useNavigate();
  const [role, setRole] = useState('');

  useEffect(() => {
    async function checkRole() {
      if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setRole(userDocSnap.data().role);
        }
      }
    }
    checkRole();
  }, []);

  async function handleLogout() {
  try {
    await signOut(auth);
    navigate("/");
    alert("Até logo!");
  } catch (error) {
    console.log("Erro ao sair =>", error);
  }
}

  return (
    <div className="home-container">
      <div className="quadrado-verde">
        <p style={{ color: '#fff' }}>Perfil logado: <strong>{role.toUpperCase()}</strong></p>
         <button onClick={handleLogout} style={{ backgroundColor: '#1c9c0b6b', color: '#fff' }}>
          Sair / Logout
        </button>
        <h1>Bem vindo a Konohagakure!</h1>
        
        <h1>O que veremos Hoje  :</h1>
        <div>

          <Link to="/bijus">Bijus</Link>
          <Link to="/clans">Clans</Link>
          
          <br />

          <Link to="/dojutsu">Dojutsus</Link>
          <Link to="/invocacoes">Invocaçoes</Link>
          
          <br />

          <Link to="/kages">Kages</Link>
          <Link to="/modos">Modos</Link>

          <br />

          <Link to="/organizacoes">Organizaçoes</Link>
          <Link to="/vila">Vilas</Link>

          <br />

          <Link to="/personagem">Personagens</Link>
        </div>

    
        
      </div>
    </div>
  )
}

export default Home;