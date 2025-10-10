import React, {useState} from "react"; 
import Login from "./pages/Login"; 
import Register from "./pages/Register"; 
import Customer from "./pages/Customer"; 
import Admin from "./pages/Admin";
export default function App()
{
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [role, setRole] = useState(localStorage.getItem("role") || "");
    if (!token)
        return <div style={{ padding: 20 }}>
            <h2>Delivery Management</h2>
            <Login onLogin={(t, r) => {
                setToken(t);
                setRole(r);
                localStorage.setItem("token", t);
                localStorage.setItem("role", r);
            }} />
            <hr />
            <Register />
        </div>;
    return role === "admin" ? <Admin token={token} /> : <Customer token={token} />   // role is either "admin" or "customer"
}