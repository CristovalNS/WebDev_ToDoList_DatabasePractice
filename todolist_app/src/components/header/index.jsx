import { FaPlusCircle } from "react-icons/fa";
import todoLogo from '../../assets/todoLogo.svg';
import styles from './header.module.css';
import { useState } from 'react';

export function Header({ handleAddTask }) {
  const [title, setTitle] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      alert("Don't leave the task as blank!");
      return;
    }

    handleAddTask(title.trim());
    setTitle(''); 
  }

  function onChangeTitle(event) {
    setTitle(event.target.value);
  }

  return (
    <header className={styles.header}>
      <img src={todoLogo} />

      <form onSubmit={handleSubmit} className={styles.addTask}>
        <input placeholder="Add a new task" type="text" onChange={onChangeTitle} value={title} />
        <button> Add task <FaPlusCircle size={20} /> </button>
      </form>
    </header>
  )
}