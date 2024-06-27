import { CalendarIcon, CirclePlus } from "lucide-react";
import { Button } from "./components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { ScrollArea } from "./components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import { Calendar } from "./components/ui/calendar";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { cn } from "./lib/utils";
import TableTasks from "./components/layout/table";

interface Task {
  id: string;
  task: string;
  status: string;
  data: Date;
}

function App() {
  const [date, setDate] = useState<Date>();
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
      const allTasks = JSON.parse(savedTasks);

      setTasks(allTasks);
    }
  }, []);

  function handleSaveTask() {
    if (date && task.trim() !== "") {
      const newTask: Task = {
        id: crypto.randomUUID(),
        task: task,
        status: "Pendente",
        data: date,
      };
      const newTasks = [newTask, ...tasks];
      setTasks(newTasks);
      localStorage.setItem("tasks", JSON.stringify(newTasks));

      setTask("");
      setDate(undefined);
    } else {
      alert("Campo Vazio");
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-5">
      <h1 className="text-xl text-zinc-200">Lista de Tarefas</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" className="flex gap-1">
            <CirclePlus size={18} />
            Adicionar Tarefa
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Tarefa</DialogTitle>
            <DialogDescription>
              Adicione suas tarefas e organize sua rotina facilmente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task" className="text-right">
                Tarefa
              </Label>
              <Input
                id="task"
                className="col-span-3"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="data" className="text-right">
                Data
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"ghost"}
                    className={cn(
                      "w-[240px] justify-start border text-left font-normal text-zinc-100",
                      !date && "text-zinc-300",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" variant="secondary" onClick={handleSaveTask}>
              Salvar Tarefa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ScrollArea className="h-[400px] w-[95%] overflow-y-auto rounded-md border border-zinc-700 lg:w-3/5 2xl:w-2/4">
        <TableTasks tasksProps={tasks} />
      </ScrollArea>
    </div>
  );
}

export default App;
