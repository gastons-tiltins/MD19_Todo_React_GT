import {useEffect, useState} from 'react';
import reset from './assets/reset.css';
import reactLogo from './assets/react.svg';
import {nanoid} from 'nanoid';

type Task = {
    id: string;
    task: string;
    status: number;
};

function App() {
    const [task, setTask] = useState<Task[]>([
        {
            id: nanoid(),
            task: 'Learn React.',
            status: 0,
        },
        {
            id: nanoid(),
            task: 'Learn MangoDB.',
            status: 0,
        },
        {
            id: nanoid(),
            task: 'Learn TypeScript Types.',
            status: 0,
        },
    ]);
    const [formValue, setValue] = useState('');

    // useEffect(() => {
    //     console.log(task);
    // }, [task]);

    const handleChange = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTask([
            ...task,
            {
                id: nanoid(),
                task: formValue,
                status: 0,
            },
        ]);
        setValue('');
    };

    const handleDelete = (index: any) => {
        // console.log(index);
        const deleteTask = task.filter((_, i) => i !== index);
        setTask(deleteTask);
    };

    const Tasklist = () => {
        return (
            <>
                {task.map((task, index) => (
                    <div className='taskList' key={index}>
                        {/* <div>{task.id}</div> */}
                        <div>{task.task}</div>
                        <div>{task.status}</div>
                        <div>
                            <button onClick={() => handleDelete(index)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </>
        );
    };
    return (
        <div className='App'>
            <h1>Todo list</h1>
            <>
                <form onSubmit={handleChange}>
                    <input
                        type='text'
                        value={formValue}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <button>Add Task</button>
                </form>
            </>
            <Tasklist />
        </div>
    );
}

export default App;
