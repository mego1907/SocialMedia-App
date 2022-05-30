import types from "../types";
import { auth, db } from "../../config/firebase";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";

export const loginWithGoogleAction = (router) => async (dispatch) => {
  try {
    dispatch({
      type: types.LOGIN_LOADING,
      payload: true,
    });

    const provider = new GoogleAuthProvider();

    const res = await signInWithPopup(auth, provider)
    const collectionRef = await collection(db, "users");

    if(res?.user) {
      localStorage.setItem("Authorization", `Bearer ${res?.user?.accessToken}`);
      
      // addDoc(
      //   collectionRef,
      //   {
      //     ...res?.user?.providerData[0],
      //   },
      //   res?.user?.providerData[0]?.uid
      // );

      const newUserRef = doc(collection(db, "users"), res?.user?.providerData[0]?.uid);

      setDoc(
        newUserRef,
        {...res?.user?.providerData[0]}
      );
      
      router.push("/");
      
      dispatch({
        type: types.SIGN_IN,
        payload: true,
      })
      
      dispatch({
        type: types.GET_USER_INFO,
        payload: res?.user?.providerData[0],
      })

      dispatch({
        type: types.MESSAGE_LOGIN,
        payload: "Welcome back!",
      })

      localStorage.setItem("userInfo", JSON.stringify(res?.user?.providerData[0]));
    }

  } catch (error) {
    console.log(error);

    dispatch({
      type: types.SIGN_IN,
      payload: false,
    });


    dispatch({
      type: types.LOGIN_LOADING,
      payload: false,
    });

  } finally {
    dispatch({
      type: types.LOGIN_LOADING,
      payload: false,
    });
  }
};

export const getUserInfo = () => async (dispatch) => {
  try {

    onAuthStateChanged(auth, (currentUser) => {
      dispatch({
        type: types.GET_USER_INFO,
        payload: currentUser.providerData[0],
      })

      dispatch({
        type: types.SIGN_IN,
        payload: true,
      });

      // console.log(currentUser.providerData[0]);
    })
    
  } catch (error) {
    dispatch({
      type: types.GET_USER_INFO,
      payload: {},
    });

    console.log(error);
  }
};

export const logoutAction = () => async (dispatch) => {
  try {
    await signOut({ callbackUrl: "/" });

    localStorage.clear();

    dispatch({
      type: types.LOGIN,
      payload: {
        id: "",
        userName: "",
        email: "",
        image: "",
      },
    });
  } catch (error) {
    console.log(error);
  }
};
