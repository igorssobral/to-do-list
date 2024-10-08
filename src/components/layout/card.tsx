import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { CheckIcon, Trash2 } from "lucide-react";
import { Label } from "../ui/label";

interface Task {
  id: string;
  task: string;
  status: string;
  data: Date;
}
type CardProps = {
  tasksProps: Task[];
  sync: ()=>void;
};

export default function CardComponent({ tasksProps, sync }: CardProps) {
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
    sync()
  }

  return (
    <>
      {tasks.map((task) => (
        <Card className='w-64' key={task.id}>
          <CardHeader>
          <Label>Tarefa:</Label>
            <CardTitle>{task.task}</CardTitle>
           
          </CardHeader>
          <CardContent className="grid gap-4">
            <Label>Data:</Label>
            <span className="rounded-lg bg-white p-2 font-semibold text-zinc-900">
              {format(task.data, "dd/MM/yyyy")}
            </span>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            {task.status === "Concluído" ? (
              <span className="flex w-full items-center justify-center gap-2">
                <CheckIcon size={18} className="text-green-500 animate-pulse" />
                Tarefa Concluída
              </span>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant={"secondary"}
                    size="sm"
                    className="w-full text-xs"
                  >
                    {" "}
                    <CheckIcon size={18} className="text-green-500" />
                    Concluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Concluir Tarefa?</AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleFinishTask(task)}>
                      Concluir Tarefa
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full" variant={"destructive"}>
                  <Trash2 size={18} className="text-white" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir Tarefa?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteTask(task)}>
                    Excluir Tarefa
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
