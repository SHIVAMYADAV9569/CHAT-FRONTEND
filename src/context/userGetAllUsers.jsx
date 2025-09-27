import React, { useState , useEffect} from 'react';
import Cookies from "js-cookie";
import axios from 'axios';


function userGetAllUsers() {

    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState([]);
    useEffect(() => {
        const getUsers = async () => {
            setLoading(true)
            try {
                const token = Cookies.get("jwt");
                const respose = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/getUserProfile`, {
                    Credentials: "include",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
                );
                setAllUsers(respose.data)
                setLoading(false);
            } catch (error) {
                console.log("Error in userGetAllUsers" , error);
            }
        };
        getUsers()
    }, []);
    return [allUsers,loading ];
}

export default userGetAllUsers;