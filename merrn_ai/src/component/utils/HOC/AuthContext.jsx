import { createContext, useState } from "react";


export const AuthContext = createContext();

const AuthProvider = ({children})=>{

    const login = localStorage.getItem('isLogin');
    let parsedUser = null;
    try {
        const userInfoData = localStorage.getItem("userInfo");
        if (userInfoData) parsedUser = JSON.parse(userInfoData);
    } catch {
        parsedUser = null;
    }
    const [isLogin, setLogin] = useState(login === 'true' || login === true);
    const [userInfo, setUserInfo] = useState(parsedUser);

    return (
        <AuthContext.Provider value={{ isLogin, setLogin, userInfo, setUserInfo }}>
            {children}
        </AuthContext.Provider>
    );

}

export default AuthProvider;