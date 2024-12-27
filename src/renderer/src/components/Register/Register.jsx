import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from 'antd'
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons'
import { Eye, EyeClosed } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import s from '../Login/login.module.scss'
import { useAtom } from 'jotai'
import { isAuthenticatedAtom, userAtom } from '../../atoms'

const Register = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onChange'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [, setIsAuthenticated] = useAtom(isAuthenticatedAtom)
  const [, setUser] = useAtom(userAtom)

  useEffect(() => {
    document.title = 'Регистрация'
  }, [])

  const onSubmit = async (data) => {
    setLoadingBtn(true)
    const { name, email, password, confirmPassword } = data

    if (password !== confirmPassword) {
      setPasswordError('Пароли не совпадают!')
      setLoadingBtn(false)
      return
    }

    try {
      const res = await fetch('https://45fdf97f11972b83.mokky.dev/register', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: name,
          email: email,
          password: password
        })
      })

      if (res.ok) {
        const result = await res.json()
        // Сохранение токена в LocalStorage
        localStorage.setItem('token', result.token)
        setIsAuthenticated(true)
        localStorage.setItem('isAuthenticated', 'true')

        // Сохранение информации о пользователе в атом, включая id
        setUser({
          id: result.data.id, // Добавлено поле id
          fullName: result.data.fullName,
          email: result.data.email
        })

        // Перенаправление на главную страницу после успешной регистрации
        navigate('/')
      } else {
        const errorData = await res.json()
        setPasswordError(errorData.message || 'Ошибка регистрации!')
      }
    } catch (error) {
      console.error('Ошибка сети:', error)
      setPasswordError('Ошибка сети. Пожалуйста, попробуйте позже.')
    } finally {
      setLoadingBtn(false)
    }
  }

  const password = watch('password')

  return (
    <div className={s.wrapper}>
      <div className={s.main}>
        <div className="w-[400px] min-w-[340px] mx-auto p-8 border rounded-lg shadow-lg bg-white">
          <h2 className="text-3xl font-bold text-center mb-8 text-black">Регистрация</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="w-full max-w-sm min-w-[200px]">
              <div className="relative">
                <UserOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  {...register('name', { required: 'Пожалуйста, введите имя!' })}
                  className={`w-full pl-9 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow ${
                    errors.name ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  placeholder="ФИО"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
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
                      message: 'Пожалуйста, введите корректный адрес электронной почты!'
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
            <div className="w-full max-w-sm min-w-[200px]">
              <div className="relative">
                <LockOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Пожалуйста, повторите пароль!'
                  })}
                  className={`w-full pl-9 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow ${
                    errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  placeholder="Повторите пароль"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                >
                  {showPassword ? <EyeClosed size={16} /> : <Eye size={16} />}
                </span>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
              {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
            </div>
            <div>
              <Button
                loading={loadingBtn}
                type="primary"
                htmlType="submit"
                className="w-full"
                disabled={!isValid}
              >
                Зарегистрироваться
              </Button>
            </div>
          </form>
          <p className="text-center text-sm text-gray-700 mt-4">
            Уже есть аккаунт?{' '}
            <Link to="/" className="text-blue-500 hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
