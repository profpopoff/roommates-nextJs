import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import styles from '../../styles/pages/CreateProperty.module.scss'

import * as cookie from 'cookie'
import jwt from 'jsonwebtoken'

import { wrapper } from '../../redux/store'
import { setUser } from '../../redux/slices/user'
import { getUser } from '../api/users/[id]'
import Layout from '../../components/Layout'
import CustomToggle from '../../components/CustomToggle/CustomToggle'
import CustomInput from '../../components/CustomInput/CustomInput'
import CustomTextArea from '../../components/CustomTextArea/CustomTextArea'
import { jsonParser } from '../../utils/functions'
import { useEffect } from 'react'

// todo: add error and succes handling
export default function CreateProperty() {
  return (
    <Layout title="Create Property">
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <Form />
        </div>
      </div>
    </Layout>
  )
}

// todo: add "type" selector
const Form = () => {

  const user = useSelector((state) => state.user.info)

  const [createForm, setCreateForm] = useState({})

  const changeHandler = (name, value) => {
    setCreateForm({ ...createForm, [name]: value })
  }

  const createHandler = async event => {
    event.preventDefault()
    try {
      const apartment = await fetch('/api/apartments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ ...createForm, landlordId: user._id }),
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form className={styles.addForm} onSubmit={createHandler}>
      <h2 className={styles.title}>Добавление записи</h2>
      <CustomInput label="Заголовок" name="title" type="text" handleChange={e => changeHandler(e.target.name, e.target.value)} />
      <Address changeHandler={changeHandler} />
      <Price changeHandler={changeHandler} />
      <Stats changeHandler={changeHandler} />
      <CustomTextArea label="Описание" name="desc" handleChange={e => changeHandler(e.target.name, e.target.value)} />
      <Conveniences changeHandler={changeHandler} />
      <input type="submit" className="submit-btn" value="Выполнить" />
    </form>
  )
}

const Address = ({ changeHandler }) => {

  const [address, setAddress] = useState({})

  const addressHandler = event => {
    setAddress({ ...address, [event.target.name]: event.target.value })
  }

  useEffect(() => {
    changeHandler('address', address)
  }, [address])

  return (
    <div className={styles.address}>
      <CustomInput label="Город" name="city" type="text" handleChange={addressHandler} />
      <CustomInput label="Улица" name="street" type="text" handleChange={addressHandler} />
      <div className={styles.numbers}>
        <CustomInput label="Дом" name="house" type="text" handleChange={addressHandler} />
        <CustomInput label="Квартира" name="apartment" type="number" handleChange={addressHandler} />
      </div>
    </div>
  )
}

// todo: добавь выбор валюты и частоты 
const Price = ({ changeHandler }) => {

  const [price, setPrice] = useState({})

  const priceHandler = event => {
    setPrice({ ...price, [event.target.name]: event.target.value })
  }

  useEffect(() => {
    changeHandler('price', price)
  }, [price])

  return (
    <div className={styles.price}>
      <CustomInput label="Цена" name="value" type="number" handleChange={priceHandler} />
      {/* <CustomInput label="Валюта" name="currency" type="text" handleChange={PriceHandler} />
      <CustomInput label="Частота" name="frequency" type="text" handleChange={PriceHandler} /> */}
    </div>
  )
}

const Stats = ({ changeHandler }) => {

  const [stats, setStats] = useState({})

  const statsHandler = event => {
    setStats({ ...stats, [event.target.name]: event.target.value })
  }

  useEffect(() => {
    changeHandler('stats', stats)
  }, [stats])

  return (
    <div className={styles.stats}>
      <CustomInput label="Этаж" name="floor" type="number" handleChange={statsHandler} />
      <CustomInput label="Площадь (&#13217;)" name="area" type="number" handleChange={statsHandler} />
      <CustomInput label="Кол-во комнат" name="rooms" type="number" handleChange={statsHandler} />
    </div>
  )
}

const Conveniences = ({ changeHandler }) => {

  const [conveniences, setConveniences] = useState([])

  const addConvenience = event => {
    if (event.target.checked) {
      setConveniences([...conveniences, event.target.value])
    } else {
      setConveniences(conveniences.filter(item => item !== event.target.value))
    }
  }

  useEffect(() => {
    changeHandler('conveniences', conveniences)
  }, [conveniences])

  return (
    <div className={styles.conveniences}>
      <CustomToggle name='кухня' label="Кухня" checked={false} onChange={addConvenience} />
      <CustomToggle name='wifi' label="Wifi" checked={false} onChange={addConvenience} />
      <CustomToggle name='кондиционер' label="Кондиционер" checked={false} onChange={addConvenience} />
      <CustomToggle name='балкон' label="Балкон" checked={false} onChange={addConvenience} />
      <CustomToggle name='стиральная  машина' label="Стиральная машина" checked={false} onChange={addConvenience} />
      <CustomToggle name='паркинг' label="Паркинг" checked={false} onChange={addConvenience} />
      <CustomToggle name='теплый пол' label="Теплый пол" checked={false} onChange={addConvenience} />
      <CustomToggle name='духовка' label="Духовка" checked={false} onChange={addConvenience} />
      <CustomToggle name='микроволновка' label="Микроволновка" checked={false} onChange={addConvenience} />
      <CustomToggle name='холодильник' label="Холодильник" checked={false} onChange={addConvenience} />
      <CustomToggle name='пылесос' label="Пылесос" checked={false} onChange={addConvenience} />
      <CustomToggle name='телевизор' label="Телевизор" checked={false} onChange={addConvenience} />
      <CustomToggle name='можно с животными' label="Можно с животными" checked={false} onChange={addConvenience} />
      <CustomToggle name='можно с детьми' label="Можно с детьми" checked={false} onChange={addConvenience} />
    </div>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req }) => {

  const cookies = req.headers.cookie

  if (cookies) {
    const { token } = cookie.parse(cookies)
    const decodedToken = jwt.decode(token)
    const user = await getUser(decodedToken.id)
    store.dispatch(setUser(jsonParser(user)))
  }
})