import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
};

export default function CardComponent({ tasksProps }: CardProps) {
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
    <>
      {tasks.map((task) => (
        <Card id={task.id}>
          <CardHeader>
            <CardTitle>{task.task}</CardTitle>
            <CardDescription>You have 3 unread messages.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Label>Descrição</Label>
            <div className="flex h-24 items-center space-x-4 rounded-md border border-zinc-700 p-4">
              <p className="text-sm text-zinc-400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmo incididunt ut labore et dolore magna aliqua. Ut .
              </p>
            </div>
            <Label>Data:</Label>
            <span className="rounded-lg bg-white p-2 font-semibold text-zinc-900">
              {format(task.data, "dd/MM/yyyy")}
            </span>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            {task.status === "Concluído" ? (
              <span className="flex w-full items-center justify-center gap-2">
                <CheckIcon size={18} className="text-green-500" />
                Tarefa Concluída{" "}
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
