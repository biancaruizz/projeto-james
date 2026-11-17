/*essa é para funcionar o login coretamente */
import { useState, useEffect } from 'react';
import { auth, db } from './firebaseConnections';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Navigate } from 'react-router-dom';

export default function Private({ children, adminOnly = false }) {
  const [loading, setLoading] = useState(true);
  const [signed, setSigned] = useState(false);
  const [Admin, setAdmin] = useState(false);

  useEffect(() => {
    // confere se esta logado
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setSigned(true);

        // confere se é cliente ou adimim
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
            setAdmin(true);
          } else {
            setAdmin(false);
          }
        } catch (error) {
          console.log("Erro ao buscar perfil:", error);
        }

        setLoading(false);
      } else {
        setSigned(false);
        setAdmin(false);
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#fff' }}>
        <h2>Carregando...</h2> // para a tela n piscaer engunato estiver sendo feita verificação
      </div>
    );
  }

  // Se n estiver logado, redireciona para a página de Login ( / )
  if (!signed) {
    return <Navigate to="/" />;
  }

  // Se a rota for só para Admin e o usuário for Cliente
  if (adminOnly && !Admin) {
    alert("Acesso negado! Apenas administradores podem acessar esta página.");
    return <Navigate to="/home" />;
  }

  return children;
}