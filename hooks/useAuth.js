import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  auth,
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
} from "../firebase";

const AuthContext = createContext({});

WebBrowser.maybeCompleteAuthSession();

export const AuthProvider = ({ children }) => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "1065509707622-950ibdm1neu17oa62qbmuhe3hu3jedvf.apps.googleusercontent.com",
  });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (response?.type === "success") {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        async function asyncSignIn() {
          await signInWithCredential(auth, credential);
          if (auth?.currentUser) {
            setUser({
              email: auth.currentUser.email,
              uid: auth.currentUser.uid,
              displayName: auth.currentUser.displayName,
              photoURL: auth.currentUser.photoURL,
            });
          } else {
            setUser(null);
          }
        }
        asyncSignIn();
      }
    } catch (error) {
      setError(error);
    }
  }, [response]);

  const signOutWithGoogle = async () => {
    setLoading(true);
    try {
      signOut(auth).then(() => {
        setUser(null);
      });
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    await promptAsync();
    setLoading(false);
  };

  const memoedValue = useMemo(
    () => ({
      user: user,
      signInWithGoogle: signInWithGoogle,
      request: request,
      loading: loading,
      logout: signOutWithGoogle,
      error: error,
    }),
    [user, request, error, loading]
  );
  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
