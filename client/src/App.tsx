import React, { FC, useContext, useEffect, useRef, useState } from "react";
import LoginForm from "./components/LoginForm"
import { Context } from ".";
import { observer } from "mobx-react-lite";
import { IUser } from "./models/IUser";
import UserService from "./services/UserService";



const App:  FC = () => {
  const {store} = useContext(Context)
  const [users, setUsers] = useState<IUser[]>([])
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      if(localStorage.getItem('token')) {
        console.log("here")
        store.checkAuth()
      }
    }
  },[]);

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers()
      setUsers(response.data)
    } catch (e: any) {
      console.log(e)
    }
  }
  if(store.isLoading) {
    return(
      <div><h1>Загрузка...</h1></div>
    )
  }

    if(!store.isAuth) {
      return (
      <div>
        <h1>АВТОРИЗУЙТЕСЬ</h1>
        <LoginForm/>
      </div>
      )
    }
    if(localStorage.getItem('token')){
      if(!store.user.isActivated){
        return (
          <div>
            <h1>
              Активируйте аккаунт
            </h1>
            <button onClick={() => store.logout()}>Выйти</button>
          </div>
          )
      }
    }
  return (
    <div>
      <h1>Пользователь авторизован {store.user.email}</h1> 
      <button onClick={() => store.logout()}>Выйти</button>
      <div>
      <button onClick={getUsers}>Получить пользователей</button>
      </div>
      {users.map(user => 
        <div key={user.email}>
          {user.email}
        </div>
        )}
    </div>
  );
}

export default observer(App);
