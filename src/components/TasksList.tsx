interface ITasks {
    id: number;
    title: string;
    name: string;
    priority: string;
    date: string;
    desc: string;
    status: string;
}

type TasksTypes = {
    appoMsg: string | null;
    Tasks: ITasks[];
    methodDelete(id: number): void,
    methodEdit(id: number): void,
    methodPatch(id: number, status: string): void,
};

const formatDate = (date: string) => {
    return date.replace(/^(\d{4})-(\d{2})-(\d{2})$/g, '$3/$2/$1');
}

const TasksList = ({ appoMsg, Tasks, methodDelete, methodEdit, methodPatch }: TasksTypes) => {
    return (

        <div className="grid xs:grid-cols-1 xs:gap-1 sm:grid-cols-1 sm:gap-1 md:grid-cols-3 md:gap-3 mx-4 mb-4">
            {appoMsg && <p className="text-primary" style={{ marginBottom: "0" }}>{appoMsg}</p>}

            {Tasks.map((row) => (

                <div className="m-2 p-2 bg-gray-800 rounded-lg text-gray-300 shadow-md" key={row.id}>

                    <div className="m-1 p-1 mb-4">
                        <span className="cust-status">{row.status}</span> <span className="cust-status"> PRIORIDAD {row.priority}</span>
                        <h2 className="mt-2 mb-2  font-bold">{row.title}</h2>
                        <p className="text-sm">{row.desc}</p>

                        <div className="mt-3">
                            <p className="text-xs"> Asignado a: {row.name} •• Plazo entrega: {formatDate(row.date)}</p>
                        </div>
                    </div>
                    <div className="flex justify-center border-t text-xs text-gray-700">
                        <div className="pt-4 pb-2">

                            {(row.status == 'Completado')
                                ? <button className="cust-sm-btns bg-blue-800" onClick={() => methodPatch(row.id, row.status)}>Pendiente</button>
                                : <button className="cust-sm-btns bg-green-900" onClick={() => methodPatch(row.id, row.status)}>Completado</button>
                            }

                            <button className="cust-sm-btns bg-purple-900" onClick={() => methodEdit(row.id)}>Editar</button>
                            <button className="cust-sm-btns bg-red-900" onClick={() => methodDelete(row.id)}>Eliminar</button>
                        </div>
                    </div>
                </div>
            ))}

        </div>
    );
};

export default TasksList;