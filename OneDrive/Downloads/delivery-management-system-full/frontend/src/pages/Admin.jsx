import React, { useState, useEffect } from "react";
import axios from "axios";
export default function Admin({ token }) {
    const [orders, setOrders] = useState([]);
    useEffect(() => { fetchAll() }, []);
    async function fetchAll() {
        try {
            const res = await axios.get("http://localhost:8080/admin/orders",
                { headers: { Authorization: "Bearer " + token } }); setOrders(res.data)
            setOrders(res.data)
        } catch (e) { console.error(e) }
    } async function cancel(id) {
        await axios.post("http://localhost:8080/orders/" + id + "/cancel", {}, { headers: { Authorization: "Bearer " + token } });
        fetchAll()
    }
    return (
    <div style={{ padding: 20 }}>
        <h3>Admin</h3>
        <button onClick={fetchAll}>Refresh</button>
        <ul>{orders.map(o => <li key={o.id}>{o.id} - {o.item} - {o.status}
            <button onClick={() => cancel(o.id)}>
                Cancel
            </button></li>)}
        </ul>
    </div>      
)}