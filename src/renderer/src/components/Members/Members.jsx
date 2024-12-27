import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router'
import { Table, Button, message, Spin, ConfigProvider } from 'antd'
import { ArrowDownUp, ArrowRight } from 'lucide-react'
import { useAtom } from 'jotai'
import axios from 'axios'

import { userAtom } from '../../atoms'
import s from '../Home/home.module.scss'

const { Column } = Table

const Members = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const eventId = searchParams.get('eventId')

  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [user] = useAtom(userAtom)

  // Функции для работы с ФИО как в Home
  const getFirstName = (fullName) => {
    if (!fullName) return ''
    return fullName.trim().split(/\s+/)[0]
  }

  const getSecondName = (fullName) => {
    if (!fullName) return ''
    const parts = fullName.trim().split(/\s+/)
    return parts.length >= 2 ? parts[1] : ''
  }

  useEffect(() => {
    if (eventId && user) {
      fetchMembers()
    } else {
      message.error('Идентификатор мероприятия отсутствует.')
    }
  }, [eventId, user])

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `https://45fdf97f11972b83.mokky.dev/members?eventId=${eventId}`
      )
      setMembers(response.data)

      // Проверяем, есть ли текущий пользователь в списке участников
      const userName = `${getSecondName(user.fullName)} ${getFirstName(user.fullName)}`
      const userExists = response.data.some((member) => member.fullName === userName)
      setIsRegistered(userExists)
    } catch (error) {
      message.error('Не удалось загрузить участников.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    setActionLoading(true)
    try {
      const userName = `${getSecondName(user.fullName)} ${getFirstName(user.fullName)}`

      // Находим максимальный существующий номер участника
      const maxNumber = members.reduce((max, member) => {
        return Math.max(max, member.athleteNumber || 0)
      }, 0)

      // Генерируем случайный инкремент от 10 до 100
      const randomIncrement = Math.floor(Math.random() * (100 - 10 + 1)) + 10

      const newMember = {
        fullName: userName,
        athleteNumber: maxNumber + randomIncrement, // Добавляем случайный инкремент
        eventId: eventId
      }

      const response = await axios.post('https://45fdf97f11972b83.mokky.dev/members', newMember)
      setMembers([...members, response.data])
      setIsRegistered(true)
      message.success('Вы успешно зарегистрировались!')
    } catch (error) {
      message.error('Не удалось зарегистрироваться.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancel = async () => {
    setActionLoading(true)
    try {
      const userName = `${getSecondName(user.fullName)} ${getFirstName(user.fullName)}`
      const memberToDelete = members.find((member) => member.fullName === userName)
      if (memberToDelete) {
        await axios.delete(`https://45fdf97f11972b83.mokky.dev/members/${memberToDelete.id}`)
        setMembers(members.filter((member) => member.id !== memberToDelete.id))
        setIsRegistered(false)
        message.success('Регистрация отменена.')
      }
    } catch (error) {
      message.error('Не удалось отменить регистрацию.')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className={s.container}>
      <div className={s.header}>
        <h1 className={s.userInfo}>Участники мероприятия</h1>
        <Link to="/home">
          <button className="flex items-center gap-2 text-white">
            Назад <ArrowRight />
          </button>
        </Link>
      </div>
      <div className={s.wrapper}>
        {loading ? (
          <Spin tip="Загрузка участников..." size="large" />
        ) : members.length === 0 ? (
          <div className={s.emptyContainer}>
            <p className="text-white text-center">На это мероприятие еще никто не записался</p>
          </div>
        ) : (
          <ConfigProvider
            theme={{
              components: {
                Table: {
                  headerBg: '#1677ff',
                  headerColor: '#fff',
                  headerBorderRadius: 0,
                  rowHoverBg: '#e6f0f6',
                  headerSortActiveBg: '#0958d9',
                  headerSortHoverBg: '#2688ff'
                }
              }
            }}
          >
            <Table dataSource={members} rowKey="id" pagination={false} className={s.table}>
              <Column
                title="ФИО"
                dataIndex="fullName"
                key="fullName"
                sorter={(a, b) => a.fullName.localeCompare(b.fullName)}
                sortIcon={({ sortOrder }) => (
                  <ArrowDownUp
                    size={16}
                    style={{ color: sortOrder ? '#b0d0e4' : 'rgba(0, 0, 0, 0.29)' }}
                  />
                )}
                showSorterTooltip={false}
              />
              <Column
                title="Номер спортсмена"
                dataIndex="athleteNumber"
                key="athleteNumber"
                sorter={(a, b) => a.athleteNumber - b.athleteNumber}
                sortIcon={({ sortOrder }) => (
                  <ArrowDownUp
                    size={16}
                    style={{ color: sortOrder ? '#b0d0e4' : 'rgba(0, 0, 0, 0.29)' }}
                  />
                )}
                showSorterTooltip={false}
              />
            </Table>
          </ConfigProvider>
        )}
      </div>
      {user && isRegistered ? (
        <Button
          className={`mt-4 ${s.registerButton}`}
          type="primary"
          danger
          onClick={handleCancel}
          loading={actionLoading}
        >
          Отменить
        </Button>
      ) : (
        <Button
          className={`mt-4 ${s.registerButton}`}
          type="primary"
          onClick={handleRegister}
          loading={actionLoading}
        >
          Записаться
        </Button>
      )}
    </div>
  )
}

export default Members
