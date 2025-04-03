import { useState, useEffect, useRef } from "react";
import TasksList from "./components/TasksList";
import useForm from "./hooks/useForm";
import livLogo from "./assets/logo.svg";

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
    email: string;
    doctor: string;
    date: string;
    specialty: string;
    desc: string;
}

interface ITasks extends IFormData {
    id: number;
    name: string;
    status: string;
}

const App = () => {

    const [formMsgError, setFormMsgError] = useState<string | null>(null);
    const [formMsgSucce, setFormMsgSucce] = useState<string | null>(null);
    const flagIDUpdate = useRef<number | null>(null);

    const [Tasks, setTasks] = useState<ITasks[]>([]);
    const [appoMsg, setAppoMsg] = useState<string | null>('Cargando...');

    //** useForm Hook to validate forms data :

    const useFormCallBack = (flagSubmit: boolean) => {
        if (!flagSubmit) {
            setFormMsgError('Campos inválidos, debes ingresar como mímimo 4 caractéres!');
            setFormMsgSucce(null);
        } else {
            (flagIDUpdate.current) ? methodUpdate() : methodCreate();
        }
    };

    let initialValue: IFormData = { email: '', doctor: '', date: '', specialty: '', desc: '' };

    const { form, handleChange, handleSubmit, updateForm, resetForm } = useForm(initialValue, useFormCallBack);
    const { email, doctor, date, specialty, desc }: { email?: '', doctor?: '', date?: '', specialty?: '', desc?: '' } = form;

    const fetchTasks = async () => {
        const data = await getTasks();
        if (!data.error) {
            setTasks(data);
            (data.length == 0) ? setAppoMsg('No existen tareas creadas.') : setAppoMsg(null);
        } else {
            setAppoMsg(data.messages.error);
        }
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

    const methodDelete = async (id:number) => {
        const data = await deleteTask(id);
        if (!data.error) {
            fetchTasks();
            setFormMsgSucce(data);
        } else {
            setAppoMsg(data.messages.error);
        }
    };

    const methodEdit = async (id:number) => {
        const data = await editTask(id);
        if (!data.error) {
            flagIDUpdate.current = id;
            updateForm(data);
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

    const methodPatch = async (id:number, status:string) => {
        let params:object = { "status": (status == 'Pendiente') ? 'Completado' : 'Pendiente' };
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
        <div className="container marketing">
            <div className="text-center py-4">
                <img src={livLogo} alt="Vite logo" width="120px" />
            </div>
            <div className="row text-center">
                <h2 className="text-primary py-2">
                    <strong>Ejemplo TypeScript Equipo Médico</strong>
                </h2>
            </div>

            <div className="container marketing">
                <div className="card">
                    <div className="card-header text-center">
                        <h5 className="text-primary pt-2"> <strong></strong> solicita día de antención en el siguiente formulario</h5>
                    </div>

                    <div className="card-body row justify-content-center">
                        <form onSubmit={handleSubmit} style={{ maxWidth: "700px" }}>

                            <div className="row text-center">
                                <div className="col-md-6">
                                    <input
                                        type="email"
                                        placeholder="Ingresar email"
                                        className="form-control my-4"
                                        name="email"
                                        value={email}
                                        onChange={handleChange}
                                        required
                                    />

                                    <input
                                        type="text"
                                        placeholder="Ingresa doctor"
                                        className="form-control my-4"
                                        name="doctor"
                                        value={doctor}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <input
                                        type="date"
                                        placeholder="Ingresar fecha"
                                        className="form-control my-4"
                                        name="date"
                                        value={date}
                                        onChange={handleChange}
                                        required
                                    />

                                    <input
                                        type="text"
                                        placeholder="Ingresar especialidad"
                                        className="form-control my-4"
                                        name="specialty"
                                        value={specialty}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                            </div>

                            <textarea
                                placeholder="Ingresar detalles de la dolencia"
                                className="form-control"
                                name="desc"
                                value={desc}
                                onChange={handleChange}
                                required
                            ></textarea>

                            <div className="pt-4 pb-2 text-center">
                                <input
                                    type="submit"
                                    className="btn btn-primary"
                                    value="Guardar y enviar Reserva &raquo;"
                                />
                            </div>
                        </form>
                    </div>
                </div>

                <div className="text-center">
                    {formMsgError && <p className="text-danger my-3" style={{ marginBottom: "0" }}>  {formMsgError} </p>}
                    {formMsgSucce && <p className="text-success my-3" style={{ marginBottom: "0" }}> {formMsgSucce} </p>}
                </div>

                <TasksList
                    appoMsg={appoMsg}
                    Tasks={Tasks}
                    methodDelete={methodDelete}
                    methodEdit={methodEdit}
                    methodPatch={methodPatch} 
                />
            </div>

        </div>
    );
};

export default App;