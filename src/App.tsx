import { CalendarIcon, CirclePlus } from "lucide-react";
import { Button } from "./components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import { Calendar } from "./components/ui/calendar";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { cn } from "./lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CardComponent from "./components/layout/card";

interface Task {
  id: string;
  task: string;
  status: string;
  data: Date;
}
const today = new Date();
const formSchema = z.object({
  task: z
    .string({ required_error: "nome da tarefa é obrigatório." })
    .min(1, { message: "nome da tarefa é obrigatório." }),
  data: z
    .date({ required_error: "Data Obrigatória." })
    .refine((data) => data >= today, {
      message: "A data precisa ser maior ou igual a atual.",
    }),
});

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task: "",
      data: undefined,
    },
  });

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
      const allTasks = JSON.parse(savedTasks);

      setTasks(allTasks);
    }
  }, []);

  function handleSaveTask(values: z.infer<typeof formSchema>) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      task: values.task,
      status: "Pendente",
      data: values.data,
    };
    const newTasks = [newTask, ...tasks];
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
    form.reset();
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
            <form
              onSubmit={form.handleSubmit(handleSaveTask)}
              className="flex flex-col gap-4"
            >
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="task"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tarefa</FormLabel>
                      <Input id="task" className="col-span-3" {...field} />
                      <FormControl></FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="data"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              className={cn(
                                "w-[240px] border bg-transparent pl-3 text-left font-normal hover:bg-zinc-900/50",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>

              <Button type="submit" variant="secondary">
                Salvar Tarefa
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex h-max w-[95%] gap-4 overflow-y-auto border-t border-zinc-600 pt-5 lg:w-3/5 2xl:w-2/4">
        <CardComponent tasksProps={tasks} />
      </div>
    </div>
  );
}

export default App;
