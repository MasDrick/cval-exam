import React, { useEffect, useState } from 'react'
import { useAtom } from 'jotai'

import { ConfigProvider, Table, Button, Empty, message } from 'antd'
import { Link } from 'react-router'
import { ArrowDownUp } from 'lucide-react'

import axios from 'axios'

import s from './home.module.scss'

import { userAtom } from '../../atoms'

const { Column } = Table

const Home = () => {
  const [data, setData] = useState([])
  const [user] = useAtom(userAtom)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = 'Спортивные мероприятия'
    async function fetchData() {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('https://45fdf97f11972b83.mokky.dev/typeSport', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setData(response.data)
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error.message)
        message.error('Не удалось загрузить данные.')
      }
    }

    fetchData()
  }, [])

  console.log(data)
  console.log('Текущий пользователь:', user)

  // Функция для получения имени из полного ФИО
  const getFirstName = (fullName) => {
    if (!fullName) return ''
    return fullName.trim().split(/\s+/)[0]
  }

  // Функция для получения второго слова из полного ФИО
  const getSecondName = (fullName) => {
    if (!fullName) return ''
    const parts = fullName.trim().split(/\s+/)
    return parts.length >= 2 ? parts[1] : ''
  }

  const handleCancel = async (key) => {
    if (!user) {
      console.error('Пользователь не авторизован.')
      message.error('Вы не авторизованы.')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const userName = `${getSecondName(user.fullName)} ${getFirstName(user.fullName)}`

      // Отправка запроса на отмену записи на сервере
      await axios.delete(`https://45fdf97f11972b83.mokky.dev/typeSport/${key}/signup`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: { name: userName } // Используем имя для идентификации
      })

      // Обновление локального состояния после успешной отмены
      setData((prevData) =>
        prevData.map((item) => {
          if (item.key === key && item.children) {
            const updatedChildren = item.children.filter((child) => child.name !== userName)
            return {
              ...item,
              children: updatedChildren
            }
          }
          return item
        })
      )

      message.success('Вы успешно отменили запись на мероприятие.')
    } catch (error) {
      if (error.response) {
        console.error('Серверная ошибка:', error.response.data.message)
        message.error(`Ошибка: ${error.response.data.message}`)
      } else if (error.request) {
        console.error('Нет ответа от сервера:', error.request)
        message.error('Нет ответа от сервера.')
      } else {
        console.error('Ошибка при настройке запроса:', error.message)
        message.error(`Ошибка: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={s.container}>
      {user && (
        <div className={s.header}>
          <div className={s.userInfo}>
            <p>Добро пожаловать, {getSecondName(user.fullName)}!</p>
          </div>
        </div>
      )}
      <div className={s.wrapper}>
        <h1 className={s.title}>Спортивные мероприятия</h1>

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
          {data.length === 0 ? (
            <div className={s.emptyContainer}>
              <div className={`${s.empty} w-3/5 h-3/5`}>
                <Empty description="">
                  <p className="text-white text-center font-medium uppercase mb-4">Нет данных</p>
                  <Link to="/">
                    <Button size="medium" type="primary">
                      На главную
                    </Button>
                  </Link>
                </Empty>
              </div>
            </div>
          ) : (
            <Table dataSource={data} pagination={false} className={s.table} loading={loading}>
              <Column
                title="Название"
                dataIndex="name"
                key="name"
                sorter={(a, b) => a.name.localeCompare(b.name)}
                render={(text) => <span>{text}</span>}
                sortIcon={({ sortOrder }) => (
                  <ArrowDownUp
                    size={16}
                    style={{ color: sortOrder ? '#b0d0e4' : 'rgba(0, 0, 0, 0.29)' }}
                  />
                )}
                showSorterTooltip={false}
              />
              <Column
                title="Адрес"
                dataIndex="address"
                key="address"
                sorter={(a, b) => a.address.localeCompare(b.address)}
                sortIcon={({ sortOrder }) => (
                  <ArrowDownUp
                    size={16}
                    style={{ color: sortOrder ? '#b0d0e4' : 'rgba(0, 0, 0, 0.29)' }}
                  />
                )}
                showSorterTooltip={false}
              />
              <Column
                title="Длительность, мин."
                dataIndex="time"
                key="time"
                sorter={(a, b) => a.time - b.time}
                sortIcon={({ sortOrder }) => (
                  <ArrowDownUp
                    size={16}
                    style={{ color: sortOrder ? '#b0d0e4' : 'rgba(0, 0, 0, 0.29)' }}
                  />
                )}
                showSorterTooltip={false}
              />

              <Column
                title="Дата проведения"
                dataIndex="date"
                key="date"
                sorter={(a, b) => {
                  const dateA = new Date(a.date.split('.').reverse().join('-'))
                  const dateB = new Date(b.date.split('.').reverse().join('-'))
                  return dateA - dateB
                }}
                sortIcon={({ sortOrder }) => (
                  <ArrowDownUp
                    size={16}
                    style={{ color: sortOrder ? '#b0d0e4' : 'rgba(0, 0, 0, 0.29)' }}
                  />
                )}
                showSorterTooltip={false}
              />

              <Column
                title="Действия"
                dataIndex="action"
                key="action"
                render={(_, record) => {
                  const isSignedUp = record.children?.some(
                    (child) =>
                      child.name ===
                      `${getSecondName(user?.fullName)} ${getFirstName(user?.fullName)}`
                  )
                  return isSignedUp ? (
                    <Button onClick={() => handleCancel(record.key)} type="primary" danger>
                      Отменить
                    </Button>
                  ) : (
                    <Link to={`/members?eventId=${record.key}`}>
                      <Button type="primary">Смотреть</Button>
                    </Link>
                  )
                }}
              />
            </Table>
          )}
        </ConfigProvider>
      </div>
      <Link to="/">
        <Button className="mt-4" size="medium" type="primary">
          Выйти
        </Button>
      </Link>
    </div>
  )
}

export default Home
