import { CalendarIcon, CheckIcon, CirclePlus, Edit, Trash2 } from 'lucide-react';
import { Button } from './components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './components/ui/dialog';
import { Label } from './components/ui/label';
import { Input } from './components/ui/input';
import { ScrollArea } from './components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './components/ui/popover';
import { Calendar } from './components/ui/calendar';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { cn } from './lib/utils';

interface Task {
  task: string;
  status: string;
  data: Date;
}

function App() {
  const [date, setDate] = useState<Date>();
  const [task, setTask] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      console.log('🚀 ~ useEffect ~ savedTasks:', savedTasks)
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  function handleSaveTask() {
    if (date && task.trim() !== '') {
      const newTask: Task = {
        task: task,
        status: 'Pendente',
        data: date,
      };
      setTasks([...tasks, newTask]);

      setTask('');
      setDate(undefined);
    } else {
      alert('Campo Vazio');
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  return (
    <div className='flex flex-col space-y-5 items-center justify-center h-screen'>
      <h1 className='text-zinc-200 text-xl'>Lista de Tarefas</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='secondary' className='flex gap-1'>
            <CirclePlus size={18} />
            Adicionar Tarefa
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Adicionar Tarefa</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='task' className='text-right'>
                Tarefa
              </Label>
              <Input
                id='task'
                className='col-span-3'
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='data' className='text-right'>
                Data
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'ghost'}
                    className={cn(
                      'w-[240px] justify-start text-left font-normal border text-zinc-100',
                      !date && 'text-zinc-300'
                    )}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type='submit' variant='secondary' onClick={handleSaveTask}>
              Salvar Tarefa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ScrollArea className='w-2/4 h-[400px] border border-zinc-700 rounded-md overflow-y-auto'>
        <Table>
          <TableHeader>
            <TableRow className='bg-zinc-100'>
              <TableHead>Tarefa</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tasks.map((tarefa,index) => (
              <TableRow key={index}>
                <TableCell>{tarefa.task}</TableCell>
                <TableCell>{format(tarefa.data, 'dd/MM/yyyy')}</TableCell>
                <TableCell>
                  {tarefa.status == 'Concluído' ? (
                    <div className='flex items-center gap-2'>
                      <div className='size-1.5 rounded-full bg-green-500 animate-pulse' />
                      <p>{tarefa.status}</p>
                    </div>
                  ) : (
                    <div className='flex items-center gap-2'>
                      <div className='size-1.5 rounded-full bg-red-500 animate-pulse' />
                      <p>{tarefa.status}</p>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant={'secondary'}
                    size={'icon'}
                    className=' hover:bg-zinc-50 hover:text-black'
                  >
                    <Edit size={18} />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant={'secondary'}>
                    <CheckIcon size={18} className='text-green-500' /> Concluir
                  </Button>
                </TableCell>
                <TableCell>
                  <Button  className='bg-transparent hover:bg-transparent'>
                    <Trash2 size={18} className='text-red-500' /> 
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}

export default App;
