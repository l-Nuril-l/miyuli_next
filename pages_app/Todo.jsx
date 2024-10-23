"use client";
import { add, doneToggle, remove } from "@/lib/features/todo";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import './Todo.scss';



function Todo() {
  const items = useAppSelector((s) => s.todo)
  const dispatch = useAppDispatch()
  const [value, setValue] = useState("");

  return (
    <div className="todos">
      <h1>MY TODO LIST</h1>
      <Form className='d-flex justify-content-center'>
        <Form.Group className='d-flex'>
          <Form.Control placeholder="task" value={value} onChange={e => setValue(e.target.value)}></Form.Control>
        </Form.Group>
        <Button variant='primary' onClick={() => dispatch(add(value))} >Add</Button>
        {/* disabled={!value} opacity error */}
      </Form>
      <ul>
        {items.map(item => <li key={item.id}>
          <div className={item.done ? "done" : ""}>{item.content}</div>
          <Button variant={!item.done ? "success" : "warning"} type="button" onClick={() => dispatch(doneToggle(item.id))} >{!item.done ? "Succes" : "Undo"}</Button>
          <Button variant='danger' type="button" onClick={() => dispatch(remove(item.id))}>Remove</Button>
        </li>)}
      </ul>
    </div>
  );
}

export default Todo;
