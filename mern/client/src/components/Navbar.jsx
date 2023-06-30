import React from 'react'
import {Link, NavLink} from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";
import {checkIsAuth, logout} from '../redux/features/auth/authSlice'
import {toast} from "react-toastify";

export const Navbar = () => {

    const isAuth = useSelector(checkIsAuth)
    const dispatch = useDispatch()
    const activeStyles = {
        color: 'white',
    }

    const logoutHandler = () => {
        dispatch(logout())
        window.localStorage.removeItem('token')
        toast('Вы вышли из системы')
    }

    return (
        <div className='flex py-4 justify-between items-center'>
            <span className='flex justify-between items-center w-6 h-6 bg-gray-600 text-xs text-white rounded-sm'>
                SolusSocial
            </span>

            {isAuth && (
                    <ul className='flex gap-8'>
                        <li>
                            <NavLink
                                to={'/'}
                                href='/'
                                className='text-xs text-gray-400 hover:text-white'
                                style={({isActive}) => isActive ? activeStyles : undefined}
                            >Главная</NavLink>
                        </li>
                        <li>
                            <NavLink
                                to={'/posts'}
                                href='/'
                                className='text-xs text-gray-400 hover:text-white'
                                style={({isActive}) => isActive ? activeStyles : undefined}
                            >Мои публикации</NavLink>
                        </li>
                        <li>
                            <NavLink
                                to={'/new'}
                                href='/'
                                className='text-xs text-gray-400 hover:text-white'
                                style={({isActive}) => isActive ? activeStyles : undefined}
                            >Добавить публикацию</NavLink>
                        </li>
                    </ul>
                )}

            <div className='flex justify-center items-center bg-gray-600 text-xs text-white rounded-sm px-4 py-2'>
                {isAuth ? (
                    <button onClick={logoutHandler}>Выйти</button>
                ) : (
                    <Link to={'/login'}> Войти </Link>
                )}
            </div>
        </div>
    )
}
