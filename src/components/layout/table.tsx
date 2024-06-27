import { CheckIcon, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { format } from "date-fns";

interface Task {
  id: string;
  task: string;
  status: string;
  data: Date;
}
type TableProps = {
  tasksProps: Task[];
};
export default function TableTasks({ tasksProps }: TableProps) {
  const [tasks, setTasks] = useState<Task[]>(tasksProps);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
      const allTasks = JSON.parse(savedTasks);

      setTasks(allTasks);
    }
  }, [tasksProps]);

  function handleFinishTask(task: Task): void {
    const taskT = tasks.find((t) => t.id === task.id);
    if (taskT) {
      const updateTask = {
        id: taskT.id,
        task: taskT.task,
        data: taskT.data,
        status: "Concluído",
      };
      const tempTasks = tasks.filter((task) => task.id !== taskT.id);
      const updatedTasks = [...tempTasks, updateTask];
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }
  }

  function handleDeleteTask(task: Task): void {
    const updatedTasks = tasks.filter((t) => t.id !== task.id);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-zinc-100 hover:bg-zinc-100">
          <TableHead>Tarefa</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {tasks.map((tarefa) => (
          <TableRow key={tarefa.id}>
            <TableCell>{tarefa.task}</TableCell>
            <TableCell>{format(tarefa.data, "dd/MM/yyyy")}</TableCell>
            <TableCell className="text-xs">
              {tarefa.status == "Concluído" ? (
                <div className="flex items-center gap-2">
                  <div className="size-1.5 animate-pulse rounded-full bg-green-500" />
                  <p>{tarefa.status}</p>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="size-1.5 animate-pulse rounded-full bg-red-500" />
                  <p>{tarefa.status}</p>
                </div>
              )}
            </TableCell>
            <TableCell>
              {tarefa.status === "Concluído" ? (
                <CheckIcon size={18} className="text-green-500" />
              ) : (
                <Button
                  variant={"secondary"}
                  size="sm"
                  className="text-xs"
                  onClick={() => handleFinishTask(tarefa)}
                >
                  {/* <CheckIcon size={18} className="text-green-500" /> */}
                  Concluir
                </Button>
              )}
            </TableCell>
            <TableCell>
              {/* <Button
                variant={"secondary"}
                size={"icon"}
                className="bg-transparent hover:bg-transparent"
              >
                <Edit size={18} className="text-zinc-200 size-3" />
              </Button> */}
              <Button
                className="bg-transparent p-0 hover:bg-transparent"
                onClick={() => handleDeleteTask(tarefa)}
              >
                <Trash2 size={18} className="text-red-500" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
