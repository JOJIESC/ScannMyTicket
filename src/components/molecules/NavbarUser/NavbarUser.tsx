'use client';
import Link from 'next/link';
import React, {useState} from 'react';
import Avatar from '@/components/atoms/Avatar/Avatar';
import { usePathname } from 'next/navigation';
import axios from 'axios';

function NavbarUser() {
    const links = [
        {
            name: 'Home',
            href: '/User'
        },
        {
            name: 'Account',
            href: '/User/Account'
        },
        {
            name: 'Mis Tickets',
            href: '/User/MisTickets'
        },
        {
            name: 'Eventos',
            href: '/User/Events'
        },
        {
            name: 'Mis eventos',
            href: '/Organizer'
        }
    ]
    const pathname = usePathname()

    const [user, setuser] = useState({
        avatar: ""
    })

    const getProfile = async () => {
        const response = await axios.get('/api/auth/PROFILE')
        setuser(response.data)
    }


    //esta funcion toma los datos del usuario y setea el usuario
    React.useEffect(() => {
        getProfile()
    }, [])
    return (
        <nav className='flex items-center w-full justify-between px-4 py-2'>
            <div className='flex justify-around w-full'>
                {links.map((link) => {
                    return (
                        <Link 
                        href={link.href} 
                        key={link.name} 
                        className={`font-bold text-black w-auto px-4 py-1 rounded-lg hover:bg-customGray ${pathname === link.href ? ' bg-customGray' : 'bg-transparent'}`}>
                                {link.name}
                            
                        </Link>
                    )
                })}
            </div>
            <div className='flex justify-end items-center w-full'>
                <input className='h-9 w-2/4 rounded-md px-2 font-bold mx-5 bg-customGray' type="text" placeholder='Busca un evento'/>
                <Avatar avatarOption={user.avatar} width={50}/>
            </div>
        </nav>
    )

}

export default NavbarUser
