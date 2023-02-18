import {useEffect, useState, useRef} from 'react';
import reset from './assets/reset.css';
import reactLogo from './assets/react.svg';
import {nanoid} from 'nanoid';
import axios from 'axios';
import {useMutation, useQueryClient, useQuery} from '@tanstack/react-query';

type Task = {
    id: string;
    task: string;
    status: number;
};

function App() {
    const [value, setValue] = useState('');

    const onInput = (e: any) => setValue(e.target.value);

    // Access the client
    const queryClient = useQueryClient();

    const getTasks = async () => {
        const res = await axios.get(`http://localhost:3004/tasks`);
        return res.data;
    };

    // Queries
    const {isLoading, error, data} = useQuery(['taskList'], getTasks);

    // Modify the task
    const addTask = useMutation({
        mutationFn: (newTask) => {
            return axios.post(`http://localhost:3004/post`, newTask);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['taskList']});
        },
    });

    // Modify the task
    const modTask = useMutation({
        mutationFn: (modTaskData) => {
            return axios.patch(`http://localhost:3004/tasks`, modTaskData);
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({queryKey: ['taskList']});
        },
    });

    // Delete the comment
    const deleteTask = useMutation({
        mutationFn: (taskId) => {
            return axios.delete(`http://localhost:3004/delete/${taskId}`);
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({queryKey: ['taskList']});
        },
    });

    const handleDone = (taskId: any) => {
        axios
            .post('http://localhost:3004/update', {
                id: taskId,
                status: 1,
            })
            .then((response) => {
                queryClient.invalidateQueries({queryKey: ['taskList']});
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleDelete = (taskId: any) => {
        // const deleteTask = task.filter((_, i) => i !== _id);
        console.log(taskId);
        deleteTask.mutate(taskId);
    };

    const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newTask: any = {
            task: value,
            status: 0,
        };
        addTask.mutate(newTask);
        setValue('');
    };

    if (isLoading) return <h1>Loading...</h1>;

    if (error) return <h1>An error has occurred.</h1>;

    const Tasklist = ({data}: any) => {
        return (
            <>
                {data.map((task: any, index: any) => (
                    <div className='taskList' key={index}>
                        {/* <div>{task.id}</div> */}

                        {task.status === 1 ? (
                            <>
                                <div
                                    style={{
                                        textDecoration: 'line-through',
                                        color: 'green',
                                    }}
                                >
                                    {task.task}
                                </div>
                                <div>
                                    <button
                                        onClick={() => handleDelete(task._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>{task.task}</div>
                                {/* <div>{task.status}</div> */}
                                <div className='gridStyleDone'>
                                    <button
                                        onClick={() => handleDone(task._id)}
                                    >
                                        Done
                                    </button>
                                </div>
                                <div>
                                    <button
                                        onClick={() => handleDelete(task._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
                {/* <p>{JSON.stringify(task)}</p> */}
            </>
        );
    };

    return (
        <div className='App'>
            <h1>Todo list</h1>
            <>
                <form onSubmit={handleAddTask}>
                    <input type='text' onChange={onInput} value={value} />
                    <button>Add Task</button>
                </form>
            </>
            <Tasklist data={data} />
        </div>
    );
}

export default App;
