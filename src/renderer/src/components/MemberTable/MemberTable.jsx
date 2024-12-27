import React from 'react'
import { ConfigProvider, Table, Tag, Button, Empty } from 'antd'
import { ArrowDownUp } from 'lucide-react'
import s from '../Home/home.module.scss'
import { Link } from 'react-router'

const index = () => {
  const [tableData, setTableData] = React.useState(data)

  const handleDelete = (key) => {
    setTableData((prevData) => prevData.filter((item) => item.key !== key))
  }

  const { Column } = Table
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: '#0068a8',
            headerColor: '#fff',
            headerBorderRadius: 0,
            rowHoverBg: '#e6f0f6',
            // bodySortBg: '#eee',
            headerSortActiveBg: '#0068a8',
            headerSortHoverBg: '#0076c0'
          }
        }
      }}
    >
      {tableData.length === 0 ? (
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
        <Table dataSource={tableData} pagination={false} className={s.table}>
          <Column
            title="Статус"
            dataIndex="status"
            key="status"
            sorter={(a, b) => a.status[0].localeCompare(b.status[0])}
            sortIcon={({ sortOrder }) => (
              <ArrowDownUp
                size={16}
                style={{ color: sortOrder ? '#b0d0e4' : 'rgba(0, 0, 0, 0.29)' }}
              />
            )}
            showSorterTooltip={false}
            render={(tag) => {
              const [status, color] = tag
              return (
                <Tag color={color} key={status}>
                  {status.toUpperCase()}
                </Tag>
              )
            }}
          />
          <Column
            title="Монитор"
            dataIndex="name"
            key="name"
            sorter={(a, b) => a.name.localeCompare(b.name)}
            sortIcon={({ sortOrder }) => (
              <ArrowDownUp
                size={16}
                style={{ color: sortOrder ? '#b0d0e4' : 'rgba(0, 0, 0, 0.29)' }}
              />
            )}
            showSorterTooltip={false}
          />
          <Column
            title="Причина"
            dataIndex="reason"
            key="reason"
            sorter={(a, b) => a.reason.localeCompare(b.reason)}
            sortIcon={({ sortOrder }) => (
              <ArrowDownUp
                size={16}
                style={{ color: sortOrder ? '#b0d0e4' : 'rgba(0, 0, 0, 0.29)' }}
              />
            )}
            showSorterTooltip={false}
          />
          <Column
            title="Начало"
            dataIndex="first"
            key="first"
            sorter={(a, b) => {
              const dateA = new Date(a.first.split('.').reverse().join('-'))
              const dateB = new Date(b.first.split('.').reverse().join('-'))
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
            title="Длительность"
            dataIndex="duration"
            key="duration"
            sorter={(a, b) => {
              const [hoursA, minutesA] = a.duration.split(':').map(Number)
              const [hoursB, minutesB] = b.duration.split(':').map(Number)
              return hoursA * 60 + minutesA - (hoursB * 60 + minutesB)
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
            key="actions"
            render={(_, record) => (
              <Button onClick={() => handleDelete(record.key)} danger type="text">
                Удалить
              </Button>
            )}
          />
        </Table>
      )}
    </ConfigProvider>
  )
}

export default index
