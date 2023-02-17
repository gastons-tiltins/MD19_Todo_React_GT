import {useEffect, useState} from 'react';
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
    const [tasks, setTasks] = useState([]);

    const [formValue, setValue] = useState('');

    const handleDone = (id: string) => {
        // task.map((t, index) => {
        //     if (t.id === id) {
        //         task[index].status = 1;
        //         setTask([...task]);
        //     }
        // });
    };

    // Work with MongoDB/API

    // Access the client
    const queryClient = useQueryClient();

    // Send data to API
    const sendDataToApi = useMutation({
        mutationFn: (taskData) => {
            return axios.post(`http://localhost:3004/post`, taskData);
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({queryKey: ['repoData']});
        },
    });

    const deleteApiTask = useMutation({
        mutationFn: (taskId) => {
            return axios.delete(`http://localhost:3004/delete/${taskId}`);
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({queryKey: ['repoData']});
        },
    });

    const handleDelete = (taskId: any) => {
        // const deleteTask = task.filter((_, i) => i !== _id);
        console.log(taskId);
        deleteApiTask.mutate(taskId);
    };

    const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newTask: any = {
            id: nanoid(),
            task: formValue,
            status: 0,
        };
        sendDataToApi.mutate(newTask);
    };

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
                                    <button onClick={() => handleDone(task.id)}>
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

    // Fetch data from API
    const FetchSqlData = () => {
        const {isLoading, error, data} = useQuery<any>({
            queryKey: ['repoData'],
            queryFn: () =>
                fetch('http://localhost:3004/tasks').then((res) => res.json()),
            onSuccess: () => {
                // Invalidate and refetch
                queryClient.invalidateQueries({queryKey: ['repoData']});
            },
        });

        if (isLoading) return <div>'Loading...'</div>;

        if (error) return <>'An error has occurred: ' + error.message;</>;

        const taskInputChange = (e: any) => {
            e.preventDefault;
            setValue(e.target.value);
        };

        return (
            <div className='App'>
                <h1>Todo list</h1>
                <>
                    <form onSubmit={handleAddTask}>
                        <input
                            type='text'
                            // value={formValue}
                            onChange={taskInputChange}
                        />
                        <button>Add Task</button>
                    </form>
                </>
                <Tasklist data={data} />
            </div>
        );
    };
    return <FetchSqlData />;
}

export default App;
