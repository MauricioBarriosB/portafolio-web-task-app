import { useState, useEffect, useRef } from "react";
import TasksList from "./components/TasksList";
import useForm from "./hooks/useForm";

// ** API REST -> CRUD Methods :

import {
    createTask,
    getTasks,
    editTask,
    updateTask,
    patchTask,
    deleteTask
} from './services/DocsApi';

interface IFormData {
    title: string;
    name: string;
    date: string;
    priority: string;
    code: string;
    desc: string;
}

interface ITasks extends IFormData {
    id: number;
    status: string;
}

const App = () => {
    const [formMsgError, setFormMsgError] = useState<string | null>(null);
    const [formMsgSucce, setFormMsgSucce] = useState<string | null>('Ingrese una nueva tarea mediante el siguiente formulario.');
    const flagIDUpdate = useRef<number | null>(null);
    const [Tasks, setTasks] = useState<ITasks[]>([]);
    const [appoMsg, setAppoMsg] = useState<string | null>('Cargando listado de tareas, por favor espere un momento...');

    //** useForm Hook to validate forms data :

    const useFormCallBack = (flagSubmit: boolean) => {
        if (!flagSubmit) {
            setFormMsgSucce('Ingrese una nueva tarea.');
            flagIDUpdate.current = null;
        } else {
            (flagIDUpdate.current) ? methodUpdate() : methodCreate();
        }
    };

    let initialValue: IFormData = { title: '', name: '', date: '', priority: '', code: '', desc: '' };
    const { form, handleChange, handleSubmit, updateForm, resetForm } = useForm(initialValue, useFormCallBack);
    const { title, name, date, priority, code, desc }: { title?: '', name?: '', date?: '', priority?: '', code?: '', desc?: '' } = form;

    const fetchTasks = async () => {
        const data = await getTasks();
        if (!data.error) {
            setTasks(data);
            (data.length == 0) ? setAppoMsg('No existen tareas creadas.') : setAppoMsg(null);
        } else {
            setAppoMsg(data.messages.error);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    };

    // ** API REST -> CRUD Methods :

    const methodCreate = async () => {
        const data = await createTask(form);
        if (!data.error) {
            setFormMsgError(null);
            setFormMsgSucce(data);
            resetForm();
            fetchTasks();
        } else {
            setFormMsgError(data.messages.error);
        }
    };

    const methodDelete = async (id: number) => {
        const data = await deleteTask(id);
        if (!data.error) {
            fetchTasks();
            setFormMsgSucce(data);
        } else {
            setAppoMsg(data.messages.error);
        }
    };

    const methodEdit = async (id: number) => {
        const data = await editTask(id);
        if (!data.error) {
            flagIDUpdate.current = id;
            updateForm(data);
            setFormMsgSucce('Edite la tarea actualizando los campos de formulario.');
            scrollToTop();
        } else {
            setAppoMsg(data.messages.error);
        }
    };

    const methodUpdate = async () => {
        const data = await updateTask(flagIDUpdate.current, form);
        if (!data.error) {
            setFormMsgSucce(data);
            resetForm();
            fetchTasks();
            flagIDUpdate.current = null;
        } else {
            setFormMsgError(data.messages.error);
        }
    };

    const methodPatch = async (id: number, status: string) => {
        let params: object = { "status": (status == 'Pendiente') ? 'Completado' : 'Pendiente' };
        const data = await patchTask(id, params);
        if (!data.error) {
            fetchTasks();
            setFormMsgSucce(data);
        } else {
            setAppoMsg(data.messages.error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="w-full ">
            <div className="flex justify-center">
                <form className="w-full max-w-4xl mb-6 text-center" onSubmit={handleSubmit}>

                    <h1 className="text-2xl m-4 uppercase font-bold">Mantenedor de Tareas</h1>

                    {formMsgError && <p className="text-red-200" style={{ marginBottom: "0" }}> {formMsgError} </p>}
                    {formMsgSucce && <p className="text-green-200" style={{ marginBottom: "0" }}> {formMsgSucce} </p>}

                    <div className="flex flex-wrap text-left mt-6">

                        <div className="w-full md:w-1/2 px-3 mb-6">
                            <label className="cust-label">Título tarea</label>

                            <input
                                className="cust-input"
                                name="title"
                                type="text"
                                value={title}
                                placeholder="Título Tarea"
                                onChange={handleChange}
                                required />
                        </div>

                        <div className="w-full md:w-1/2 px-3 mb-6">
                            <label className="cust-label">Nombre colaborador</label>

                            <input
                                className="cust-input"
                                name="name"
                                type="text"
                                value={name}
                                placeholder="Nombre colaborador"
                                onChange={handleChange}
                                required />
                        </div>

                    </div>

                    <div className="flex flex-wrap mb-6 text-left">
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                            <label className="cust-label">Plazo finalización</label>
                            <input
                                className="cust-input"
                                type="date"
                                placeholder="Ingresar fecha termino"
                                name="date"
                                value={date}
                                onChange={handleChange}
                                required />
                        </div>

                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                            <label className="cust-label">Prioridad</label>

                            <div className="relative">
                                <select name="priority" className="cust-select" onChange={handleChange} value={priority} required>
                                    <option value="">Seleccionar prioridad</option>
                                    <option value="Baja">Baja</option>
                                    <option value="Media">Media</option>
                                    <option value="Alta">Alta</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>

                        </div>

                        <div className="w-full md:w-1/3 px-3 md:mb-0">
                            <label className="cust-label">Código seguimiento</label>
                            <input
                                className="cust-input"
                                placeholder="123456"
                                name="code"
                                type="text"
                                value={code}
                                onChange={handleChange} />
                        </div>
                    </div>

                    <div className="flex flex-wrap mb-6 text-left">
                        <div className="w-full px-3">
                            <label className="cust-label">Descripción tarea asignada</label>
                            <textarea
                                className="cust-input"
                                placeholder="Descripción de tarea"
                                name="desc"
                                value={desc}
                                onChange={handleChange}
                                required />
                            <p className="text-gray-400 text-xs italic my-2">* Agregar la descripción detallada de la tarea a realizar por el colaborador</p>
                        </div>
                    </div>
                    
                    <div className="">
                    <button type="submit" className="cust-primary-button"> Enviar tarea </button>
                    <button type="button" className="cust-primary-button" onClick={resetForm}> Cancelar </button>
                    </div>
                </form>
            </div>
            <hr className = "mb-4 text-gray-800"/>
            <TasksList
                appoMsg={appoMsg}
                Tasks={Tasks}
                methodDelete={methodDelete}
                methodEdit={methodEdit}
                methodPatch={methodPatch}
            />
        </div>
    )
};

export default App;