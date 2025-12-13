import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task, TaskStatus } from '../types';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { formatDate } from '../lib/utils';
import { GripVertical, User } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
}

const columns: { id: TaskStatus; title: string }[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'in_progress', title: 'En Progreso' },
  { id: 'review', title: 'Revisión' },
  { id: 'done', title: 'Completadas' },
];

export function KanbanBoard({ tasks }: KanbanBoardProps) {
  const { moveTask } = useStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;
    
    // Check if dropped on a column
    const column = columns.find((col) => col.id === overId);
    if (column) {
      moveTask(taskId, column.id);
      return;
    }

    // Check if dropped on another task (use its column)
    const droppedTask = tasks.find((t) => t.id === overId);
    if (droppedTask) {
      moveTask(taskId, droppedTask.estado);
    }
  };

  const tasksByColumn = columns.reduce((acc, column) => {
    acc[column.id] = tasks.filter((task) => task.estado === column.id);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid gap-4 md:grid-cols-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={tasksByColumn[column.id] || []}
          />
        ))}
      </div>
      <DragOverlay>
        {activeId ? (
          <KanbanCard task={tasks.find((t) => t.id === activeId)!} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function KanbanColumn({
  column,
  tasks,
}: {
  column: { id: TaskStatus; title: string };
  tasks: Task[];
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });
  const taskIds = tasks.map((t) => t.id);

  const columnColors = {
    backlog: 'bg-gray-100 dark:bg-gray-800',
    in_progress: 'bg-blue-100 dark:bg-blue-900/30',
    review: 'bg-orange-100 dark:bg-orange-900/30',
    done: 'bg-green-100 dark:bg-green-900/30',
  };

  const columnBorders = {
    backlog: 'border-gray-300 dark:border-gray-700',
    in_progress: 'border-blue-300 dark:border-blue-700',
    review: 'border-orange-300 dark:border-orange-700',
    done: 'border-green-300 dark:border-green-700',
  };

  return (
    <div 
      ref={setNodeRef} 
      className={`flex flex-col rounded-lg border-2 p-3 transition-colors ${
        isOver 
          ? `border-primary bg-primary/5 ${columnBorders[column.id]}` 
          : `${columnBorders[column.id]} bg-card`
      }`}
    >
      <div className={`mb-2 flex items-center justify-between rounded-md px-2 py-1.5 ${columnColors[column.id]}`}>
        <h3 className="text-sm font-semibold">{column.title}</h3>
        <Badge variant="secondary">{tasks.length}</Badge>
      </div>
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 min-h-[200px]">
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} />
          ))}
          {tasks.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-8">
              Arrastra tareas aquí
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

function KanbanCard({ task, isDragging }: { task: Task; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({
    id: task.id,
  });
  const { people } = useStore();
  const assignedPerson = task.asignadoA ? people.find((p) => p.id === task.asignadoA) : null;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? 'shadow-lg scale-105' : ''} transition-transform`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm flex-1">{task.titulo}</CardTitle>
          <div {...attributes} {...listeners} className="cursor-grab touch-none">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {task.descripcion && (
          <p className="text-xs text-muted-foreground line-clamp-2">{task.descripcion}</p>
        )}
        <div className="flex items-center justify-between gap-2">
          {task.dueDate && (
            <p className="text-xs text-muted-foreground">
              {formatDate(task.dueDate)}
            </p>
          )}
          {assignedPerson && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span className="truncate max-w-[80px]">{assignedPerson.nombre.split(' ')[0]}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

