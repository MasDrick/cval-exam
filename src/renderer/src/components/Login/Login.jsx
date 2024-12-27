import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from 'antd'
import { useAtom } from 'jotai'
import { useNavigate, Link } from 'react-router'
import { isAuthenticatedAtom, userAtom } from '../../atoms'
import { MailOutlined, LockOutlined } from '@ant-design/icons'
import { Eye, EyeClosed } from 'lucide-react'

import s from './login.module.scss'

const Login = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onChange'
  })
  const [, setIsAuthenticated] = useAtom(isAuthenticatedAtom)
  const [, setUser] = useAtom(userAtom)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    document.title = 'Авторизация'
  }, [])

  const onSubmit = async (data) => {
    setLoadingBtn(true)
    setAuthError('')

    try {
      const response = await fetch('https://45fdf97f11972b83.mokky.dev/auth', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        })
      })

      if (response.ok) {
        const result = await response.json()
        // Сохранение токена в LocalStorage
        localStorage.setItem('token', result.token)
        setIsAuthenticated(true)
        localStorage.setItem('isAuthenticated', 'true')

        // Сохранение информации о пользователе в атом, включая id
        setUser({
          id: result.data.id, // Добавлено поле id
          fullName: result.data.fullName, // Предполагается, что сервер возвращает fullName
          email: result.data.email
        })

        // Перенаправление на главную страницу после успешной авторизации
        navigate('/home')
      } else {
        const errorData = await response.json()
        setAuthError(errorData.message || 'Ошибка авторизации!')
      }
    } catch (error) {
      console.error('Ошибка сети:', error)
      setAuthError('Ошибка сети. Пожалуйста, попробуйте позже.')
    } finally {
      setLoadingBtn(false)
    }
  }

  return (
    <div className={s.wrapper}>
      <div className={s.main}>
        <div className="w-[400px] min-w-[340px] mx-auto p-8 border rounded-lg shadow-lg bg-white">
          <h2 className="text-3xl font-bold text-center mb-8 text-black">Вход</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="w-full max-w-sm min-w-[200px]">
              <div className="relative">
                <MailOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Пожалуйста, введите почту!',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Неверный формат почты!'
                    }
                  })}
                  className={`w-full pl-9 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow ${
                    errors.email ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  placeholder="Почта"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div className="w-full max-w-sm min-w-[200px]">
              <div className="relative">
                <LockOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Пожалуйста, введите пароль!' })}
                  className={`w-full pl-9 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow ${
                    errors.password ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  placeholder="Пароль"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                >
                  {showPassword ? <EyeClosed size={16} /> : <Eye size={16} />}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>
            {authError && <p className="text-red-500 text-xs mt-1">{authError}</p>}
            <div>
              <Button
                loading={loadingBtn}
                type="primary"
                htmlType="submit"
                className="w-full"
                disabled={!isValid}
              >
                Войти
              </Button>
              <p className="text-center text-sm text-gray-700 mt-4">
                Еще нет аккаунта?{' '}
                <Link to="/register" className="text-blue-500 hover:underline">
                  Зарегистрироваться
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
