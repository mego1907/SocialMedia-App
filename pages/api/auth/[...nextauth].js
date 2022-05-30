import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { db } from "../../../config/firebase";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  secret: process.env.SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ account, profile }) {
      const user = {
        email: profile.email,
        name: profile.name,
        image: profile.picture,
        id: account.providerAccountId,
        provider: account.provider,
        timestamp: serverTimestamp(),
      };
      
      const newUser = doc(db, "users", account.providerAccountId);
      await setDoc(newUser, user);

      return true;
    },
    async session({ session, token, user}) {
      session.user.username = session.user.email.split("@")[0];

      session.user.uid = token.sub;

      return session;
    },
  }
})